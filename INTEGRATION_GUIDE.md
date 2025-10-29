# 📋 Guía de Integración - Espora Report Builder

## 🎯 Resumen

Se han creado 3 archivos para implementar el Report Builder:

1. **`src/config/templates.js`** - Configuración de plantillas
2. **`src/components/reportBuilder/TemplateSelector.jsx`** - Selector de plantillas
3. **`src/components/reportBuilder/FilminaEditor.jsx`** - Editor de filminas

Además, 2 archivos CSS:
- **`src/styles/reportBuilder/TemplateSelector.css`**
- **`src/styles/reportBuilder/FilminaEditor.css`**

---

## 📦 Paso 1: Instalar Dependencias

Ejecuta en tu terminal:

```bash
npm install fabric html2pdf.js
```

**Dependencias instaladas:**
- `fabric`: ^5.3.0 - Librería para manipular canvas HTML5
- `html2pdf.js`: ^0.10.1 - Exportar canvas a PDF

---

## 🛣️ Paso 2: Integrar Rutas en RouterStack

Abre el archivo: **`src/stack/RouterStack.tsx`**

### 2.1 Agregar Imports

Agrega estos imports al inicio del archivo:

```javascript
import TemplateSelector from '@/components/reportBuilder/TemplateSelector';
import FilminaEditor from '@/components/reportBuilder/FilminaEditor';
```

### 2.2 Agregar Rutas

Dentro del componente `<Routes>`, agrega estas dos rutas protegidas:

```jsx
{/* Espora Report Builder - Template Selector */}
<Route
  path="/report-builder"
  element={
    <ProtectedRoute>
      <TemplateSelector />
    </ProtectedRoute>
  }
/>

{/* Espora Report Builder - Filmina Editor */}
<Route
  path="/report-builder/editor/:templateId"
  element={
    <ProtectedRoute>
      <FilminaEditor />
    </ProtectedRoute>
  }
/>
```

**Nota:** Si no usas `<ProtectedRoute>` en tu app, simplemente usa:

```jsx
<Route path="/report-builder" element={<TemplateSelector />} />
<Route path="/report-builder/editor/:templateId" element={<FilminaEditor />} />
```

---

## 🧭 Paso 3: Agregar Navegación al Report Builder

Tienes varias opciones para navegar al Report Builder desde tu aplicación:

### Opción A: Desde el Menu Principal

Edita **`src/components/menu/useMenuItems.ts`** (o donde defines los items del menú):

```javascript
{
  id: 'report-builder',
  label: 'Report Builder',
  description: 'Crea reportes profesionales con plantillas predefinidas',
  category: 'operativas',
  path: '/report-builder',
  icon: <FileText size={40} />,
  color: '#AF52DE',
  status: 'active'
}
```

### Opción B: Navegación Programática

Desde cualquier componente:

```javascript
import { useNavigate } from 'react-router-dom';

const MyComponent = () => {
  const navigate = useNavigate();

  const handleOpenReportBuilder = () => {
    navigate('/report-builder');
  };

  return (
    <button onClick={handleOpenReportBuilder}>
      Abrir Report Builder
    </button>
  );
};
```

### Opción C: Link Directo

```javascript
import { Link } from 'react-router-dom';

<Link to="/report-builder">Abrir Report Builder</Link>
```

---

## 🎨 Paso 4: Verificar Sistema de Temas

Los componentes están diseñados para funcionar con tu sistema de temas dark/light existente.

Asegúrate de que tu `<body>` tenga las clases `dark-theme` o `light-theme` aplicadas según corresponda.

**Verificación:**

```javascript
// En tu navegador, en la consola:
document.body.classList.contains('dark-theme')  // debe retornar true o false
document.body.classList.contains('light-theme') // debe retornar true o false
```

---

## 📁 Estructura de Archivos Creados

```
src/
├── config/
│   └── templates.js              # Configuración de las 3 plantillas
│
├── components/
│   └── reportBuilder/
│       ├── TemplateSelector.jsx  # Selector de plantillas (grid de cards)
│       └── FilminaEditor.jsx     # Editor con Fabric.js canvas
│
└── styles/
    └── reportBuilder/
        ├── TemplateSelector.css  # Estilos del selector
        └── FilminaEditor.css     # Estilos del editor
```

