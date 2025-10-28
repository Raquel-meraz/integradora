# 📘 Proyecto Integradora 1 – App Móvil (Expo/React Native)



**Flujos principales:**
- **Login / Register →** redirección por rol *( `admin@gmail.com` → Admin, `cliente@gmail.com` → Cliente)*.  
- **Cliente:** ver/crear citas, ver autos registrados, editar datos.  
- **Admin:** dashboard de citas del día, detalle/estado de cada cita, lista de clientes.


## ✨ Novedades (27-oct-2025)
- Migración a **Expo Router** con carpeta **`/app`** (navegación por archivos).
- Proyecto en **TypeScript** con tipados globales (`expo-env.d.ts`) y **`tsconfig.json`**.
- Carpeta **`/components`** ( `CarModal.tsx`, `AppointmentCard.tsx`, `EmptyState.tsx`).
- Carpeta **`/hooks`** (`useAuth.ts`, `useAppointments.ts`).
- Carpeta **`/constants`** (`colors.ts`, `roles.ts` con mapeo temporal email→rol).
- **Validación de placas en `CarModal`:** últimos **4** caracteres alfanuméricos (A-Z, 0-9).
- **`scripts/reset-project.js`** para limpiar/rehidratar el proyecto en desarrollo.
- **`.vscode/`** con configuración de workspace (formato/lint).
- **`eslint.config.js`** con reglas de estilo.
- **`.gitignore`** actualizado (no se suben `node_modules`, `.expo/`, `dist/`, etc.).

---

## 🧩 Tecnologías
- **React Native (Expo)**
- **TypeScript**
- **Expo Router** (navegación basada en archivos dentro de `/app`)
- React Navigation *(solo si se usa `/navigation` en lugar de Expo Router)*
- Axios / Fetch para consumo de API *(cuando conectes el backend)*
- Zustand / Context API para estado *(opcional)*
- ESLint + reglas básicas (archivo `eslint.config.js`)

---

## 🛠️ Requisitos previos
- **Node.js 18+** y **npm** (o pnpm/yarn)
- **Expo CLI** (opcional): `npm i -g expo-cli` *(con `npx expo` también funciona)*
- **Expo Go** en tu teléfono (Android/iOS) o emulador Android/iOS configurado


## 🔐 Variables de entorno (opcional)
Crea un archivo **`.env`** en la raíz si vas a consumir un backend:

```env
API_URL=https://tu-backend.com/api
EXPO_PUBLIC_API_URL=https://tu-backend.com/api   # si usas variables públicas de Expo
```

El cliente HTTP puede leer `process.env.EXPO_PUBLIC_API_URL`.

---

## 📁 Estructura del proyecto

> Esta estructura refleja tu rama `avances-2025-10-27` (Expo Router, TS, hooks, constants). **Ajusta si cambian nombres de archivos.**

```
.
├─ app/                       # Rutas (Expo Router) – navega por archivos
│  ├─ _layout.tsx             # Layout raíz (tema/estado global, StatusBar)
│  ├─ index.tsx               # Pantalla inicial (redirige según rol o muestra Home)
│  ├─ login.tsx               # Pantalla de Login
│  ├─ register.tsx            # Pantalla de Registro
│  ├─ admin/                  # Sección Admin
│  │  ├─ index.tsx            # Dashboard (hoy, próximas, historial)
│  │  └─ citas/
│  │     └─ [id].tsx          # Detalle de cita (confirmar/cancelar/finalizar)
│  └─ cliente/                # Sección Cliente
│     ├─ index.tsx            # Inicio (próxima cita, accesos rápidos)
│     └─ citas/
│        └─ [id].tsx          # Detalle de cita para el cliente
│
├─ components/
│  ├─ AppointmentCard.tsx     # Tarjeta de cita (fecha, hora, estatus, acciones)
│  ├─ CarModal.tsx            # Modal agregar/editar auto (marca, modelo, año, placas)
│  └─ EmptyState.tsx          # Estados vacíos (sin autos/citas)
│
├─ constants/
│  ├─ colors.ts               # Paleta de colores centralizada
│  └─ roles.ts                # Mapeo temporal email → rol (admin/cliente)
│
├─ hooks/
│  ├─ useAuth.ts              # Manejo de sesión (login/logout, usuario actual, rol)
│  └─ useAppointments.ts      # Lógica de citas (listar, crear, actualizar)
│
├─ assets/
│  └─ images/
│     └─ Imagen Juego.png     # Recurso de ejemplo para pantallas/cards
│
├─ scripts/
│  └─ reset-project.js        # Script para limpiar/rehidratar proyecto (dev)
│
├─ .vscode/                   # Configuración del workspace (formato, sugerencias)
├─ .gitignore                 # Ignora node_modules, .expo, dist, build, .env, etc.
├─ app.json                   # Configuración de la app (o app.config.ts)
├─ eslint.config.js           # Reglas ESLint
├─ expo-env.d.ts              # Tipos para variables Expo env
├─ package.json               # Dependencias y scripts
├─ tsconfig.json              # Configuración TypeScript
└─ README.md
```

