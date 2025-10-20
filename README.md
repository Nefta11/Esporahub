# <img src="https://raw.githubusercontent.com/Esporadix-team/imagenes_logos/main/esporaLogo.png" alt="Esporahub Logo" width="32" height="32"> Esporahub

> **Plataforma integral de gestión de campañas políticas y comunicación estratégica**

Esporahub es una aplicación web moderna desarrollada con React, TypeScript y Vite que permite la gestión completa de campañas políticas, desde la creación de cuentas hasta el seguimiento de tareas y la comunicación estratégica. Diseñada por el equipo de Esporadix para optimizar la eficiencia y efectividad de las campañas políticas modernas. .

## 🌟 Características destacadas

### 🏛️ Gestión integral de campañas políticas

- **Sistema de cuentas avanzado**: Creación y administración completa de perfiles de clientes políticos
- **Expedientes electrónicos**: Gestión detallada de información demográfica, psicográfica y estratégica
- **Acuerdos de colaboración**: Sistema digital para contratos y servicios especializados
- **Gestión multi-cuenta**: Soporte para múltiples campañas simultáneas con aislamiento de datos

### 📊 WorkHub - Centro de operaciones

- **Dashboard centralizado**: Visión unificada de todas las tareas y proyectos activos
- **Gestión de tareas colaborativa**: Asignación, seguimiento y control de progreso en tiempo real
- **Sistema de proyectos EHO**: Metodología estructurada (Estrategia, Herramientas, Organización)
- **Tableros interactivos**: Gestión visual de elementos de campaña con campos personalizables

### 🚀 Módulos especializados

- **Overview Intelligence**: Panel de control con métricas y análisis de rendimiento
- **Sales Force**: CRM especializado para gestión de clientes políticos
- **TrackLine**: Sistema de seguimiento y gestión de proyectos
- **People Operations**: Módulo de recursos humanos y gestión de equipos
- **Agenda Espora**: Calendario inteligente con sincronización de eventos
- **MoneyFlow**: Análisis financiero y control presupuestario
- **Knowledge Base**: Base de conocimientos y documentación centralizada

### 🤖 Espora IA - Asistente inteligente

- **Chatbot contextual**: Asistencia en tiempo real para consultas específicas
- **Análisis predictivo**: Insights basados en datos históricos de campañas
- **Recomendaciones automáticas**: Sugerencias estratégicas personalizadas
- **Procesamiento de lenguaje natural**: Interfaz conversacional avanzada

### 🎨 Experiencia de usuario excepcional

- **Diseño Apple-inspired**: Interfaz moderna con transiciones fluidas
- **Tema dinámico**: Soporte completo para modo claro y oscuro
- **Responsive design**: Optimización completa para todos los dispositivos
- **Micro-interacciones**: Animaciones sutiles que mejoran la usabilidad
- **Navegación intuitiva**: Arquitectura de información clara y eficiente

## 🚀 Stack tecnológico

### Core Framework

- **React 18.3.1** - Biblioteca de interfaz de usuario con hooks avanzados
- **TypeScript 5.5.3** - Tipado estático para desarrollo robusto y escalable
- **Vite 5.4.2** - Bundler ultrarrápido con HMR instantáneo

### Routing y Navegación

- **React Router Dom 6.22.3** - Navegación SPA con rutas protegidas y lazy loading
- **Arquitectura por features** - Organización modular con stack de rutas centralizado

### Gestión de Estado

- **Zustand 4.4.7** - Estado global ligero y performante
- **Custom Hooks** - Lógica de estado local reutilizable
- **Context API** - Gestión de temas y configuraciones globales

### UI/UX y Estilos

- **Tailwind CSS 3.4.1** - Framework utility-first con diseño responsivo
- **Lucide React 0.344.0** - Iconografía moderna y consistente
- **React Spring 9.7.3** - Animaciones fluidas basadas en física
- **React Transition Group 4.4.5** - Transiciones entre componentes
- **CSS Custom Properties** - Soporte para temas dinámicos

### Servicios y Comunicación

- **Axios 1.6.2** - Cliente HTTP con interceptores y manejo de errores
- **LocalStorage API** - Persistencia de datos con servicio abstracted
- **Service Layer** - Arquitectura de servicios separada por dominio

### Visualización y Efectos

- **Three.js 0.162.0** - Gráficos 3D y efectos visuales avanzados
- **React PDF** - Visualización y manipulación de documentos PDF
- **Canvas API** - Gráficos 2D personalizados

### Desarrollo y Calidad

- **ESLint 9.9.1** - Linting con reglas específicas para React y TypeScript
- **TypeScript ESLint** - Integración completa de reglas de tipado
- **PostCSS 8.4.35** - Procesamiento avanzado de CSS
- **Autoprefixer 10.4.18** - Compatibilidad automática entre navegadores

