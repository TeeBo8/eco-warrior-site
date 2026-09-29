# Variables d'environnement — EcoWarrior

Copier dans `.env.local` (local) et dans Vercel → Settings → Environment Variables (prod).
Le site est 100 % statique : plus de base de données ni d'authentification.

```bash
# URL publique (sitemap, métadonnées)
NEXT_PUBLIC_SITE_URL=https://eco-warrior-site.vercel.app

# Resend — formulaire de contact (sans clé, le formulaire répond OK mais n'envoie rien)
RESEND_API_KEY=
RESEND_FROM_EMAIL=   # adresse d'un domaine vérifié dans Resend
RESEND_TO_EMAIL=     # boîte qui reçoit les messages
```
