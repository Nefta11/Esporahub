// Configuración de plantillas para Espora Report Builder

export const templates = [
  {
    id: 'inicio',
    name: 'Inicio',
    description: 'Plantilla inicial con información básica del proyecto',
    color: '#007AFF',
    filminaCount: 4,
    filminas: [
      { id: 1, title: 'Portada Espora', order: 1 },
      { id: 2, title: 'Aviso de Privacidad', order: 2 },
      { id: 3, title: 'Portada Estrategia Digital', order: 3 },
      { id: 4, title: 'Índice', order: 4 },
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
      { id: 1, title: 'Portada 1A: Estudios para la Estrategia Digital', order: 1 },
      { id: 2, title: 'Subportada A1: Demografía de la Sociedad Red', order: 2 },
      { id: 3, title: 'Demografía General y Digital', order: 3 },
      { id: 4, title: 'Estudio de Impacto de Medios', order: 4 },
      { id: 5, title: 'Estudio de Uso de Medios', order: 5 },
      { id: 6, title: 'Estudio de Influenciadores', order: 6 },
      { id: 7, title: 'Estudio de fórmulas de viralización', order: 7 },
      { id: 8, title: 'Estudio de tendencias gráficas', order: 8 },
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
    filminaCount: 18,
    filminas: [
      { id: 1, title: 'Subportada A2: Benchmark Redes Sociales', order: 1 },
      { id: 2, title: 'RRSS Propias: Benchmark Cuantitativo', order: 2 },
      { id: 3, title: 'RRSS Externas: Benchmark Cuantitativo', order: 3 },
      { id: 4, title: 'RRSS Propias: Benchmark\'s de mensaje por contenido posteado', order: 4 },
      { id: 5, title: 'RRSS Externas: Benchmark\'s de mensaje por contenido diferido', order: 5 },
      { id: 6, title: 'Análisis de Engagement - Facebook', order: 6 },
      { id: 7, title: 'Análisis de Engagement - Instagram', order: 7 },
      { id: 8, title: 'Análisis de Engagement - Twitter/X', order: 8 },
      { id: 9, title: 'Análisis de Engagement - LinkedIn', order: 9 },
      { id: 10, title: 'Análisis de Engagement - TikTok', order: 10 },
      { id: 11, title: 'Comparativa de Alcance por Plataforma', order: 11 },
      { id: 12, title: 'Análisis de Contenido Top Performance', order: 12 },
      { id: 13, title: 'Mejores Horarios de Publicación', order: 13 },
      { id: 14, title: 'Análisis de Hashtags Efectivos', order: 14 },
      { id: 15, title: 'Análisis de Competencia', order: 15 },
      { id: 16, title: 'Oportunidades de Mejora', order: 16 },
      { id: 17, title: 'Estrategia Recomendada', order: 17 },
      { id: 18, title: 'Conclusiones y Próximos Pasos', order: 18 },
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

// Helper: obtener lista de nombres
export const getTemplateNames = () => {
  return templates.map(template => template.name);
};

// Helper: obtener total de filminas
export const getTotalFilminas = () => {
  return templates.reduce((total, template) => total + template.filminaCount, 0);
};
