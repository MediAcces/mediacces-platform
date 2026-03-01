# MédiAccès Services

Plateforme digitale de mise en relation entre patients/établissements de santé et prestataires de transport médicalisé (ambulances, VSL) et de livraison de médicaments par coursiers en Côte d'Ivoire.

## Architecture

```
mediacces-platform/
├── packages/
│   ├── backend/         # API Node.js + Express + TypeORM + PostgreSQL
│   ├── web-backoffice/  # React.js (admin, hôpitaux, pharmacies) - à venir
│   └── mobile/          # React Native + Expo (patient & chauffeur/coursier) - à venir
├── docs/
├── .github/workflows/
└── README.md
```

## Stack Technologique

### Backend (Phase 1 - Actuel)
- **Runtime** : Node.js v18+
- **Framework** : Express.js
- **ORM** : TypeORM
- **Base de données** : PostgreSQL
- **Authentification** : JWT + OTP (Twilio)
- **Validation** : express-validator
- **Documentation** : Swagger (OpenAPI 3.0)
- **Sécurité** : helmet, cors, rate-limiting, bcrypt
- **Tests** : Jest + Supertest
- **Logging** : Winston

### Frontend Web (à venir)
- React.js, Tailwind CSS, React Router, Axios

### Mobile (à venir)
- React Native, Expo, React Navigation, React Native Maps

## Démarrage rapide

### Prérequis

- Node.js v18+
- PostgreSQL 14+
- npm ou yarn

### Installation

```bash
# Cloner le dépôt
git clone <repo-url>
cd mediacces-platform

# Installer les dépendances du backend
cd packages/backend
npm install

# Configurer les variables d'environnement
cp .env.example .env
# Éditer le fichier .env avec vos paramètres (base de données, JWT secret, etc.)
```

### Configuration de la base de données

1. Créer une base de données PostgreSQL :
```sql
CREATE DATABASE mediacces;
```

2. Mettre à jour le fichier `.env` avec vos identifiants PostgreSQL :
```
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=votre_mot_de_passe
DB_NAME=mediacces
```

### Lancer le serveur

```bash
cd packages/backend

# Mode développement (avec hot-reload)
npm run dev

# Mode production
npm run build
npm start
```

Le serveur démarre sur `http://localhost:3000`.

### Documentation API

Après le démarrage du serveur, la documentation Swagger est disponible sur :
```
http://localhost:3000/api-docs
```

### Tests

```bash
cd packages/backend
npm test
```

## Endpoints API (Phase 1)

### Authentification
| Méthode | Route | Description |
|---------|-------|-------------|
| POST | `/api/auth/register` | Inscription (téléphone, nom, email, mot de passe, rôle) |
| POST | `/api/auth/login` | Connexion (téléphone/email + mot de passe) |
| POST | `/api/auth/request-otp` | Envoi d'un code OTP par SMS |
| POST | `/api/auth/verify-otp` | Vérification du code OTP |

### Utilisateur
| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/api/user/profile` | Obtenir le profil (protégé) |
| PUT | `/api/user/profile` | Mettre à jour le profil (protégé) |

### Documents
| Méthode | Route | Description |
|---------|-------|-------------|
| POST | `/api/documents/upload` | Téléverser un document (protégé) |
| GET | `/api/documents` | Lister ses documents (protégé) |
| PUT | `/api/documents/:id/validate` | Valider/rejeter un document (admin) |

### Santé
| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/health` | Vérification de l'état du serveur |

## Rôles utilisateur

- `patient` : Patients (auto-validés à l'inscription)
- `chauffeur` : Chauffeurs d'ambulance/VSL (nécessite validation admin)
- `coursier` : Coursiers médicaux moto/vélo (nécessite validation admin)
- `hopital` : Hôpitaux et cliniques (nécessite validation admin)
- `pharmacie` : Pharmacies (nécessite validation admin)
- `admin` : Administrateurs de la plateforme

## Modèles de données

- **User** : Utilisateurs avec rôles, infos médicales optionnelles, géolocalisation
- **Vehicle** : Véhicules (ambulance, VSL, moto, vélo) avec certifications
- **Trip** : Courses/livraisons avec suivi GPS et statuts
- **Payment** : Paiements avec commissions
- **Document** : Documents des prestataires avec workflow de validation
- **Notification** : Notifications push/SMS

## Sécurité

- Authentification JWT avec durée de vie configurable
- OTP à 6 chiffres avec expiration (5 minutes)
- Hachage des mots de passe (bcrypt, 12 rounds)
- Protection CORS configurable
- Rate limiting (100 req/15min global, 20 req/15min pour l'auth)
- Helmet pour les en-têtes HTTP de sécurité
- Validation de toutes les entrées utilisateur
- RBAC (Role-Based Access Control)

## Prochaines étapes

- **Sprint 3-4** : Module Patient (mobile) - inscription, recherche, réservation
- **Sprint 5-6** : Module Chauffeur/Coursier (mobile) - disponibilité, missions, navigation
- **Sprint 7-8** : Paiements (CinetPay) et notifications (FCM)
- **Sprint 9-10** : Module Établissements (web) - hôpitaux
- **Sprint 11-12** : Module Pharmacies (web)
- **Sprint 13-14** : Back-office admin (web)

## Licence

Propriétaire - MédiAccès Services
