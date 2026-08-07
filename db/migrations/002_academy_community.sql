-- =============================================================================
-- 002 — Academy, communauté et paiements
-- =============================================================================
--
-- La migration 001 a posé le compte client : s'inscrire, faire son audit,
-- télécharger, suivre son projet. Celle-ci ouvre ce que l'espace doit
-- réellement offrir, décidé avec l'utilisateur le 2026-08-07 :
--
--   1. une organisation (ONG, entreprise) inscrit **ses agents** ;
--   2. un membre lit le blog, **aime** un article et le **commente** ;
--   3. il retrouve **ses propres commentaires** et ce qu'il a aimé ;
--   4. il suit un **cours** — modules, leçons, progression, **quiz** ;
--   5. il **paie** une formation ou une ressource par Mobile Money ;
--   6. il participe au **forum** et peut **créer sa communauté** ;
--   7. l'**admin** administre tout cela.
--
-- Trois décisions prises avec l'utilisateur, qui expliquent la forme du schéma :
--
-- * **Authentification maison par lien magique.** Neon Auth a été écarté : il
--   aurait imposé une table de comptes parallèle à `users` et fait partir les
--   e-mails hors de Brevo. `users.id` reste donc la clé unique de tout ce
--   fichier — un seul endroit dit qui est qui.
--
-- * **Mobile Money uniquement** (M-Pesa, Airtel, Orange, AfriMoney via
--   FlexPay.cd). C'est le moyen de paiement réel du marché visé. Le schéma ne
--   fait aucune place à la carte bancaire tant que la décision tient.
--
-- * **Les communautés passent par une validation admin.** Une communauté
--   existe en base dès sa demande mais reste invisible jusqu'à `approved_at` :
--   la modération est préventive, pas réactive.
--
-- Migration idempotente : `IF NOT EXISTS` partout, rejouable sans dommage. Le
-- pilote HTTP n'ouvre pas de transaction englobante (voir `scripts/migrate.mjs`)
-- — une instruction qui échouerait laisserait les précédentes appliquées.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Profil public
-- -----------------------------------------------------------------------------
--
-- Dès qu'un membre commente ou ouvre un sujet, son nom s'affiche à d'autres
-- personnes. `users` ne portait que de l'identité administrative ; il lui faut
-- de quoi se présenter.
--
-- `handle` est l'identifiant public — l'URL d'un profil, la mention dans le
-- forum. Il est distinct de l'e-mail **exprès** : personne ne doit déduire une
-- adresse e-mail d'une signature de message.

ALTER TABLE users ADD COLUMN IF NOT EXISTS handle citext UNIQUE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url text;
ALTER TABLE users ADD COLUMN IF NOT EXISTS headline text;
ALTER TABLE users ADD COLUMN IF NOT EXISTS bio text;
-- Dernière activité : sert à distinguer un compte vivant d'un compte dormant
-- avant d'envoyer une relance. Nul tant que la personne ne s'est jamais
-- connectée.
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_seen_at timestamptz;
-- Suspension : un compte banni du forum garde ses données et perd l'écriture.
-- Supprimer la ligne effacerait aussi ses messages par cascade, ce qui trouerait
-- les fils de discussion des autres.
ALTER TABLE users ADD COLUMN IF NOT EXISTS suspended_at timestamptz;

-- -----------------------------------------------------------------------------
-- Organisations et agents
-- -----------------------------------------------------------------------------
--
-- Une ONG ou une entreprise n'est pas un utilisateur : c'est un ensemble de
-- personnes avec un responsable. Le compte qui achète une formation d'équipe
-- n'est pas celui qui la suit.
--
-- `users.organization` (texte libre, migration 001) reste : c'est ce que le
-- visiteur a tapé dans le formulaire de contact, avant tout compte. Cette
-- table-ci porte l'organisation **constituée**, celle qui a un responsable et
-- des membres. Les deux ne disent pas la même chose et ne se remplacent pas.

