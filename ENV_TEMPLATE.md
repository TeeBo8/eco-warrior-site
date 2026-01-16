# =============================================================================
# TEMPLATE DES VARIABLES D'ENVIRONNEMENT - EcoWarrior Site
# =============================================================================
# Copiez ce fichier en .env.local et remplissez les valeurs depuis Vercel
# =============================================================================

# =============================================================================
# GOOGLE GENERATIVE AI (Gemini) - Pour le Scanner Carbone
# =============================================================================
GOOGLE_GENERATIVE_AI_API_KEY=your_google_ai_key_here

# =============================================================================
# BASE URL - URL publique du site
# =============================================================================
NEXT_PUBLIC_BASE_URL=https://eco-warrior-site.vercel.app

# =============================================================================
# RESEND - Service d'envoi d'emails pour le formulaire de contact
# =============================================================================
RESEND_API_KEY=your_resend_api_key_here
RESEND_TO_EMAIL=t.leture@gmail.com
RESEND_FROM_EMAIL=your_from_email_here

# =============================================================================
# CLERK - Service d'authentification (si utilisé)
# =============================================================================
NEXT_PUBLIC_DEVELOPER_EMAIL=t.leture@gmail.com
CLERK_WEBHOOK_SECRET=your_clerk_webhook_secret_here
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
CLERK_SECRET_KEY=your_clerk_secret_key_here

# =============================================================================
# VERCEL POSTGRES - Base de données principale
# =============================================================================
POSTGRES_URL=your_postgres_url_here
POSTGRES_PRISMA_URL=your_postgres_prisma_url_here
POSTGRES_URL_NON_POOLING=your_postgres_url_non_pooling_here
POSTGRES_URL_NO_SSL=your_postgres_url_no_ssl_here
POSTGRES_HOST=your_postgres_host_here
POSTGRES_USER=your_postgres_user_here
POSTGRES_PASSWORD=your_postgres_password_here
POSTGRES_DATABASE=your_postgres_database_here

# =============================================================================
# VERCEL POSTGRES - Credentials individuelles (legacy)
# =============================================================================
PGHOST=your_pghost_here
PGHOST_UNPOOLED=your_pghost_unpooled_here
PGUSER=your_pguser_here
PGDATABASE=your_pgdatabase_here
PGPASSWORD=your_pgpassword_here

# =============================================================================
# DATABASE URL - URL de connexion générique
# =============================================================================
DATABASE_URL=your_database_url_here
DATABASE_URL_UNPOOLED=your_database_url_unpooled_here

# =============================================================================
# NEON - Base de données Neon (si utilisé en alternative à Vercel Postgres)
# =============================================================================
NEON_PROJECT_ID=your_neon_project_id_here
