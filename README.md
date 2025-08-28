# <img src="https://raw.githubusercontent.com/Esporadix-team/imagenes_logos/main/esporaLogo.png" alt="Esporahub Logo" width="32" height="32"> Esporahub

> **Plataforma integral de gestión de campañas políticas y comunicación estratégica**

Esporahub es una aplicación web moderna desarrollada con React, TypeScript y Vite que permite la gestión completa de campañas políticas, desde la creación de cuentas hasta el seguimiento de tareas y la comunicación estratégica.

## ✨ Características principales

### 🏛️ Gestión de cuentas políticas
- **Creación de cuentas**: Sistema completo para registrar nuevos clientes políticos
- **Gestión de perfiles**: Administración de información personal y de campaña
- **Configuración de elecciones**: Establecimiento de fechas clave y objetivos
- **Integración de redes sociales**: Conexión con plataformas digitales

### 📋 Sistema de checklist y seguimiento
- **EHO (Estrategia, Herramientas, Organización)**: Metodología estructurada para campañas
- **Seguimiento de tareas**: Control de progreso y asignación de responsabilidades
- **Gestión de fechas**: Calendario de actividades y deadlines
- **Colaboración en equipo**: Sistema de permisos y roles de usuario

### 🤖 Espora IA
- **Asistente inteligente**: Chat bot integrado para consultas y soporte
- **Respuestas contextuales**: Ayuda especializada en gestión de campañas
- **Interfaz conversacional**: Comunicación natural y intuitiva

### 🎨 Experiencia de usuario
- **Tema claro/oscuro**: Adaptación visual según preferencias
- **Diseño responsivo**: Optimizado para desktop y móvil
- **Animaciones fluidas**: Transiciones suaves y modernas
- **Interfaz intuitiva**: Navegación simple y eficiente

## 🚀 Tecnologías utilizadas

### Frontend Core
- **React 18.3.1** - Biblioteca de interfaz de usuario
- **TypeScript 5.5.3** - Tipado estático para JavaScript
- **Vite 5.4.2** - Bundler y servidor de desarrollo ultrarrápido

### Routing y Estado
- **React Router Dom 6.22.3** - Navegación SPA
- **Zustand 4.4.7** - Gestión de estado global

### UI y Estilos
- **Tailwind CSS 3.4.1** - Framework de CSS utility-first
- **Lucide React 0.344.0** - Iconografía moderna
- **React Spring 9.7.3** - Animaciones fluidas
- **React Transition Group 4.4.5** - Transiciones de componentes

### Comunicación
- **Axios 1.6.2** - Cliente HTTP para APIs
- **Three.js 0.162.0** - Gráficos 3D y efectos visuales

### Desarrollo
- **ESLint 9.9.1** - Linting y calidad de código
- **PostCSS 8.4.35** - Procesamiento de CSS
- **Autoprefixer 10.4.18** - Prefijos CSS automáticos

## 📁 Estructura del proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── ChecklistCaptura/ # Gestión de checklists
│   ├── generals/        # Componentes generales
│   ├── layout/          # Componentes de layout
│   └── modals/          # Ventanas modales
├── config/              # Configuración de la app
├── data/                # Datos estáticos y tipos
├── hooks/               # Custom hooks
├── pages/               # Páginas de la aplicación
│   ├── auth/           # Autenticación
│   ├── landing/        # Página de inicio
│   ├── overview/       # Dashboard principal
│   └── worhub/         # Hub de trabajo
├── services/            # Servicios y APIs
├── stack/               # Configuración de routing
├── stores/              # Estados globales (Zustand)
├── styles/              # Estilos CSS
├── types/               # Definiciones de tipos
└── utils/               # Utilidades y helpers
```

## 🛠️ Instalación y configuración

### Prerrequisitos
- **Node.js** (versión 18 o superior)
- **npm** o **yarn**

### Instalación

1. **Clona el repositorio**
   ```bash
   git clone https://github.com/your-username/esporahub.git
   cd esporahub
   ```

2. **Instala las dependencias**
   ```bash
   npm install
   ```

3. **Configura las variables de entorno**
   ```bash
   cp .env.example .env.local
   ```

4. **Inicia el servidor de desarrollo**
   ```bash
   npm run dev
   ```

5. **Abre tu navegador**
   ```
   http://localhost:5173
   ```

## 📜 Scripts disponibles

```bash
# Desarrollo
npm run dev          # Inicia el servidor de desarrollo

# Producción
npm run build        # Construye la aplicación para producción
npm run preview      # Previsualiza la build de producción

# Calidad de código
npm run lint         # Ejecuta ESLint para revisar el código
```

## 🏗️ Arquitectura y patrones

### Gestión de estado
- **Zustand stores** para estado global
- **React hooks** para estado local
- **Context API** para temas y configuración

### Arquitectura de componentes
- **Atomic Design** - Componentes modulares y reutilizables
- **Compound Components** - Componentes complejos con sub-componentes
- **Custom Hooks** - Lógica reutilizable extraída

### Routing
- **React Router** con rutas protegidas
- **Lazy loading** para optimización de rendimiento
- **Breadcrumbs** para navegación contextual

## 🔐 Sistema de autenticación

- **Roles y permisos** granulares
- **Rutas protegidas** según nivel de acceso
- **Gestión de sesiones** persistente
- **Control de acceso** por funcionalidades

## 🎯 Funcionalidades clave

### Dashboard Overview
- **Métricas de campaña** en tiempo real
- **Acceso rápido** a funciones principales
- **Notificaciones** y alertas importantes

### Gestión de clientes
- **Creación de perfiles** completos
- **Acuerdos de colaboración** digitales
- **Seguimiento de proyectos** activos

### WorkHub
- **Gestión de tareas** colaborativa
- **Asignación de recursos** y responsables
- **Seguimiento de progreso** visual

## 🚦 Estados de desarrollo

- ✅ **Sistema de autenticación**
- ✅ **Gestión de cuentas**
- ✅ **Dashboard principal**
- ✅ **Sistema de checklist**
- ✅ **WorkHub**
- ✅ **Espora IA**
- 🚧 **Reportes avanzados**
- 🚧 **Integraciones de redes sociales**
- 📋 **Módulo de análisis de datos**

## 📄 Licencia

Este proyecto es propiedad de **Esporadix Team** y está protegido por derechos de autor.

---

**Desarrollado con ❤️ por el equipo de Esporadix**