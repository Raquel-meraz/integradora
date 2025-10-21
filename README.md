# 📘 Proyecto Integradora 1 – App Móvil (Expo/React Native)

---

## 🚀 Descripción
Aplicación móvil desarrollada con **Expo + React Native**. Permite **iniciar sesión / registrarse** y manejar la experiencia de **Cliente** y **Admin**. De momento, ambos ven la misma interfaz base y el comportamiento cambia por **rol** (temporalmente por correo), hasta conectar con la base de datos / backend.

**Flujos principales:**
- **Login / Register** → redirección por rol (p. ej. `admin@gmail.com` → Admin, `cliente@gmail.com` → Cliente).
- **Cliente**: ver/crear citas, ver autos registrados, editar datos.
- **Admin**: dashboard de citas del día, detalle/estado de cada cita, lista de clientes.

> ⚠️ Nota: El mapeo de roles por correo es **temporal**. Cuando conectes tu backend/DB, mueve esa lógica al servidor y utiliza JWT/headers seguros.

---

## 🧩 Tecnologías
- **React Native** (Expo)
- **TypeScript**
- **Expo Router** (navegación basada en archivos, si la carpeta `app/` está presente)
- **React Navigation** (si usas `navigation/` en lugar de Expo Router)
- **Axios / Fetch** para consumo de API (cuando conectes el backend)
- **Zustand / Context API** para estado (opcional)

---

## 🛠️ Requisitos previos
- **Node.js 18+** y **npm** o **pnpm/yarn**
- **Expo CLI**: `npm i -g expo-cli` (opcional; con `npx expo` también funciona)
- **Expo Go** en tu teléfono (Android/iOS) _o_ emulador Android/iOS configurado

---

## ⚙️ Instalación y ejecución
```bash
# 1) Instalar dependencias
npm install

# 2) Levantar el proyecto
npx expo start

# 3) Abrir en Expo Go (escanea el QR) o en un emulador
# - Presiona 'a' para Android Emulator, 'i' para iOS (macOS)
```

### Variables de entorno (opcional)
Crea un archivo `.env` en la raíz si vas a consumir un backend:
```
API_URL=https://tu-backend.com/api
EXPO_PUBLIC_API_URL=https://tu-backend.com/api   # si usas variables públicas de Expo
```

---

## 📁 Estructura y descripción de archivos
> Esta estructura refleja un proyecto típico con **Expo Router**. Ajusta nombres/rutas según tu repo. Si usas React Navigation clásico, ver **/navigation**.

```
.
├─ app/                       # Rutas (Expo Router) – navega por archivos
│  ├─ _layout.tsx             # Layout raíz (header, proveedor de tema/estado)
│  ├─ index.tsx               # Pantalla inicial (redirige según rol o muestra Home)
│  ├─ login.tsx               # Pantalla de Login
│  ├─ register.tsx            # Pantalla de Registro
│  ├─ admin/                  # Sección Admin
│  │  ├─ index.tsx            # Dashboard (hoy, próximas, historial)
│  │  ├─ citas/               # Rutas anidadas de citas
│  │  │  └─ [id].tsx          # Detalle de cita (acciones: confirmar/cancelar/terminar)
│  └─ cliente/                # Sección Cliente
│     ├─ index.tsx            # Inicio cliente (próxima cita, accesos rápidos)
│     └─ citas/
│        └─ [id].tsx          # Detalle de cita para el cliente
│
├─ components/                # Componentes reutilizables de UI
│  ├─ CarModal.tsx            # Modal para agregar/editar auto (marca, modelo, año, placas)
│  ├─ AppointmentCard.tsx     # Tarjeta de cita (fecha, hora, estatus)
│  └─ EmptyState.tsx          # Estados vacíos (sin autos/citas)
│
├─ constants/                 # Constantes de la app
│  ├─ colors.ts               # Paleta de colores de la app
│  └─ roles.ts                # Mapeo temporal de correos → rol (admin/cliente)
│
├─ hooks/                     # Hooks personalizados
│  ├─ useAuth.ts              # Manejo de sesión (login/logout, usuario actual)
│  └─ useAppointments.ts      # Lógica para citas (listar, crear, actualizar)
│
├─ services/                  # Acceso a APIs/almacenamiento
│  ├─ api.ts                  # Axios/fetch preconfigurado (baseURL, interceptores)
│  ├─ auth.ts                 # Llamadas de auth (login, register, refresh)
│  └─ appointments.ts         # Llamadas para citas (CRUD)
│
├─ navigation/                # (Solo si NO usas Expo Router)
│  └─ index.tsx               # Pilas, tabs, linking, guards por rol
│
├─ assets/                    # Imágenes, íconos, fuentes
│  ├─ images/                 # Ej.: logos, ilustraciones (p.ej. "Imagen Juego.png")
│  └─ fonts/                  # Fuentes personalizadas
│
├─ app.config.ts              # Configuración Expo (o app.json)
├─ package.json               # Dependencias y scripts
├─ tsconfig.json              # Config TypeScript
├─ .gitignore                 # Archivos para ignorar en git
└─ README.md                  # Este archivo
```