## 📁 Arquitectura del proyecto

```
src/
├── components/              # Componentes reutilizables
│   ├── ChecklistCaptura/   # Sistema de checklists EHO
│   │   ├── ChecklistTable.tsx
│   │   ├── ChecklistTableContainer.tsx
│   │   ├── LogoutButton.tsx
│   │   └── useChecklistLogic.ts
│   ├── generals/           # Componentes base del sistema
│   │   ├── EsporaIA.tsx
│   │   ├── LoginButton.tsx
│   │   ├── MeltingText.tsx
│   │   └── ProtectedRoute.tsx
│   ├── layout/             # Componentes de layout y UI
│   │   ├── Logo.tsx
│   │   ├── PageFooter.tsx
│   │   ├── PageHeader.tsx
│   │   ├── ThemeToggle.tsx
│   │   └── UserAvatar.tsx
│   ├── menu/               # Sistema de navegación
│   │   ├── MenuDock.tsx
│   │   ├── MenuGrid.tsx
│   │   ├── MenuNavbar.tsx
│   │   ├── MenuSidebar.tsx
│   │   └── useMenuItems.tsx
│   ├── modals/             # Ventanas modales
│   │   ├── AccessDeniedModal.tsx
│   │   ├── CreateAccountModal.tsx
│   │   ├── DeleteConfirmationModal.tsx
│   │   ├── InputModal.tsx
│   │   └── LogoutDialog.tsx
│   └── workhub/            # Componentes del WorkHub
│       ├── AccountSelector.tsx
│       ├── ProjectTable.tsx
│       ├── TabNavigation.tsx
│       ├── TasksSection.tsx
│       └── TimeCategories.tsx
├── config/                 # Configuración de la aplicación
│   └── api.ts             # Configuración de APIs
├── data/                   # Datos estáticos y tipos
│   └── users.ts           # Datos de usuarios mock
├── hooks/                  # Custom hooks reutilizables
│   └── useApi.ts          # Hook para manejo de APIs
├── pages/                  # Páginas principales de la aplicación
│   ├── auth/              # Autenticación
│   │   └── LoginPage.tsx
│   ├── landing/           # Página de bienvenida
│   │   └── LandingPage.tsx
│   ├── menu/              # Menú principal
│   │   └── MenuPage.tsx
│   ├── overview/          # Dashboard y gestión de cuentas
│   │   ├── OverviewMainPage.tsx
│   │   ├── clientDashboard/
│   │   │   ├── ClientDashboardPage.tsx
│   │   │   ├── CollaborationAgreementPage.tsx
│   │   │   ├── EHOPage.tsx
│   │   │   ├── ExpedienteElectronicoPage.tsx
│   │   │   └── PresentacionInicialPage.tsx
│   │   └── overviewAccounts/
│   │       ├── AccountSettings.tsx
│   │       ├── ActiveAccountsPage.tsx
│   │       ├── InactiveAccountsPage.tsx
│   │       └── SelectAccountPage.tsx
│   ├── worhub/            # Centro de trabajo colaborativo
│   │   └── WorkHubPage.tsx
│   ├── ConstructionPage.tsx
│   └── TracklinePage.tsx
├── services/               # Capa de servicios y APIs
│   ├── agreementService.ts
│   ├── authService.ts
│   ├── checklistService.ts
│   ├── clientService.ts
│   └── fileService.ts
├── stack/                  # Configuración de routing
│   └── RouterStack.tsx    # Stack de rutas centralizado
├── stores/                 # Estados globales (Zustand)
│   ├── agreementStore.ts
│   ├── authStore.ts
│   ├── checklistStore.ts
│   ├── clientStore.ts
│   └── fileStore.ts
├── styles/                 # Estilos CSS organizados por feature
│   ├── global.css         # Estilos globales y variables
│   ├── account.css
│   ├── checklist-captura.css
│   ├── construction.css
│   ├── espora-ia.css
│   ├── expediente-electronico.css
│   ├── header.css
│   ├── login-page.css
│   ├── menu.css
│   ├── modal.css
│   ├── overview-clean.css
│   └── theme-toggle.css
├── types/                  # Definiciones de tipos TypeScript
│   └── index.ts           # Tipos centralizados
└── utils/                  # Utilidades y helpers
    ├── errorHandler.ts    # Manejo centralizado de errores
    ├── storage.ts         # Servicio de almacenamiento abstracto
    └── validation.ts      # Validaciones de formularios
```

## 🛠️ Instalación y desarrollo

### Requisitos previos

- **Node.js** (versión 18.x o superior)
- **npm** (versión 8.x o superior) o **yarn**
- **Git** para control de versiones

