// Configuración de plantillas para Espora Report Builder

export const templates = [
  {
    id: 'inicio',
    name: 'Inicio',
    description: 'Plantilla inicial con información básica del proyecto',
    color: '#007AFF',
    filminaCount: 4,
    filminas: [
      { id: 1, title: 'Portada Espora', order: 1, background: 'portada.jpeg' },
      { id: 2, title: 'Aviso de Privacidad', order: 2, background: 'avisoprivacidad.jpeg' },
      { id: 3, title: 'Portada Estrategia Digital', order: 3, background: 'portada.jpeg' },
      { id: 4, title: 'Índice', order: 4, background: 'membretesimple.jpeg' },
    ],
    canvasConfig: {
      text: 'Portada Espora',
      left: 100,
      top: 100,
      fontSize: 48,
      fontWeight: 'bold',
      fill: '#1967D2',
      fontFamily: 'Inter'
    }
  },
  {
    id: 'estrategia-digital',
    name: 'Estrategia Digital',
    description: 'Análisis completo de la estrategia digital y estudios de mercado',
    color: '#5E5CE6',
    filminaCount: 8,
    filminas: [
      { id: 1, title: 'Portada 1A: Estudios para la Estrategia Digital', order: 5, background: 'portada.jpeg' },
      { id: 2, title: 'Subportada A1: Demografía de la Sociedad Red', order: 6, background: 'subportada1.jpeg' },
      { id: 3, title: 'Demografía General y Digital', order: 7, background: 'membretesimple.jpeg' },
      { id: 4, title: 'Estudio de Impacto de Medios', order: 8, background: 'membretesimple.jpeg' },
      { id: 5, title: 'Estudio de Uso de Medios', order: 9, background: 'membretesimple.jpeg' },
      { id: 6, title: 'Estudio de Influenciadores', order: 10, background: 'membretesimple.jpeg' },
      { id: 7, title: 'Estudio de fórmulas de viralización', order: 11, background: 'membretesimple.jpeg' },
      { id: 8, title: 'Estudio de tendencias gráficas', order: 12, background: 'membretesimple.jpeg' },
    ],
    canvasConfig: {
      text: 'Estrategia Digital',
      left: 60,
      top: 80,
      fontSize: 56,
      fontWeight: 'bold',
      fill: '#1a1a1a',
      fontFamily: 'Inter'
    }
  },
  {
    id: 'benchmark-rrss',
    name: 'Benchmark RRSS',
    description: 'Análisis exhaustivo de redes sociales propias y externas',
    color: '#AF52DE',
    filminaCount: 15,
    filminas: [
      { id: 1, title: 'Subportada A2: Benchmark Redes Sociales', order: 13, background: 'subportada2.jpeg' },
      { id: 2, title: 'RRSS Propias: Benchmark Cuantitativo', order: 14, background: 'membretesimple.jpeg' },
      { id: 3, title: 'RRSS Externas: Benchmark Cuantitativo', order: 15, background: 'membretesimple.jpeg' },
      { id: 4, title: 'RRSS Propias: Benchmark\'s de mensaje por contenido posteado', order: 16, background: 'membretesimple.jpeg' },
      { id: 5, title: 'RRSS Externas: Benchmark\'s de mensaje por contenido difundido', order: 17, background: 'membretesimple.jpeg' },
      { id: 6, title: 'RRSSS Propias. Benchmark de mensaje por contenido difundi', order: 18, background: 'membretesimple.jpeg' },
      { id: 7, title: 'RRSSS Externas. Benchmark de mensaje por contenido difundido', order: 19, background: 'membretesimple.jpeg' },
      { id: 8, title: 'RRSSS Propias. Benchmark adjetivación p/contenido posteado', order: 20, background: 'membretesimple.jpeg' },
      { id: 9, title: 'RRSSS Externas. Benchmark adjetivación p/contenido posteado', order: 21, background: 'membretesimple.jpeg' },
      { id: 10, title: 'RRSSS Propias. Benchmark adjetivación p/contenido difundido', order: 22, background: 'membretesimple.jpeg' },
      { id: 11, title: 'RRSSS Externas. Benchmark adjetivación p/contenido difundido', order: 23, background: 'membretesimple.jpeg' },
      { id: 12, title: 'RRSSS Propias. Benchmark audiencia p/contenido posteado', order: 24, background: 'membretesimple.jpeg' },
      { id: 13, title: 'RRSSS Externas. Benchmark audiencia p/contenido posteado', order: 25, background: 'membretesimple.jpeg' },
      { id: 14, title: 'RRSSS Propias. Benchmark audiencia p/contenido difundido', order: 26, background: 'membretesimple.jpeg' },
  { id: 15, title: 'RRSSS Externas. Benchmark audiencia p/contenido difundido', order: 27, background: 'membretesimple.jpeg' },
  { id: 16, title: 'Benchmark de mensaje integrado', order: 28, background: 'membretesimple.jpeg' },
  { id: 17, title: 'RRRSS Propias. Benchmark de difusión oficial', order: 29, background: 'membretesimple.jpeg' },
  { id: 18, title: 'RRRSS Propias. Benchmark de difusión alterna', order: 30, background: 'membretesimple.jpeg' },
    ],
    canvasConfig: {
      text: 'Benchmark RRSS',
      left: 80,
      top: 60,
      fontSize: 52,
      fontWeight: 'bold',
      fill: '#1a1a1a',
      fontFamily: 'Inter'
    }
  }
];

// Helper: obtener plantilla por ID
export const getTemplateById = (templateId) => {
  return templates.find(template => template.id === templateId);
};

// Helper: obtener filmina específica por templateId y filminaId
export const getFilminaById = (templateId, filminaId) => {
  const template = getTemplateById(templateId);
  if (!template) return null;
  return template.filminas.find(filmina => filmina.id === parseInt(filminaId));
};

// Helper: obtener lista de nombres
export const getTemplateNames = () => {
  return templates.map(template => template.name);
};

// Helper: obtener total de filminas
export const getTotalFilminas = () => {
  return templates.reduce((total, template) => total + template.filminaCount, 0);
};