### 🧭 Descripción rápida (archivo por archivo)

| Ruta | ¿Qué hace? | Puntos clave |
|---|---|---|
| `app/_layout.tsx` | Layout raíz del router. Proveedores globales (tema/estado), status bar. | Se renderiza alrededor de todas las rutas en `app/`. |
| `app/index.tsx` | Entrada principal. Puede **redirigir según rol** o mostrar Home. | Llama a `getRoleByEmail()` (temporal) o consulta a `useAuth`. |
| `app/login.tsx` | Formulario de acceso. | Si el email es `admin@gmail.com` → Admin; `cliente@gmail.com` → Cliente (temporal). |
| `app/register.tsx` | Formulario de registro. | Valida email/contraseña; opcionalmente registra el rol. |
| `app/admin/index.tsx` | Dashboard Admin. | KPIs del día, lista de citas, accesos a detalle. |
| `app/admin/citas/[id].tsx` | Detalle de cita Admin. | Permite cambiar estado (confirmar/cancelar/finalizar). |
| `app/cliente/index.tsx` | Inicio Cliente. | Próxima cita, accesos rápidos (Autos, Servicios, Calendario). |
| `app/cliente/citas/[id].tsx` | Detalle de cita Cliente. | Ver estado, reprogramar/cancelar (si aplica). |
| `components/CarModal.tsx` | Modal de autos (marca/modelo/año/placas). | Validación de placas: **últimos 3–4 caracteres alfanuméricos**. |
| `components/AppointmentCard.tsx` | Tarjeta de cita. | Usa props para fecha/hora/estatus; botones de acción. |
| `constants/colors.ts` | Paleta centralizada. | Asegura consistencia de UI. |
| `constants/roles.ts` | **Mapa temporal** email → rol. | Reemplazar cuando haya backend. |
| `hooks/useAuth.ts` | Estado de usuario y sesión. | `login`, `logout`, `user`, `role`. |
| `hooks/useAppointments.ts` | Estado y acciones de citas. | `list`, `create`, `update`, `remove`. |
| `services/api.ts` | Cliente HTTP. | `baseURL` = `process.env.EXPO_PUBLIC_API_URL` si existe. |
| `services/auth.ts` | Llamadas auth. | `login(email, password)`, `register(data)`. |
| `services/appointments.ts` | Llamadas de citas. | `getAll`, `getById`, `create`, `updateStatus`. |
| `navigation/index.tsx` | (Si no usas Expo Router) Navegación por stacks/tabs. | Protege rutas por rol (guards). |
| `app.config.ts` / `app.json` | Config de Expo. | Nombre del proyecto, iconos, permisos, scheme. |
| `assets/images/Imagen Juego.png` | Ejemplo de recurso gráfico. | Usado en pantallas/headers/cards. |

> Si tienes archivos con otros nombres (por ejemplo `add,carModal.tsx` o `ExamsDetail.jsx`), reemplaza la ruta y descripción según tu caso. La tabla es **editable**.

---

## 🔐 Roles temporales (sin backend)
En `constants/roles.ts` (o dentro de `Login` si prefieres) define algo como:

```ts
// constants/roles.ts
export const EMAIL_ROLE: Record<string, 'admin' | 'cliente'> = {
  'admin@gmail.com': 'admin',
  'cliente@gmail.com': 'cliente',
};

export const getRoleByEmail = (email: string) => EMAIL_ROLE[email.toLowerCase()] ?? 'cliente';
```

Y en `app/login.tsx` o `useAuth.ts`:
```ts
import { getRoleByEmail } from '@/constants/roles';

// tras validar credenciales...
const role = getRoleByEmail(email);

if (role === 'admin') {
  router.replace('/admin');
} else {
  router.replace('/cliente');
}
```

> Esto es **solo para desarrollo**. Quita este mapeo cuando conectes el backend.

---

## 🧪 Scripts de `package.json`
Ajusta según tu `package.json` real:

```jsonc
{
  "scripts": {
    "start": "expo start",
    "android": "expo run:android",
    "ios": "expo run:ios",
    "web": "expo start --web",
    "lint": "eslint .",
    "typecheck": "tsc --noEmit"
  }
}