---

## 🧪 Paso 5: Probar la Integración

### 1. Instala las dependencias:
```bash
npm install fabric html2pdf.js
```

### 2. Inicia el servidor:
```bash
npm run dev
```

### 3. Navega a:
```
http://localhost:5173/report-builder
```

### 4. Verifica:
- ✅ Se muestran 3 tarjetas de plantillas
- ✅ Cada tarjeta tiene: icono, título, descripción, contador de filminas, lista scrolleable
- ✅ El botón "Seleccionar plantilla" navega al editor
- ✅ En el editor se carga el canvas de Fabric.js con texto inicial
- ✅ El botón "Exportar PDF" genera un PDF landscape
- ✅ El tema dark/light se aplica correctamente

---

## 🔧 Configuración de Plantillas

### Agregar una Nueva Plantilla

Edita **`src/config/templates.js`** y agrega un nuevo objeto al array `templates`:

```javascript
{
  id: 'mi-plantilla',
  name: 'Mi Plantilla',
  description: 'Descripción de mi plantilla',
  color: '#FF375F',  // Color del icono
  filminaCount: 5,
  filminas: [
    { id: 1, title: 'Primera filmina', order: 1 },
    { id: 2, title: 'Segunda filmina', order: 2 },
    // ... más filminas
  ],
  canvasConfig: {
    text: 'Texto Inicial',
    left: 100,
    top: 100,
    fontSize: 48,
    fontWeight: 'bold',
    fill: '#1967D2',
    fontFamily: 'Inter'
  }
}
```

### Modificar Plantillas Existentes

Simplemente edita los objetos en `templates.js`. Los cambios se reflejarán automáticamente.

---

## 🎯 Funcionalidades Implementadas

### TemplateSelector (Selector de Plantillas)

✅ Grid responsivo de 3 columnas (1 columna en móvil)
✅ 3 plantillas predefinidas:
  - **Inicio**: 4 filminas
  - **Estrategia Digital**: 8 filminas
  - **Benchmark RRSS**: 18 filminas
✅ Cada card muestra:
  - Icono con color personalizado
  - Título y descripción
  - Contador de filminas
  - Lista scrolleable de contenidos (máx. 280px altura)
  - Botón "Seleccionar plantilla"
✅ Navegación a `/report-builder/editor/:templateId`
✅ Animaciones de entrada (fadeIn, slideUp)
✅ Soporte dark/light theme
✅ Glassmorphism con backdrop-filter blur
✅ Hover effects y transiciones suaves

### FilminaEditor (Editor de Filminas)

✅ Layout de 3 columnas:
  - **Sidebar izquierdo** (280px): Herramientas (placeholder)
  - **Centro**: Canvas Fabric.js (960x540px, fondo blanco)
  - **Sidebar derecho** (300px): Propiedades (placeholder)
✅ Header con:
  - Botón "← Volver" (navega al selector)
  - Título dinámico de la plantilla
  - Botón "Exportar PDF"