---

## 🧭 Descripción rápida (archivo por archivo)

| Ruta | ¿Qué hace? | Puntos clave |
|---|---|---|
| `app/_layout.tsx` | Layout global del router | Proveedores (tema/estado), `StatusBar` |
| `app/index.tsx` | Entrada principal | Redirige por rol o muestra Home |
| `app/login.tsx` | Formulario de acceso | Valida email/contraseña; usa el rol temporal |
| `app/register.tsx` | Registro | Prepara datos para futuro backend |
| `app/admin/index.tsx` | Dashboard Admin | KPIs del día, lista de citas |
| `app/admin/citas/[id].tsx` | Detalle de cita (Admin) | Cambiar estado (confirmar/cancelar/finalizar) |
| `app/cliente/index.tsx` | Inicio Cliente | Próxima cita y accesos rápidos |
| `app/cliente/citas/[id].tsx` | Detalle de cita (Cliente) | Ver estado, reprogramar/cancelar |
| `components/CarModal.tsx` | Agregar/editar auto | **Placas:** últimos **4** alfanuméricos |
| `components/AppointmentCard.tsx` | Tarjeta de cita | Props: fecha/hora/estatus; acciones |
| `constants/colors.ts` | Paleta de colores | Consistencia de UI |
| `constants/roles.ts` | Email → rol (temporal) | Reemplazar cuando haya backend |
| `hooks/useAuth.ts` | Estado de usuario | `login`, `logout`, `user`, `role` |
| `hooks/useAppointments.ts` | Estado/acciones de citas | `list`, `create`, `update`, `remove` |
| `scripts/reset-project.js` | Utilidad dev | Limpieza de caché/build |

---

## 🔐 Roles temporales (sin backend)

```ts
// constants/roles.ts
export const EMAIL_ROLE: Record<string, 'admin' | 'cliente'> = {
  'admin@gmail.com': 'admin',
  'cliente@gmail.com': 'cliente',
};

export const getRoleByEmail = (email: string) =>
  EMAIL_ROLE[email.toLowerCase()] ?? 'cliente';
```

Uso en `app/login.tsx` (o dentro de `useAuth`):

```ts
import { router } from 'expo-router';
import { getRoleByEmail } from '@/constants/roles';

// tras validar credenciales...
const role = getRoleByEmail(email);

if (role === 'admin') {
  router.replace('/admin');
} else {
  router.replace('/cliente');
}
```

> **Recuerda:** esto es solo para desarrollo. Cuando haya backend, valida roles y sesión en el **servidor** y usa **JWT**.

---

## 🧪 Scripts de `package.json` (ejemplo)

```json
{
  "scripts": {
    "start": "expo start",
    "android": "expo run:android",
    "ios": "expo run:ios",
    "web": "expo start --web",
    "lint": "eslint .",
    "typecheck": "tsc --noEmit",
    "reset": "node scripts/reset-project.js"
  }
}
```

---

## 🛣️ Roadmap breve
- Conectar a backend (Auth, Citas, Autos) y reemplazar mapeo de roles.
- Persistencia de sesión (SecureStore/AsyncStorage).
- Validaciones completas en formularios (react-hook-form/yup).
- Estados/errores de red y loaders.
- Notificaciones push (Expo Notifications).
- Pruebas básicas (e2e/smoke).

---

## 🤝 Flujo de trabajo con ramas
- Rama principal: `main`  
- Rama de avances: `avances-YYYY-MM-DD` o `feature/<descripcion>`  
- Subir cambios:
  ```bash
  git add .
  git commit -m "feat: descripcion corta"
  git push
  ```
- Cuando esté listo: **Pull Request → Merge a `main`**.