### Instalación rápida

1. **Clonar el repositorio**

   ```bash
   git clone https://github.com/Nefta11/Esporahub.git
   cd esporahub
   ```

2. **Instalar dependencias**

   ```bash
   npm install
   # o usando yarn
   yarn install
   ```

3. **Configurar variables de entorno**

   ```bash
   cp .env.example .env.local
   # Editar .env.local con tus configuraciones
   ```

4. **Iniciar servidor de desarrollo**

   ```bash
   npm run dev
   ```

5. **Abrir en navegador**
   ```
   http://localhost:5173
   ```

### Configuración avanzada

#### Alias de rutas (ya configurados)

```typescript
// vite.config.ts
resolve: {
  alias: {
    '@': '/src',
    '@/components': '/src/components',
    '@/pages': '/src/pages',
    '@/styles': '/src/styles',
    '@/hooks': '/src/hooks',
    '@/stores': '/src/stores',
    '@/services': '/src/services',
    '@/utils': '/src/utils',
    '@/types': '/src/types',
    '@/data': '/src/data',
    '@/config': '/src/config',
  },
}
```

#### ESLint y TypeScript

```bash
# Verificar tipos
npm run type-check

# Ejecutar linting
npm run lint

# Corregir automáticamente
npm run lint:fix
```

## 📜 Scripts de desarrollo

```bash
# Desarrollo
npm run dev          # Servidor de desarrollo con HMR
npm run dev:host     # Servidor accesible desde la red local

# Construcción
npm run build        # Build optimizada para producción
npm run preview      # Preview de la build de producción

# Calidad de código
npm run lint         # Ejecutar ESLint
npm run lint:fix     # Corregir problemas automáticamente
npm run type-check   # Verificación de tipos TypeScript

# Utilidades
npm run clean        # Limpiar archivos de build
npm run analyze      # Analizar bundle size
```

## 🏗️ Patrones de arquitectura

### Gestión de estado avanzada

- **Zustand stores** - Estado global con persistencia selectiva
- **Custom hooks** - Lógica de estado local encapsulada
- **Context providers** - Configuración global (temas, auth)
- **Service layer** - Abstracción de APIs y almacenamiento

### Arquitectura de componentes

- **Atomic Design** - Jerarquía de componentes modulares
- **Compound Components** - Componentes complejos con sub-componentes
- **Render Props** - Lógica compartida entre componentes
- **Higher-Order Components** - Funcionalidad transversal

### Routing y navegación

- **Feature-based routing** - Rutas organizadas por funcionalidad
- **Protected routes** - Control granular de acceso por roles
- **Lazy loading** - Carga bajo demanda para optimización
- **Route transitions** - Animaciones suaves entre páginas

### Performance y optimización

- **Memoización inteligente** - React.memo y useMemo estratégicos
- **Code splitting** - División automática del código
- **Asset optimization** - Imágenes y recursos optimizados
- **Bundle analysis** - Monitoreo del tamaño de la aplicación

## 🔐 Sistema de seguridad y autenticación

### Control de acceso multinivel

- **Autenticación JWT** - Tokens seguros con expiración automática
- **Roles granulares** - Super Admin, Admin, Manager, Collaborator
- **Permisos específicos** - Control fino sobre funcionalidades
- **Rutas protegidas** - Validación en tiempo real del acceso
- **Gestión de sesiones** - Persistencia inteligente y logout automático

### Seguridad de datos

- **Aislamiento por cuenta** - Datos completamente separados entre clientes
- **Validación de entrada** - Sanitización y validación en cliente y servidor
- **Almacenamiento seguro** - Encriptación de datos sensibles
- **Auditoría de acciones** - Log completo de actividades del usuario

## 🎯 Funcionalidades principales por módulo

### 📊 Overview Dashboard

- **Analytics en tiempo real** - Métricas de campaña actualizadas
- **Widgets personalizables** - Dashboard adaptable por usuario
- **Alertas inteligentes** - Notificaciones contextuales y prioritarias
- **Exportación de reportes** - Informes en PDF y Excel

### 👥 Gestión de cuentas políticas

- **Expedientes completos** - Información demográfica, psicográfica y estratégica
- **Gestión de contratos** - Acuerdos digitales con firma electrónica
- **Timeline de campaña** - Cronología de eventos y actividades
- **Multi-tenant architecture** - Soporte para múltiples campañas

### 🚀 WorkHub colaborativo

- **Tableros Kanban** - Gestión visual de tareas y proyectos
- **Asignación inteligente** - Distribución automática según capacidad
- **Seguimiento en tiempo real** - Progreso actualizado instantáneamente
- **Comunicación integrada** - Chat y comentarios en contexto

