---
description: Levantar todo el proyecto (backend + frontend)
---

# Levantar el Proyecto Completo

Este workflow levanta tanto el backend como el frontend del proyecto de estadísticas de baloncesto.

## Pasos

### 1. Verificar que PostgreSQL esté corriendo
Asegúrate de que PostgreSQL esté activo en `localhost:5432` con las credenciales configuradas en `backend/.env`.

### 2. Generar Prisma Client (si es necesario)
```bash
cd backend && npx prisma generate
```

### 3. Aplicar migraciones de base de datos (si es necesario)
```bash
cd backend && npx prisma migrate deploy
```

// turbo
### 4. Iniciar el servidor backend
```bash
cd backend && npm run dev
```
El backend se ejecutará en `http://localhost:3000`

// turbo
### 5. Iniciar el servidor frontend (en otra terminal)
```bash
cd frontend && npm run dev
```
El frontend se ejecutará en `http://localhost:5173`

## Verificación

- Backend: `http://localhost:3000/api/players` debería responder
- Frontend: `http://localhost:5173` debería mostrar la aplicación