✅ Canvas Fabric.js inicializado:
  - Dimensiones: 960x540px
  - Fondo blanco
  - Carga texto inicial según templateId:
    - `inicio`: "Portada Espora" (100, 100, 48px, #1967D2)
    - `estrategia-digital`: "Estrategia Digital" (60, 80, 56px, #1a1a1a)
    - `benchmark-rrss`: "Benchmark RRSS" (80, 60, 52px, #1a1a1a)
✅ Exportación a PDF:
  - Formato: landscape 254x143mm
  - Nombre: `espora-filmina-[timestamp].pdf`
  - Usa html2pdf.js
  - Calidad máxima (scale: 2)
✅ Estado de error si plantilla no encontrada
✅ Soporte dark/light theme
✅ Glassmorphism con backdrop-filter blur
✅ Animaciones de entrada
✅ Responsive design

---

## 🔍 Debugging

### Problema: "Cannot find module 'fabric'"

**Solución:**
```bash
npm install fabric
```

### Problema: "Cannot find module 'html2pdf.js'"

**Solución:**
```bash
npm install html2pdf.js
```

### Problema: Rutas no funcionan

**Verificar:**
1. Las rutas están dentro de `<Routes>` en `RouterStack.tsx`
2. Los imports de los componentes son correctos
3. El path alias `@/` está configurado en `vite.config.ts`

### Problema: Estilos no se aplican

**Verificar:**
1. Los archivos CSS existen en `src/styles/reportBuilder/`
2. Los imports de CSS están en los componentes:
   ```javascript
   import '@/styles/reportBuilder/TemplateSelector.css';
   import '@/styles/reportBuilder/FilminaEditor.css';
   ```

### Problema: Canvas no se muestra

**Verificar:**
1. Fabric.js está instalado: `npm list fabric`
2. El canvasRef está correctamente referenciado
3. Las dimensiones del canvas son correctas (960x540)

### Problema: PDF no se genera

**Verificar:**
1. html2pdf.js está instalado: `npm list html2pdf.js`
2. El canvas tiene contenido para exportar
3. No hay errores en la consola del navegador

---

## 📊 Sistema de Diseño Aplicado

Los componentes siguen **exactamente** el mismo sistema de diseño de tu aplicación:

### Colores:
- **Dark Mode**: Fondo degradado oscuro, texto blanco, azul #007AFF, morado #5E5CE6
- **Light Mode**: Fondo degradado claro, texto negro, azul #007AFF

### Tipografía:
- Font family: `var(--font-primary)` (Google Sans Display)
- Tamaños: 15px-36px según el elemento
- Pesos: 400 (regular), 600 (semibold), 700 (bold)

### Efectos:
- **Glassmorphism**: `backdrop-filter: saturate(180%) blur(20px)`
- **Sombras**: `0 4px 16px rgba(0, 0, 0, 0.15)`
- **Border radius**: 10px-20px según el elemento
- **Transiciones**: `0.2s-0.6s cubic-bezier(0.25, 0.1, 0.25, 1)`

### Componentes:
- Cards con bordes translúcidos
- Hover effects con transform y scale
- Scrollbars personalizados
- Animaciones de entrada (fadeIn, cardAppear)
- Botones con estados hover/active

---

## ✨ Próximos Pasos (Opcional)

Si quieres extender la funcionalidad:

### 1. Agregar Herramientas al Editor
En `FilminaEditor.jsx`, reemplaza el placeholder de herramientas con:
- Botón "Agregar Texto"
- Botón "Agregar Imagen"
- Botón "Agregar Rectángulo"
- etc.

### 2. Agregar Panel de Propiedades
En `FilminaEditor.jsx`, reemplaza el placeholder de propiedades con:
- Input para cambiar color
- Slider para opacidad
- Input para tamaño de fuente
- etc.

### 3. Guardar Proyectos
Implementar guardado de proyectos con:
- Backend API para guardar JSON del canvas
- LocalStorage para guardar temporalmente
- Cargar proyectos guardados

### 4. Múltiples Filminas
Implementar navegación entre filminas:
- Thumbnails de filminas en el sidebar
- Botones Anterior/Siguiente
- Agregar/eliminar filminas

---

## 📞 Soporte

Si tienes problemas con la integración:

1. Verifica que todas las dependencias estén instaladas
2. Revisa la consola del navegador para errores
3. Asegúrate de que las rutas estén correctamente configuradas
4. Verifica que el sistema de temas dark/light esté funcionando

---

## ✅ Checklist Final

- [ ] Instalar `fabric` y `html2pdf.js`
- [ ] Crear carpeta `src/config/` si no existe
- [ ] Crear carpeta `src/components/reportBuilder/`
- [ ] Crear carpeta `src/styles/reportBuilder/`
- [ ] Verificar que todos los archivos estén en su lugar
- [ ] Agregar imports en `RouterStack.tsx`
- [ ] Agregar rutas en `RouterStack.tsx`
- [ ] Agregar navegación al Report Builder en el menú
- [ ] Probar navegación al selector
- [ ] Probar selección de plantilla
- [ ] Probar carga del editor
- [ ] Probar exportación a PDF
- [ ] Verificar tema dark/light
- [ ] Verificar responsive en móvil

---

¡Listo! Ahora tienes un Report Builder completamente funcional e integrado con tu aplicación. 🚀