### 🤖 Espora IA avanzada

- **Análisis predictivo** - Forecasting basado en datos históricos
- **Recomendaciones estratégicas** - Insights personalizados por campaña
- **Automatización de workflows** - Procesos inteligentes optimizados
- **Procesamiento de documentos** - Extracción automática de información

## 🚦 Roadmap de desarrollo

### ✅ **Completado** (v1.0)

- Sistema de autenticación robusto
- Gestión completa de cuentas políticas
- Dashboard Overview con métricas
- WorkHub con gestión de tareas
- Espora IA básica
- Sistema de temas dinámicos
- Arquitectura responsive completa

### 🚧 **En desarrollo** (v1.1)

- Módulo de reportes avanzados
- Integraciones con redes sociales (Meta, Twitter, TikTok)
- Sistema de notificaciones push
- API REST documentada
- Módulo de encuestas y formularios

### � **Próximas versiones** (v1.2+)

- Análisis de sentimientos en redes sociales
- Integración con sistemas de email marketing
- Módulo de presupuestos y facturación
- App móvil nativa (React Native)
- Integraciones con CRM externos
- Sistema de webhooks para integraciones

### � **Visión futura** (v2.0+)

- Machine Learning para predicción electoral
- Realidad aumentada para eventos
- Blockchain para transparencia electoral
- IoT para análisis de eventos presenciales

## � Guía de contribución

### Estándares de código

- **TypeScript estricto** - Tipado completo obligatorio
- **ESLint configurado** - Reglas específicas para React y TS
- **Prettier integrado** - Formateo automático consistente
- **Conventional Commits** - Mensajes de commit semánticos

### Workflow de desarrollo

```bash
# 1. Crear rama feature
git checkout -b feature/nueva-funcionalidad

# 2. Desarrollar con commits atómicos
git add .
git commit -m "feat: agregar nueva funcionalidad"

# 3. Ejecutar tests y linting
npm run lint
npm run type-check

# 4. Push y pull request
git push origin feature/nueva-funcionalidad
```

### Estructura de commits

```
feat: nueva funcionalidad
fix: corrección de bug
docs: actualización de documentación
style: cambios de formato (no afectan lógica)
refactor: refactorización de código
test: agregar o modificar tests
chore: tareas de mantenimiento
```

## 📈 Métricas y performance

### Benchmarks actuales

- **First Contentful Paint**: < 1.2s
- **Largest Contentful Paint**: < 2.5s
- **Time to Interactive**: < 3.8s
- **Cumulative Layout Shift**: < 0.1
- **Bundle size**: ~680KB gzipped

### Optimizaciones implementadas

- **Tree shaking automático** - Eliminación de código no utilizado
- **Lazy loading de rutas** - Carga bajo demanda
- **Optimización de imágenes** - WebP con fallback
- **CDN para assets estáticos** - Carga rápida global
- **Service Worker** - Cache inteligente y offline support

## 🌍 Compatibilidad

### Navegadores soportados

- **Chrome** 90+ ✅
- **Firefox** 88+ ✅
- **Safari** 14+ ✅
- **Edge** 90+ ✅
- **Opera** 76+ ✅

### Dispositivos

- **Desktop** 1920x1080+ (Optimizado)
- **Tablet** 768-1024px (Completo)
- **Mobile** 375-768px (Adaptativo)
- **Touch devices** (Gestos nativos)

## 🤝 Equipo y contacto

### Core Team

- **Desarrollo Frontend**: Equipo Esporadix
- **UX/UI Design**: Diseñadores especializados en política
- **Backend Services**: Arquitectos de soluciones
- **DevOps**: Infraestructura y deployment

### Soporte técnico

- **Email**: soporte@esporadix.com
- **Documentación**: [docs.esporahub.com](https://docs.esporahub.com)
- **Status**: [status.esporahub.com](https://status.esporahub.com)
- **Changelog**: [Releases GitHub](https://github.com/Nefta11/Esporahub/releases)

## 📄 Licencia y derechos

Este proyecto es **propiedad intelectual exclusiva de Esporadix Team**.

### Términos de uso

- ✅ Uso interno para clientes de Esporadix
- ✅ Personalización bajo licencia comercial
- ❌ Redistribución sin autorización
- ❌ Uso comercial independiente
- ❌ Reverse engineering

**© 2025 Esporadix Team. Todos los derechos reservados.**

---

<div align="center">

**Desarrollado con ❤️ por el equipo de Esporadix**

[![Esporadix](https://img.shields.io/badge/Esporadix-Team-blue?style=for-the-badge&logo=react&logoColor=white)](https://esporadix.com)
[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-blue?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4.2-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)

</div>
