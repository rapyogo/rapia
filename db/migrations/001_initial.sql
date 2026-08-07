-- =============================================================================
-- 001 — Schéma initial : comptes, audits de workflow, formations, projets
-- =============================================================================
--
-- Ce que l'espace client doit permettre, dans l'ordre où un visiteur y arrive :
--
--   1. se créer un compte ;
--   2. faire l'audit de son propre workflow et recevoir un diagnostic ;
--   3. accéder aux ressources ;
--   4. s'inscrire à une formation et suivre sa progression ;
--   5. suivre l'avancement de son projet d'implémentation.
--
-- Trois partis pris qui engagent la suite :
--
-- * **`citext` pour les e-mails.** Un utilisateur qui s'inscrit avec
--   `Jean@ONG.cd` et se reconnecte avec `jean@ong.cd` doit retrouver son
--   compte. Sans ce type, l'unicité se contourne par une majuscule.
--
-- * **Aucun mot de passe dans ce schéma.** `password_hash` est nullable et
--   restera vide tant que l'authentification n'est pas tranchée (lien magique
--   par e-mail, OAuth, ou mot de passe). Brevo est déjà en place et le lien
--   magique évite de stocker un secret — c'est la piste par défaut.
--
-- * **`ON DELETE CASCADE` partout depuis `users`.** Une demande de suppression
--   de compte doit pouvoir être honorée par une seule requête. Une donnée
--   orpheline qu'on découvre six mois plus tard est un incident, pas un détail.
--
-- Migration idempotente : `IF NOT EXISTS` partout, rejouable sans dommage.
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS citext;
CREATE EXTENSION IF NOT EXISTS pgcrypto;  -- gen_random_uuid()

-- -----------------------------------------------------------------------------
-- Comptes
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS users (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email          citext NOT NULL UNIQUE,
  full_name      text,
  organization   text,
  -- Type d'organisation : reprend les `orgTypes` du formulaire de contact.
  -- Texte libre plutôt qu'enum : la liste bouge côté produit, et une migration
  -- pour ajouter « coopérative » serait disproportionnée.
  organization_type text,
  phone          text,
  -- Langue d'interface et des e-mails. Contrainte plutôt qu'enum, même raison.
  locale         text NOT NULL DEFAULT 'fr' CHECK (locale IN ('fr', 'en')),
  role           text NOT NULL DEFAULT 'client' CHECK (role IN ('client', 'staff', 'admin')),
  -- Nul tant que l'utilisateur n'a pas confirmé son adresse. Sert de garde :
  -- pas d'accès aux ressources avant vérification.
  email_verified_at timestamptz,
  password_hash  text,
  created_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now()
);

