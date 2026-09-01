# Service Social - Fullstack Project

Ce workspace contient une implementation de base complete:
- Backend: Spring Boot (API REST, H2, modules metier, dashboard)
- Frontend: Angular (dashboard, bureau d'ordre, pages modules, design moderne)

## Structure
- `backend/`: API Spring Boot
- `frontend/`: Application Angular

## Modules implementes
- Bureau d'ordre
- Section Mutuelle
- Assistance Sociale
- Culture et Loisirs
- Retraites
- Deces
- Assurance Sociale
- Authentification (login/signup) JWT
- Gestion des roles (ADMIN, MANAGER, AGENT)
- Gestion des utilisateurs et profils avec droits d'acces modules

## Lancer le backend
```bash
cd backend
mvn spring-boot:run
```
Backend API: http://localhost:8080/api
H2 Console: http://localhost:8080/h2-console

## Lancer le frontend
```bash
cd frontend
CI=1 NG_CLI_ANALYTICS=false npm start
```
Frontend: http://localhost:4200

## Endpoints principaux
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/users` (ADMIN)
- `POST /api/users` (ADMIN)
- `GET /api/dashboard/summary`
- `GET /api/bureau-order?q=`
- `POST /api/bureau-order`
- `GET /api/modules/{module}`
- `POST /api/modules/{module}`
- `PUT /api/modules/{module}/{id}`
- `DELETE /api/modules/{module}/{id}`

Valeurs module attendues:
- `MUTUELLE`
- `ASSISTANCE_SOCIALE`
- `CULTURE_LOISIRS`
- `RETRAITES`
- `DECES`
- `ASSURANCE_SOCIALE`

## Comptes de demonstration
- `admin / admin123` (acces total + gestion utilisateurs)
- `agent.mutuelle / agent123` (acces limite aux modules autorises)
# social