CREATE TABLE IF NOT EXISTS organizations (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        citext NOT NULL UNIQUE,
  name        text NOT NULL,
  -- Reprend les `orgTypes` du formulaire de contact. Texte contraint plutôt
  -- qu'enum : la liste bouge côté produit.
  kind        text NOT NULL DEFAULT 'company'
              CHECK (kind IN ('company', 'ngo', 'public', 'school', 'other')),
  -- Le responsable. `ON DELETE SET NULL` et non `CASCADE` : la suppression du
  -- compte d'un directeur ne doit pas emporter l'organisation et ses agents.
  owner_id    uuid REFERENCES users(id) ON DELETE SET NULL,
  country     text NOT NULL DEFAULT 'CD',
  city        text,
  website     text,
  logo_url    text,
  -- Plafond d'agents. NULL = illimité. Sert de garde-fou commercial : une
  -- licence d'équipe vendue pour dix personnes ne doit pas en accueillir cent.
  seats_limit smallint,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS organizations_owner_idx ON organizations (owner_id);

-- Les agents. `role` dit ce que la personne peut faire **dans son
-- organisation**, sans rapport avec `users.role` qui gouverne la plateforme :
-- un `admin` d'organisation n'a aucun pouvoir sur RapIA.
CREATE TABLE IF NOT EXISTS organization_members (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id         uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role            text NOT NULL DEFAULT 'agent'
                  CHECK (role IN ('owner', 'admin', 'agent')),
  title           text,
  joined_at       timestamptz NOT NULL DEFAULT now(),
  -- Une personne peut appartenir à deux organisations (un consultant), mais
  -- jamais deux fois à la même : sans cette contrainte, un double clic sur
  -- « inviter » fausse le décompte des sièges.
  UNIQUE (organization_id, user_id)
);

CREATE INDEX IF NOT EXISTS organization_members_user_idx
  ON organization_members (user_id);

-- Invitations d'agents qui n'ont pas encore de compte.
--
-- Table séparée de `organization_members` **exprès** : un membre invité n'est
-- pas un membre. Le fusionner obligerait à créer un `users` fantôme à chaque
-- adresse saisie, et une invitation jamais acceptée laisserait un compte
-- vide dans les statistiques.
--
-- Comme `auth_tokens`, on stocke un **hash** du jeton : une fuite de la table
-- ne doit pas suffire à rejoindre une organisation.
CREATE TABLE IF NOT EXISTS organization_invites (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  email           citext NOT NULL,
  role            text NOT NULL DEFAULT 'agent'
                  CHECK (role IN ('admin', 'agent')),
  token_hash      text NOT NULL UNIQUE,
  invited_by      uuid REFERENCES users(id) ON DELETE SET NULL,
  expires_at      timestamptz NOT NULL,
  accepted_at     timestamptz,
  revoked_at      timestamptz,
  created_at      timestamptz NOT NULL DEFAULT now()
);

-- Une seule invitation vivante par adresse et par organisation. L'index
-- partiel laisse passer une nouvelle invitation après acceptation ou
-- révocation — c'est le cas normal d'un agent qui revient.
CREATE UNIQUE INDEX IF NOT EXISTS organization_invites_pending_idx
  ON organization_invites (organization_id, email)
  WHERE accepted_at IS NULL AND revoked_at IS NULL;

-- Rattachement d'un compte à son organisation, pour les données déjà en place.
ALTER TABLE projects ADD COLUMN IF NOT EXISTS organization_id
  uuid REFERENCES organizations(id) ON DELETE SET NULL;
ALTER TABLE workflow_audits ADD COLUMN IF NOT EXISTS organization_id
  uuid REFERENCES organizations(id) ON DELETE SET NULL;

-- -----------------------------------------------------------------------------
-- Blog social — commentaires et « j'aime »
-- -----------------------------------------------------------------------------

-- Fil de commentaires. `parent_id` autorise une réponse à un commentaire :
-- sans lui, une discussion à trois voix devient illisible.
--
-- `deleted_at` plutôt qu'un DELETE : effacer la ligne ferait disparaître les
-- réponses qu'elle porte. Un commentaire retiré affiche « supprimé » et garde
-- sa place dans le fil.
CREATE TABLE IF NOT EXISTS post_comments (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id    uuid NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  author_id  uuid REFERENCES users(id) ON DELETE SET NULL,
  parent_id  uuid REFERENCES post_comments(id) ON DELETE CASCADE,
  body       text NOT NULL,
  -- `pending` est le défaut : rien ne s'affiche sans être passé par la
  -- modération, conformément au parti pris retenu pour les communautés.
  status     text NOT NULL DEFAULT 'pending'
             CHECK (status IN ('pending', 'published', 'spam', 'removed')),
  moderated_by uuid REFERENCES users(id) ON DELETE SET NULL,
  moderated_at timestamptz,
  deleted_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS post_comments_post_idx
  ON post_comments (post_id, created_at);
-- « Mes commentaires » : la vue que l'utilisateur a demandée dans son espace.
CREATE INDEX IF NOT EXISTS post_comments_author_idx
  ON post_comments (author_id, created_at DESC);
CREATE INDEX IF NOT EXISTS post_comments_moderation_idx
  ON post_comments (status, created_at) WHERE status = 'pending';

-- -----------------------------------------------------------------------------
-- Forum et communautés
-- -----------------------------------------------------------------------------
--
-- Une communauté est un espace de discussion créé par un membre. Elle n'existe
-- publiquement qu'une fois `approved_at` renseigné — décision produit : la
-- modération est préventive. Une communauté refusée garde sa ligne et son
-- motif, pour qu'on puisse expliquer le refus à son auteur.

CREATE TABLE IF NOT EXISTS communities (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug         citext NOT NULL UNIQUE,
  name         text NOT NULL,
  description  text,
  cover_url    text,
  owner_id     uuid REFERENCES users(id) ON DELETE SET NULL,
  -- Une communauté peut appartenir à une organisation — l'espace privé des
  -- agents d'une ONG — ou à personne d'autre que son fondateur.
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  visibility   text NOT NULL DEFAULT 'public'
               CHECK (visibility IN ('public', 'private')),
  -- `public`  : lisible par tous, écriture réservée aux membres.
  -- `private` : invisible hors de ses membres.
  locale       text NOT NULL DEFAULT 'fr' CHECK (locale IN ('fr', 'en')),
  approved_by  uuid REFERENCES users(id) ON DELETE SET NULL,
  approved_at  timestamptz,
  rejected_at  timestamptz,
  rejection_reason text,
  archived_at  timestamptz,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);

-- La file de modération : les demandes en attente, les plus anciennes d'abord.
CREATE INDEX IF NOT EXISTS communities_pending_idx
  ON communities (created_at)
  WHERE approved_at IS NULL AND rejected_at IS NULL;
CREATE INDEX IF NOT EXISTS communities_public_idx
  ON communities (approved_at DESC)
  WHERE visibility = 'public' AND approved_at IS NOT NULL AND archived_at IS NULL;
CREATE INDEX IF NOT EXISTS communities_owner_idx ON communities (owner_id);

CREATE TABLE IF NOT EXISTS community_members (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id uuid NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
  user_id      uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role         text NOT NULL DEFAULT 'member'
               CHECK (role IN ('owner', 'moderator', 'member')),
  -- `pending` sert aux communautés privées : la demande d'adhésion attend le
  -- fondateur. `banned` conserve la ligne — sans elle, la personne exclue
  -- rejoindrait à nouveau dans la seconde.
  status       text NOT NULL DEFAULT 'active'
               CHECK (status IN ('pending', 'active', 'banned')),
  joined_at    timestamptz NOT NULL DEFAULT now(),
  UNIQUE (community_id, user_id)
);

CREATE INDEX IF NOT EXISTS community_members_user_idx
  ON community_members (user_id, status);

-- Sujets du forum.
--
-- `community_id` nul = forum général de la plateforme. C'est ce qui permet
-- d'ouvrir le forum avant qu'une seule communauté existe, sans table séparée
-- qu'il faudrait fusionner ensuite.
CREATE TABLE IF NOT EXISTS forum_topics (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id uuid REFERENCES communities(id) ON DELETE CASCADE,
  author_id    uuid REFERENCES users(id) ON DELETE SET NULL,
  slug         citext NOT NULL,
  title        text NOT NULL,
  body         text NOT NULL,
  is_pinned    boolean NOT NULL DEFAULT false,
  is_locked    boolean NOT NULL DEFAULT false,
  -- Compteurs dénormalisés. Une liste de sujets affiche le nombre de réponses
  -- de chaque ligne : le calculer par sous-requête coûte un parcours de
  -- `forum_replies` par sujet affiché. Ils sont tenus par trigger plus bas —
  -- **ne jamais les écrire depuis le code applicatif.**
  reply_count  integer NOT NULL DEFAULT 0,
  last_reply_at timestamptz,
  deleted_at   timestamptz,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);

-- Le slug est unique dans sa communauté, pas sur toute la plateforme : deux
-- communautés peuvent ouvrir un sujet « presentations ». `COALESCE` sur un
-- UUID nul donne au forum général sa propre clé de portée — un index sur
-- `(community_id, slug)` laisserait passer les doublons côté forum général,
-- puisqu'en SQL deux NULL ne sont jamais égaux.
CREATE UNIQUE INDEX IF NOT EXISTS forum_topics_slug_idx
  ON forum_topics (COALESCE(community_id, '00000000-0000-0000-0000-000000000000'::uuid), slug);
CREATE INDEX IF NOT EXISTS forum_topics_recent_idx
  ON forum_topics (community_id, is_pinned DESC, last_reply_at DESC NULLS LAST)
  WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS forum_topics_author_idx
  ON forum_topics (author_id, created_at DESC);

CREATE TABLE IF NOT EXISTS forum_replies (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id   uuid NOT NULL REFERENCES forum_topics(id) ON DELETE CASCADE,
  author_id  uuid REFERENCES users(id) ON DELETE SET NULL,
  parent_id  uuid REFERENCES forum_replies(id) ON DELETE CASCADE,
  body       text NOT NULL,
  -- Réponse retenue par l'auteur du sujet. Une seule par sujet, garantie par
  -- l'index partiel plus bas : deux « bonnes réponses » n'en font aucune.
  is_answer  boolean NOT NULL DEFAULT false,
  deleted_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS forum_replies_topic_idx
  ON forum_replies (topic_id, created_at);
CREATE INDEX IF NOT EXISTS forum_replies_author_idx
  ON forum_replies (author_id, created_at DESC);
CREATE UNIQUE INDEX IF NOT EXISTS forum_replies_answer_idx
  ON forum_replies (topic_id) WHERE is_answer;

-- -----------------------------------------------------------------------------
-- « J'aime »
-- -----------------------------------------------------------------------------
--
-- Une seule table pour les trois objets aimables, avec **une clé étrangère
-- réelle par cible** plutôt qu'un couple `(type, id)` sans contrainte. Le
-- schéma « polymorphe » classique est plus court à écrire et laisse la base
-- accumuler des « j'aime » pointant vers des articles supprimés ; ici la
-- cascade fait le ménage toute seule.
--
-- `num_nonnulls(...) = 1` garantit qu'une ligne vise exactement une cible.

CREATE TABLE IF NOT EXISTS likes (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  post_id    uuid REFERENCES posts(id) ON DELETE CASCADE,
  topic_id   uuid REFERENCES forum_topics(id) ON DELETE CASCADE,
  reply_id   uuid REFERENCES forum_replies(id) ON DELETE CASCADE,
  comment_id uuid REFERENCES post_comments(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT likes_one_target
    CHECK (num_nonnulls(post_id, topic_id, reply_id, comment_id) = 1)
);

-- Un « j'aime » par personne et par objet. Index partiels : une contrainte
-- UNIQUE ordinaire sur les quatre colonnes laisserait passer autant de
-- doublons qu'on veut, puisque les trois colonnes nulles ne s'égalent jamais.
CREATE UNIQUE INDEX IF NOT EXISTS likes_post_idx
  ON likes (user_id, post_id) WHERE post_id IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS likes_topic_idx
  ON likes (user_id, topic_id) WHERE topic_id IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS likes_reply_idx
  ON likes (user_id, reply_id) WHERE reply_id IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS likes_comment_idx
  ON likes (user_id, comment_id) WHERE comment_id IS NOT NULL;
-- « Ce que j'ai aimé », la vue demandée dans l'espace membre.
CREATE INDEX IF NOT EXISTS likes_user_idx ON likes (user_id, created_at DESC);

-- -----------------------------------------------------------------------------
-- RAPIA Academy — cours, leçons, progression
-- -----------------------------------------------------------------------------
--
-- `training_sessions` (migration 001) porte les formations **datées, animées
-- par un humain**. Ces tables-ci portent le cours **suivi en autonomie** :
-- l'un a des places et un formateur, l'autre a des leçons et une progression.
-- Les confondre aurait donné une table où la moitié des colonnes est toujours
-- nulle.

CREATE TABLE IF NOT EXISTS courses (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug         citext NOT NULL UNIQUE,
  title_fr     text NOT NULL,
  title_en     text NOT NULL,
  summary_fr   text,
  summary_en   text,
  cover_url    text,
  -- Identifiant du module au catalogue (`messages/*.json`), quand le cours en
  -- reprend un. Nul pour un cours qui n'existe qu'en ligne.
  module_key   text,
  -- Reprend les trois niveaux du site : 1 discuter, 2 connecter, 3 déléguer.
  -- Même échelle que `workflow_audits.maturity_level` — un audit qui rend 2
  -- peut ainsi recommander les cours de niveau 2.
  level        smallint CHECK (level BETWEEN 1 AND 3),
  duration_minutes integer,
  -- `free`    : accessible à tout compte vérifié.
  -- `paid`    : exige une commande payée.
  -- `client`  : réservé aux comptes ayant un projet en cours.
  access       text NOT NULL DEFAULT 'free'
               CHECK (access IN ('free', 'paid', 'client')),
  -- En centimes, jamais en flottant : 0,1 + 0,2 ≠ 0,3 en virgule flottante, et
  -- une facture fausse d'un centime est une facture fausse.
  price_cents  integer NOT NULL DEFAULT 0 CHECK (price_cents >= 0),
  currency     text NOT NULL DEFAULT 'USD' CHECK (currency IN ('USD', 'CDF')),
  is_published boolean NOT NULL DEFAULT false,
  published_at timestamptz,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now(),
  -- Un cours payant à prix nul est une erreur de saisie qui offre le
  -- catalogue. La base refuse la combinaison plutôt que de la découvrir au
  -- premier encaissement manquant.
  CONSTRAINT courses_paid_has_price
    CHECK (access <> 'paid' OR price_cents > 0)
);

CREATE INDEX IF NOT EXISTS courses_published_idx
  ON courses (is_published, published_at DESC);

CREATE TABLE IF NOT EXISTS course_modules (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id  uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title_fr   text NOT NULL,
  title_en   text NOT NULL,
  position   smallint NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS course_modules_course_idx
  ON course_modules (course_id, position);

CREATE TABLE IF NOT EXISTS lessons (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id  uuid NOT NULL REFERENCES course_modules(id) ON DELETE CASCADE,
  title_fr   text NOT NULL,
  title_en   text NOT NULL,
  body_fr    text,
  body_en    text,
  video_url  text,
  attachment_url text,
  duration_minutes smallint,
  position   smallint NOT NULL DEFAULT 0,
  -- Leçon offerte en démonstration, même sur un cours payant. C'est le seul
  -- argument de vente qui ne coûte rien à produire.
  is_preview boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS lessons_module_idx ON lessons (module_id, position);

-- Inscription à un cours. Distincte de `training_registrations`, qui vise une
-- session animée.
CREATE TABLE IF NOT EXISTS enrollments (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_id  uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  -- D'où vient l'accès. `organization` = siège d'une licence d'équipe :
  -- l'agent n'a rien payé lui-même, et retirer l'agent de l'organisation doit
  -- pouvoir lui retirer le cours.
  source     text NOT NULL DEFAULT 'free'
             CHECK (source IN ('free', 'purchase', 'organization', 'grant')),
  organization_id uuid REFERENCES organizations(id) ON DELETE SET NULL,
  status     text NOT NULL DEFAULT 'active'
             CHECK (status IN ('active', 'completed', 'revoked')),
  -- Pourcentage recalculé à chaque leçon terminée. Dénormalisé pour afficher
  -- une liste de cours sans compter les leçons de chacun.
  progress   smallint NOT NULL DEFAULT 0 CHECK (progress BETWEEN 0 AND 100),
  last_lesson_id uuid REFERENCES lessons(id) ON DELETE SET NULL,
  started_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz,
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, course_id)
);

CREATE INDEX IF NOT EXISTS enrollments_user_idx
  ON enrollments (user_id, updated_at DESC);
CREATE INDEX IF NOT EXISTS enrollments_course_idx ON enrollments (course_id);

CREATE TABLE IF NOT EXISTS lesson_progress (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id uuid NOT NULL REFERENCES enrollments(id) ON DELETE CASCADE,
  lesson_id     uuid NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  status        text NOT NULL DEFAULT 'in_progress'
                CHECK (status IN ('in_progress', 'done')),
  -- Position de reprise dans la vidéo. Sur une connexion coupée en pleine
  -- leçon — le cas courant du public visé — c'est ce qui évite de tout
  -- recommencer.
  resume_seconds integer NOT NULL DEFAULT 0 CHECK (resume_seconds >= 0),
  completed_at  timestamptz,
  updated_at    timestamptz NOT NULL DEFAULT now(),
  created_at    timestamptz NOT NULL DEFAULT now(),
  UNIQUE (enrollment_id, lesson_id)
);

-- -----------------------------------------------------------------------------
-- Quiz
-- -----------------------------------------------------------------------------
--
-- Un quiz sanctionne soit une leçon, soit un cours entier — jamais les deux.
-- `num_nonnulls(...) = 1` l'impose plutôt que la convention.

CREATE TABLE IF NOT EXISTS quizzes (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id  uuid REFERENCES courses(id) ON DELETE CASCADE,
  lesson_id  uuid REFERENCES lessons(id) ON DELETE CASCADE,
  title_fr   text NOT NULL,
  title_en   text NOT NULL,
  -- Score exigé, en pourcentage.
  pass_score smallint NOT NULL DEFAULT 70 CHECK (pass_score BETWEEN 0 AND 100),
  -- NULL = illimité. Un quiz d'entraînement se refait ; un quiz certifiant non.
  max_attempts smallint CHECK (max_attempts IS NULL OR max_attempts > 0),
  time_limit_minutes smallint,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT quizzes_one_parent
    CHECK (num_nonnulls(course_id, lesson_id) = 1)
);

CREATE INDEX IF NOT EXISTS quizzes_course_idx ON quizzes (course_id);
CREATE INDEX IF NOT EXISTS quizzes_lesson_idx ON quizzes (lesson_id);

CREATE TABLE IF NOT EXISTS quiz_questions (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id     uuid NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  position    smallint NOT NULL DEFAULT 0,
  prompt_fr   text NOT NULL,
  prompt_en   text NOT NULL,
  kind        text NOT NULL DEFAULT 'single'
              CHECK (kind IN ('single', 'multiple', 'boolean')),
  -- Affichée après la réponse. C'est là que le quiz enseigne au lieu de
  -- seulement noter.
  explanation_fr text,
  explanation_en text,
  points      smallint NOT NULL DEFAULT 1 CHECK (points > 0),
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS quiz_questions_quiz_idx
  ON quiz_questions (quiz_id, position);

CREATE TABLE IF NOT EXISTS quiz_options (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id uuid NOT NULL REFERENCES quiz_questions(id) ON DELETE CASCADE,
  position    smallint NOT NULL DEFAULT 0,
  label_fr    text NOT NULL,
  label_en    text NOT NULL,
  is_correct  boolean NOT NULL DEFAULT false,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS quiz_options_question_idx
  ON quiz_options (question_id, position);

CREATE TABLE IF NOT EXISTS quiz_attempts (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id      uuid NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  user_id      uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  -- Numéro de tentative, pour appliquer `max_attempts` sans compter les lignes
  -- à chaque ouverture du quiz.
  attempt_no   smallint NOT NULL DEFAULT 1,
  score        smallint CHECK (score IS NULL OR score BETWEEN 0 AND 100),
  passed       boolean,
  started_at   timestamptz NOT NULL DEFAULT now(),
  submitted_at timestamptz,
  UNIQUE (quiz_id, user_id, attempt_no)
);

CREATE INDEX IF NOT EXISTS quiz_attempts_user_idx
  ON quiz_attempts (user_id, started_at DESC);

CREATE TABLE IF NOT EXISTS quiz_answers (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_id  uuid NOT NULL REFERENCES quiz_attempts(id) ON DELETE CASCADE,
  question_id uuid NOT NULL REFERENCES quiz_questions(id) ON DELETE CASCADE,
  -- Tableau, parce qu'une question `multiple` attend plusieurs réponses. Pas
  -- de clé étrangère possible sur un tableau : la correction vérifie que les
  -- identifiants appartiennent bien à la question.
  option_ids  uuid[] NOT NULL DEFAULT '{}',
  is_correct  boolean,
  answered_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (attempt_id, question_id)
);

-- -----------------------------------------------------------------------------
-- Commandes et paiements Mobile Money
-- -----------------------------------------------------------------------------
--
-- Décidé avec l'utilisateur : **Mobile Money uniquement** — M-Pesa, Airtel
-- Money, Orange Money, AfriMoney, via l'agrégateur FlexPay.cd. C'est le moyen
-- de paiement réel du marché visé ; la carte bancaire n'est pas au schéma tant
-- que la décision tient.
--
-- `provider = 'manual'` n'est **pas** un moyen de paiement offert au public :
-- c'est l'écriture d'un administrateur qui régularise un versement reçu hors
-- ligne (facture ONG, espèces). Sans elle, la seule façon de solder une
-- commande payée autrement serait de mentir sur le fournisseur.

CREATE TABLE IF NOT EXISTS orders (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Référence lisible, communiquée au client et à l'opérateur (ex.
  -- « RAPIA-2026-0042 »). Distincte de l'`id` : un UUID ne se dicte pas au
  -- téléphone.
  reference    text NOT NULL UNIQUE,
  user_id      uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  -- Renseignée quand l'achat est fait au nom d'une organisation : c'est elle
  -- qui reçoit la facture, et les inscriptions qui en découlent.
  organization_id uuid REFERENCES organizations(id) ON DELETE SET NULL,
  -- Total recopié depuis les lignes **au moment de la commande**. Le
  -- recalculer à l'affichage ferait varier une commande passée quand un prix
  -- change au catalogue.
  amount_cents integer NOT NULL CHECK (amount_cents >= 0),
  currency     text NOT NULL DEFAULT 'USD' CHECK (currency IN ('USD', 'CDF')),
  status       text NOT NULL DEFAULT 'pending'
               CHECK (status IN ('pending', 'paid', 'failed', 'cancelled', 'refunded')),
  paid_at      timestamptz,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS orders_user_idx ON orders (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS orders_status_idx ON orders (status, created_at);

-- Une ligne vise exactement un article vendable. Le libellé et le prix sont
-- **recopiés**, jamais lus par jointure à l'affichage : une facture doit dire
-- ce qui a été vendu ce jour-là, même si le cours a changé de nom depuis.
CREATE TABLE IF NOT EXISTS order_items (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id     uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  course_id    uuid REFERENCES courses(id) ON DELETE SET NULL,
  resource_id  uuid REFERENCES resources(id) ON DELETE SET NULL,
  training_session_id uuid REFERENCES training_sessions(id) ON DELETE SET NULL,
  label        text NOT NULL,
  unit_amount_cents integer NOT NULL CHECK (unit_amount_cents >= 0),
  quantity     smallint NOT NULL DEFAULT 1 CHECK (quantity > 0),
  created_at   timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT order_items_one_target
    CHECK (num_nonnulls(course_id, resource_id, training_session_id) = 1)
);

CREATE INDEX IF NOT EXISTS order_items_order_idx ON order_items (order_id);

-- Tentatives de paiement. Plusieurs par commande : un premier essai qui échoue
-- (solde insuffisant, code PIN raté) ne doit pas fermer la commande.
CREATE TABLE IF NOT EXISTS payments (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id     uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  provider     text NOT NULL DEFAULT 'flexpay'
               CHECK (provider IN ('flexpay', 'manual')),
  method       text NOT NULL
               CHECK (method IN ('mpesa', 'airtel', 'orange', 'afrimoney', 'offline')),
  -- Le numéro qui paie. Souvent différent de `users.phone` : on paie avec le
  -- téléphone qui a du crédit, pas avec celui du compte.
  phone        text,
  -- Identifiant chez l'opérateur, seul point commun avec un relevé. Unique :
  -- **c'est la garde contre le double encaissement**, un rappel de callback
  -- répété ne pouvant alors créer qu'une ligne.
  provider_reference text UNIQUE,
  amount_cents integer NOT NULL CHECK (amount_cents >= 0),
  currency     text NOT NULL DEFAULT 'USD' CHECK (currency IN ('USD', 'CDF')),
  status       text NOT NULL DEFAULT 'pending'
               CHECK (status IN ('pending', 'succeeded', 'failed', 'cancelled')),
  -- Réponse brute de l'opérateur, telle quelle. En cas de litige, c'est la
  -- seule pièce qui fasse foi — la reformuler en colonnes perdrait ce qu'on
  -- n'avait pas prévu d'y lire.
  raw          jsonb,
  failure_reason text,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS payments_order_idx ON payments (order_id, created_at DESC);
CREATE INDEX IF NOT EXISTS payments_pending_idx
  ON payments (created_at) WHERE status = 'pending';

-- Ressources payantes — la migration 001 n'ouvrait `access` qu'à trois
-- valeurs. La contrainte est reconstruite plutôt que modifiée : Postgres ne
-- sait pas altérer un CHECK en place.
ALTER TABLE resources ADD COLUMN IF NOT EXISTS price_cents
  integer NOT NULL DEFAULT 0 CHECK (price_cents >= 0);
ALTER TABLE resources ADD COLUMN IF NOT EXISTS currency
  text NOT NULL DEFAULT 'USD';
ALTER TABLE resources DROP CONSTRAINT IF EXISTS resources_access_check;
ALTER TABLE resources ADD CONSTRAINT resources_access_check
  CHECK (access IN ('public', 'account', 'client', 'paid'));
ALTER TABLE resources DROP CONSTRAINT IF EXISTS resources_currency_check;
ALTER TABLE resources ADD CONSTRAINT resources_currency_check
  CHECK (currency IN ('USD', 'CDF'));

-- Formations animées payantes.
ALTER TABLE training_sessions ADD COLUMN IF NOT EXISTS price_cents
  integer NOT NULL DEFAULT 0 CHECK (price_cents >= 0);
ALTER TABLE training_sessions ADD COLUMN IF NOT EXISTS currency
  text NOT NULL DEFAULT 'USD';
ALTER TABLE training_sessions DROP CONSTRAINT IF EXISTS training_sessions_currency_check;
ALTER TABLE training_sessions ADD CONSTRAINT training_sessions_currency_check
  CHECK (currency IN ('USD', 'CDF'));

-- -----------------------------------------------------------------------------
-- Compteurs du forum, tenus par la base
-- -----------------------------------------------------------------------------
--
-- Même raison que `touch_updated_at` en 001 : confier un compteur au code
-- applicatif garantit qu'une route sur trois l'oubliera, et un nombre de
-- réponses faux se voit immédiatement sur la page d'accueil du forum.

CREATE OR REPLACE FUNCTION forum_topic_touch_counters() RETURNS trigger AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE forum_topics
       SET reply_count = reply_count + 1,
           last_reply_at = NEW.created_at
     WHERE id = NEW.topic_id;
  ELSIF TG_OP = 'DELETE' THEN
    -- `GREATEST(…, 0)` : un compteur négatif après une suppression manuelle en
    -- SQL serait plus difficile à repérer qu'à éviter.
    UPDATE forum_topics
       SET reply_count = GREATEST(reply_count - 1, 0)
     WHERE id = OLD.topic_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS forum_replies_counters ON forum_replies;
CREATE TRIGGER forum_replies_counters
  AFTER INSERT OR DELETE ON forum_replies
  FOR EACH ROW EXECUTE FUNCTION forum_topic_touch_counters();

-- -----------------------------------------------------------------------------
-- `updated_at` sur les nouvelles tables
-- -----------------------------------------------------------------------------
--
-- `touch_updated_at()` vient de la migration 001. Ce bloc n'ajoute que les
-- déclencheurs manquants ; il est rejouable.

DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'organizations', 'communities', 'post_comments', 'forum_topics',
    'forum_replies', 'courses', 'lessons', 'enrollments', 'lesson_progress',
    'orders', 'payments'
  ] LOOP
    EXECUTE format(
      'DROP TRIGGER IF EXISTS %I ON %I', t || '_touch_updated_at', t
    );
    EXECUTE format(
      'CREATE TRIGGER %I BEFORE UPDATE ON %I
       FOR EACH ROW EXECUTE FUNCTION touch_updated_at()',
      t || '_touch_updated_at', t
    );
  END LOOP;
END $$;