-- Jetons de connexion sans mot de passe et de vérification d'adresse.
-- On stocke un **hash** du jeton, pas le jeton : une fuite de la table ne doit
-- pas suffire à se connecter à la place de quelqu'un.
CREATE TABLE IF NOT EXISTS auth_tokens (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash  text NOT NULL UNIQUE,
  purpose     text NOT NULL CHECK (purpose IN ('login', 'verify_email')),
  expires_at  timestamptz NOT NULL,
  consumed_at timestamptz,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS auth_tokens_user_idx ON auth_tokens (user_id);
CREATE INDEX IF NOT EXISTS auth_tokens_expiry_idx ON auth_tokens (expires_at);

CREATE TABLE IF NOT EXISTS sessions (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash   text NOT NULL UNIQUE,
  user_agent   text,
  expires_at   timestamptz NOT NULL,
  created_at   timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS sessions_user_idx ON sessions (user_id);

-- -----------------------------------------------------------------------------
-- Audit de workflow
-- -----------------------------------------------------------------------------
--
-- Le cœur de l'offre en libre-service : l'utilisateur décrit ses processus,
-- reçoit un diagnostic. Le questionnaire évoluera ; ses réponses sont donc
-- stockées en `jsonb` plutôt qu'en colonnes, et `questionnaire_version` dit
-- quelle grille lire pour les interpréter. Sans ce numéro, les réponses
-- d'avant un changement de questionnaire deviennent illisibles.

CREATE TABLE IF NOT EXISTS workflow_audits (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title       text,
  status      text NOT NULL DEFAULT 'draft'
              CHECK (status IN ('draft', 'submitted', 'reviewed')),
  questionnaire_version text NOT NULL DEFAULT 'v1',
  answers     jsonb NOT NULL DEFAULT '{}'::jsonb,
  -- Diagnostic produit à partir des réponses : niveau de maturité atteint
  -- (1 discuter, 2 connecter, 3 déléguer) et recommandations.
  maturity_level smallint CHECK (maturity_level BETWEEN 1 AND 3),
  findings    jsonb,
  -- Rempli quand un humain a relu le diagnostic automatique.
  reviewed_by uuid REFERENCES users(id) ON DELETE SET NULL,
  reviewed_at timestamptz,
  submitted_at timestamptz,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS workflow_audits_user_idx ON workflow_audits (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS workflow_audits_status_idx ON workflow_audits (status);

-- -----------------------------------------------------------------------------
-- Formations
-- -----------------------------------------------------------------------------
--
-- Le catalogue reste dans `messages/*.json` tant qu'il est purement éditorial.
-- Cette table ne porte que ce qu'une inscription exige : des sessions datées,
-- un nombre de places, et qui s'y est inscrit.

CREATE TABLE IF NOT EXISTS training_sessions (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Identifiant stable du module (ex. « agents-ia »), qui fait le lien avec la
  -- copie traduite. Pas le libellé : il change de langue.
  module_key  text NOT NULL,
  title_fr    text NOT NULL,
  title_en    text NOT NULL,
  format      text NOT NULL CHECK (format IN ('executive', 'team', 'bespoke')),
  delivery    text NOT NULL DEFAULT 'onsite' CHECK (delivery IN ('onsite', 'remote', 'hybrid')),
  city        text,
  starts_at   timestamptz,
  ends_at     timestamptz,
  seats       smallint,
  is_published boolean NOT NULL DEFAULT false,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS training_sessions_published_idx
  ON training_sessions (is_published, starts_at);

CREATE TABLE IF NOT EXISTS training_registrations (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  session_id  uuid NOT NULL REFERENCES training_sessions(id) ON DELETE CASCADE,
  status      text NOT NULL DEFAULT 'pending'
              CHECK (status IN ('pending', 'confirmed', 'attended', 'cancelled')),
  -- Progression en pourcentage, pour les parcours suivis à distance.
  progress    smallint NOT NULL DEFAULT 0 CHECK (progress BETWEEN 0 AND 100),
  notes       text,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now(),
  -- Une seule inscription par personne et par session : sans cette contrainte,
  -- un double clic sur « s'inscrire » crée deux lignes et fausse le décompte
  -- des places.
  UNIQUE (user_id, session_id)
);

-- -----------------------------------------------------------------------------
-- Ressources
-- -----------------------------------------------------------------------------
--
-- Guides, modèles, enregistrements. `min_role` décide qui y accède : certaines
-- ressources sont publiques, d'autres réservées aux comptes vérifiés.

CREATE TABLE IF NOT EXISTS resources (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug         text NOT NULL UNIQUE,
  title_fr     text NOT NULL,
  title_en     text NOT NULL,
  summary_fr   text,
  summary_en   text,
  kind         text NOT NULL CHECK (kind IN ('guide', 'template', 'recording', 'checklist')),
  file_url     text,
  access       text NOT NULL DEFAULT 'account'
               CHECK (access IN ('public', 'account', 'client')),
  is_published boolean NOT NULL DEFAULT false,
  published_at timestamptz,
  created_at   timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS resources_published_idx ON resources (is_published, published_at DESC);

-- Qui a téléchargé quoi. Utile pour savoir ce qui sert vraiment, et pour ne pas
-- redemander un formulaire à quelqu'un qui a déjà le document.
CREATE TABLE IF NOT EXISTS resource_downloads (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  resource_id  uuid NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
  created_at   timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS resource_downloads_user_idx ON resource_downloads (user_id, created_at DESC);

-- -----------------------------------------------------------------------------
-- Projets d'implémentation
-- -----------------------------------------------------------------------------
--
-- Ce que le client vient voir : où en est son projet. Les étapes sont des
-- lignes, pas un champ « pourcentage » : un client veut savoir *ce qui* est
-- fait, pas un chiffre qu'il ne peut pas vérifier.

CREATE TABLE IF NOT EXISTS projects (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name         text NOT NULL,
  -- Service concerné : mêmes identifiants que `services.items` dans
  -- `messages/*.json` — conseil, formation, implementation, automatisation.
  service_key  text,
  status       text NOT NULL DEFAULT 'scoping'
               CHECK (status IN ('scoping', 'building', 'training', 'live', 'closed')),
  summary      text,
  started_at   timestamptz,
  target_at    timestamptz,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS projects_user_idx ON projects (user_id, created_at DESC);

CREATE TABLE IF NOT EXISTS project_milestones (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id   uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title        text NOT NULL,
  description  text,
  position     smallint NOT NULL DEFAULT 0,
  status       text NOT NULL DEFAULT 'pending'
               CHECK (status IN ('pending', 'in_progress', 'done', 'blocked')),
  due_at       timestamptz,
  completed_at timestamptz,
  created_at   timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS project_milestones_project_idx
  ON project_milestones (project_id, position);

-- -----------------------------------------------------------------------------
-- Blog
-- -----------------------------------------------------------------------------
--
-- `Content.tsx` rend déjà une grille complète et retourne `null` faute
-- d'articles. Ces tables lui donnent sa source.
--
-- Un article, deux langues, une ligne : le `slug` est partagé, les colonnes
-- `_fr` / `_en` portent le contenu. Deux lignes séparées obligeraient à gérer
-- l'appariement des traductions, pour un blog qui publiera peu.

CREATE TABLE IF NOT EXISTS posts (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug          text NOT NULL UNIQUE,
  title_fr      text NOT NULL,
  title_en      text NOT NULL,
  excerpt_fr    text,
  excerpt_en    text,
  body_fr       text,
  body_en       text,
  cover_url     text,
  author_id     uuid REFERENCES users(id) ON DELETE SET NULL,
  -- Distinct de `created_at` : un article rédigé en janvier et publié en mars
  -- doit afficher mars, et le sitemap doit lire cette date-là.
  published_at  timestamptz,
  updated_at    timestamptz NOT NULL DEFAULT now(),
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS posts_published_idx ON posts (published_at DESC NULLS LAST);

-- -----------------------------------------------------------------------------
-- Newsletter
-- -----------------------------------------------------------------------------
--
-- Table distincte de `users` **exprès** : on s'abonne sans compte, et on garde
-- un compte sans être abonné. Les fusionner obligerait à créer un utilisateur
-- fantôme à chaque adresse saisie.
--
-- `confirmed_at` impose le double opt-in : rien ne part avant que l'adresse
-- ait été confirmée. `unsubscribed_at` conserve la ligne au lieu de la
-- supprimer — c'est ce qui permet de prouver qu'un désabonnement a été honoré.

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email           citext NOT NULL UNIQUE,
  locale          text NOT NULL DEFAULT 'fr' CHECK (locale IN ('fr', 'en')),
  -- D'où vient l'inscription : pied de page, article, formulaire de contact.
  source          text,
  confirm_token_hash text,
  confirmed_at    timestamptz,
  unsubscribed_at timestamptz,
  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS newsletter_active_idx
  ON newsletter_subscribers (confirmed_at)
  WHERE unsubscribed_at IS NULL;

-- -----------------------------------------------------------------------------
-- `updated_at` tenu par la base
-- -----------------------------------------------------------------------------
--
-- Confier cette mise à jour au code applicatif garantit qu'on l'oubliera dans
-- une requête sur trois, et une date de modification fausse est pire qu'absente.

CREATE OR REPLACE FUNCTION touch_updated_at() RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'users', 'workflow_audits', 'training_registrations', 'projects', 'posts'
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
