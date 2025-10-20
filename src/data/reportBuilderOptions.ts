export interface ReportOption {
    value: string;
    label: string;
    category?: string;
}

export const reportBuilderOptions: ReportOption[] = [
    // Portadas y Preliminares
    { value: 'portada-espora', label: 'Portada Espora', category: 'Portadas' },
    { value: 'aviso-privacidad', label: 'Aviso de Privacidad', category: 'Preliminares' },
    { value: 'portada-estrategia-digital', label: 'Portada Estrategia Digital', category: 'Portadas' },
    { value: 'indice', label: 'Índice', category: 'Preliminares' },

    // 1A. Estudios para la Estrategia Digital
    { value: 'portada-1a-estudios', label: 'Portada 1A. Estudios para la Estrategia Digital', category: 'Portadas' },

    // A1. Demografía de la Sociedad Red
    { value: 'subportada-a1-demografia', label: 'Subportada A1. Demografía de la Sociedad Red', category: 'Subportadas' },
    { value: 'demografia-general-digital', label: 'Demografía General y Digital', category: 'A1. Demografía' },
    { value: 'estudio-impacto-medios', label: 'Estudio de Impacto de Medios', category: 'A1. Demografía' },
    { value: 'estudio-uso-medios', label: 'Estudio de Uso de Medios', category: 'A1. Demografía' },
    { value: 'estudio-influenciadores', label: 'Estudio de Influenciadores', category: 'A1. Demografía' },
    { value: 'estudio-formulas-viralizacion', label: 'Estudio de fórmulas de viralización', category: 'A1. Demografía' },
    { value: 'estudio-tendencias-graficas', label: 'Estudio de tendencias gráficas', category: 'A1. Demografía' },

    // A2. Benchmark Redes Sociales
    { value: 'subportada-a2-benchmark', label: 'Subportada A2. Benchmark Redes Sociales', category: 'Subportadas' },
    { value: 'rrsss-propias-benchmark-cuant', label: 'RRSSS Propias. Benchmark Cuantitativo', category: 'A2. Benchmark' },
    { value: 'rrsss-externas-benchmark-cuant', label: 'RRSSS Externas. Benchmark Cuantitativo', category: 'A2. Benchmark' },
    { value: 'rrsss-propias-benchmark-mensaje-posteado', label: 'RRSSS Propias. Benchmark de mensaje por contenido posteado', category: 'A2. Benchmark' },
    { value: 'rrsss-externas-benchmark-mensaje-posteado', label: 'RRSSS Externas. Benchmark de mensaje por contenido posteado', category: 'A2. Benchmark' },
    { value: 'rrsss-propias-benchmark-mensaje-difundido', label: 'RRSSS Propias. Benchmark de mensaje por contenido difundido', category: 'A2. Benchmark' },
    { value: 'rrsss-externas-benchmark-mensaje-difundido', label: 'RRSSS Externas. Benchmark de mensaje por contenido difundido', category: 'A2. Benchmark' },
    { value: 'rrsss-propias-benchmark-adjetivacion-posteado', label: 'RRSSS Propias. Benchmark adjetivación p/contenido posteado', category: 'A2. Benchmark' },
    { value: 'rrsss-externas-benchmark-adjetivacion-posteado', label: 'RRSSS Externas. Benchmark adjetivación p/contenido posteado', category: 'A2. Benchmark' },
    { value: 'rrsss-propias-benchmark-adjetivacion-difundido', label: 'RRSSS Propias. Benchmark adjetivación p/contenido difundido', category: 'A2. Benchmark' },
    { value: 'rrsss-externas-benchmark-adjetivacion-difundido', label: 'RRSSS Externas. Benchmark adjetivación p/contenido difundido', category: 'A2. Benchmark' },
    { value: 'rrsss-propias-benchmark-audiencia-posteado', label: 'RRSSS Propias. Benchmark audiencia p/contenido posteado', category: 'A2. Benchmark' },
    { value: 'rrsss-externas-benchmark-audiencia-posteado', label: 'RRSSS Externas. Benchmark audiencia p/contenido posteado', category: 'A2. Benchmark' },
    { value: 'rrsss-propias-benchmark-audiencia-difundido', label: 'RRSSS Propias. Benchmark audiencia p/contenido difundido', category: 'A2. Benchmark' },
    { value: 'rrsss-externas-benchmark-audiencia-difundido', label: 'RRSSS Externas. Benchmark audiencia p/contenido difundido', category: 'A2. Benchmark' },
    { value: 'benchmark-mensaje-integrado', label: 'Benchmark de mensaje integrado', category: 'A2. Benchmark' },
    { value: 'rrrss-propias-benchmark-difusion-oficial', label: 'RRRSS Propias. Benchmark de difusión oficial', category: 'A2. Benchmark' },
    { value: 'rrrss-propias-benchmark-difusion-alterna', label: 'RRRSS Propias. Benchmark de difusión alterna', category: 'A2. Benchmark' },

    // A3. Conversación en línea
    { value: 'subportada-a3-conversacion', label: 'Subportada A3. Conversación en línea', category: 'Subportadas' },
    { value: 'analisis-conversacion-awareness', label: 'Análisis de la Conversación -- Awareness', category: 'A3. Conversación' },
    { value: 'analisis-conversacion-top-mind', label: 'Análisis de la Conversación -- Top of Mind', category: 'A3. Conversación' },
    { value: 'analisis-conversacion-top-heart', label: 'Análisis de la Conversación -- Top of Heart', category: 'A3. Conversación' },
    { value: 'analisis-conversacion-top-choice', label: 'Análisis de la Conversación -- Top of Choice', category: 'A3. Conversación' },
    { value: 'analisis-conversacion-top-voice', label: 'Análisis de la Conversación -- Top of Voice', category: 'A3. Conversación' },
    { value: 'analisis-conversacion-cuantitativo', label: 'Análisis de la Conversación -- Cuantitativo', category: 'A3. Conversación' },
    { value: 'analisis-conversacion-cualitativo', label: 'Análisis de la Conversación -- Cualitativo', category: 'A3. Conversación' },
    { value: 'amplificadores-conversacion', label: 'Amplificadores de la Conversación', category: 'A3. Conversación' },
    { value: 'estudio-activacion-tema', label: 'Estudio de Activación por Tema', category: 'A3. Conversación' },

    // A4. Perfilado y Adjetivación
    { value: 'subportada-a4-perfilado', label: 'Subportada A4. Perfilado y Adjetivación', category: 'Subportadas' },
    { value: 'analisis-humor-social', label: 'Análisis del Humor Social', category: 'A4. Perfilado' },
    { value: 'histograma-humor-social', label: 'Histograma del Humor Social', category: 'A4. Perfilado' },
    { value: 'perfiles-arquetipos', label: 'Perfiles y Arquetipos', category: 'A4. Perfilado' },
    { value: 'estudio-identificacion-perfil', label: 'Estudio de Identificación y definición del Perfil', category: 'A4. Perfilado' },
    { value: 'identificacion-dilemas-rentables', label: 'Identificación de los dilemas rentables', category: 'A4. Perfilado' },
    { value: 'fracturas-antropologicas', label: 'Fracturas Antropológicas', category: 'A4. Perfilado' },
    { value: 'matriz-valores', label: 'Matriz de Valores', category: 'A4. Perfilado' },
    { value: 'psicografia-general-adjetivos', label: 'Psicografía/s General/es de los adjetivos', category: 'A4. Perfilado' },
    { value: 'semiosfera-general-adjetivos', label: 'Semiósfera/s General/es de los adjetivos', category: 'A4. Perfilado' },

    // A5. Micro-segmentación
    { value: 'subportada-a5-microsegmentacion', label: 'Subportada A5. Micro-segmentación', category: 'Subportadas' },
    { value: 'microsegmentos-demograficos', label: 'Identificación de microsegmentos Demográficos', category: 'A5. Microsegmentación' },
    { value: 'microsegmentos-etnograficos', label: 'Identificación de microsegmentos Etnográficos', category: 'A5. Microsegmentación' },
    { value: 'microsegmentos-fandoms', label: 'Identificación de microsegmentos Fandoms', category: 'A5. Microsegmentación' },
    { value: 'microsegmentos-partidistas', label: 'Identificación de microsegmentos Partidistas', category: 'A5. Microsegmentación' },
    { value: 'nanosegmentos-partidistas', label: 'Identificación de nanosegmentos Partidistas', category: 'A5. Microsegmentación' },
    { value: 'razones-nanosegmentos-partidistas', label: 'Id. de Razones de nanosegmentos Partidistas', category: 'A5. Microsegmentación' },
    { value: 'microsegmentos-psicograficos', label: 'Identificación de microsegmentos Psicográficos', category: 'A5. Microsegmentación' },
    { value: 'microsegmentos-psicopatograficos', label: 'Identificación de microsegmentos Psicopatográficos', category: 'A5. Microsegmentación' },
    { value: 'microsegmentos-intereses', label: 'Identificación de microsegmentos por Intereses', category: 'A5. Microsegmentación' },
    { value: 'microsegmentos-gremio', label: 'Identificación de microsegmentos por Gremio/industria', category: 'A5. Microsegmentación' },
    { value: 'microsegmentos-beneficiarios', label: 'Identificación de microsegmentos por Beneficiarios', category: 'A5. Microsegmentación' },
    { value: 'microsegmentos-sector-empleo', label: 'Identificación de microsegmentos por sector de empleo', category: 'A5. Microsegmentación' },
    { value: 'tablero-microsegmentacion-integrado', label: 'Tablero de Microsegmentación Integrado', category: 'A5. Microsegmentación' },
    { value: 'psicografia-microsegmentos', label: 'Psicografía de los Microsegmentos', category: 'A5. Microsegmentación' },
    { value: 'semiosfera-psicografia-tactica', label: 'Semiósfera de la Psicografía Táctica de los Microsegmentos', category: 'A5. Microsegmentación' },
    { value: 'estudio-rentabilidad-microsegmento', label: 'Estudio de rentabilidad por microsegmento', category: 'A5. Microsegmentación' },

    // A6. Estrategia General
    { value: 'subportada-a6-estrategia-general', label: 'Subportada A6. Estrategia General', category: 'Subportadas' },
    { value: 'estrategia-general', label: 'Estrategia General', category: 'A6. Estrategia General' },

    // 1B. Estrategia Digital
    { value: 'portada-1b-estrategia-digital', label: 'Portada 1B. Estrategia Digital', category: 'Portadas' },
    { value: 'subportada-b1-estrategia-digital', label: 'Subportada B1. Estrategia Digital', category: 'Subportadas' },
    { value: 'objetivo', label: 'Objetivo', category: 'B1. Estrategia Digital' },
    { value: 'objetivos-lineas-accion', label: 'Objetivos y líneas de acción', category: 'B1. Estrategia Digital' },
    { value: 'tablero-microsegmentacion-integrado-b1', label: 'Tablero de Microsegmentación Integrado', category: 'B1. Estrategia Digital' },
    { value: 'eppm', label: 'EPPM', category: 'B1. Estrategia Digital' },

    // Línea de Acción
    { value: 'subportada-linea-accion', label: 'Subportada Línea de Acción', category: 'Subportadas' },
    { value: 'formula', label: 'Fórmula', category: 'Línea de Acción' },
    { value: 'microsegmentacion-linea-accion', label: 'Microsegmentación de la línea de acción', category: 'Línea de Acción' },
    { value: 'microsegmentacion-especifica-linea-accion', label: 'Microsegmentación específica de la línea de acción', category: 'Línea de Acción' },
    { value: 'identidad-grafica', label: 'Identidad Gráfica', category: 'Línea de Acción' },

    // Microsegmentos
    { value: 'subportada-microsegmento-0', label: 'Subportada Microsegmento 0', category: 'Subportadas' },
    { value: 'formula-microsegmento-0', label: 'Fórmula', category: 'Microsegmentos' },
    { value: 'antropologia-digital-microcampana', label: 'Antropología digital de la microcampaña', category: 'Microsegmentos' },
    { value: 'insights-microcampana', label: 'Insights microcampaña', category: 'Microsegmentos' },
    { value: 'storyline-microcampana', label: 'Storyline microcampaña', category: 'Microsegmentos' },
    { value: 'programacion-microcampana', label: 'Programación microcampaña', category: 'Microsegmentos' },
    { value: 'subportada-microsegmento-n', label: 'Subportada Microsegmento 1, 2, 3, 4, n, ...', category: 'Subportadas' },
    { value: 'programacion-microcampana-n', label: 'Programación microcampaña', category: 'Microsegmentos' },

    // 2. Setup Gerencia Digital
    { value: 'portada-2-setup-gerencia', label: 'Portada 2. Setup Gerencia Digital', category: 'Portadas' },
    { value: 'organigrama-funciones', label: 'Organigrama, funciones, metas, contratación part.', category: '2. Setup Gerencia' },
    { value: 'sistema-gestion-desempeno', label: 'Sistema de Gestión de desempeño', category: '2. Setup Gerencia' },
    { value: 'procesos-areas-externas', label: 'Procesos con áreas externas', category: '2. Setup Gerencia' },
    { value: 'elaboracion-presupuesto', label: 'Elaboración de presupuesto y flujo', category: '2. Setup Gerencia' },
    { value: 'diseno-minuta', label: 'Diseño de minuta', category: '2. Setup Gerencia' },
    { value: 'diseno-playbook', label: 'Diseño de playbook', category: '2. Setup Gerencia' },
    { value: 'formato-parrilla', label: 'Formato de parrilla', category: '2. Setup Gerencia' },
    { value: 'formato-sistema-reportes', label: 'Formato de sistema de reportes', category: '2. Setup Gerencia' },
    { value: 'instalacion-mesas', label: 'Instalación de mesas, cuartos y torres', category: '2. Setup Gerencia' },

    // 3. Setup Programa Acompañamiento
    { value: 'portada-3-setup-acompanamiento', label: 'Portada 3. Setup Programa Acompañamiento', category: 'Portadas' },
    { value: 'proceso-estratega-digital', label: 'Diseño de proceso de Estratega Digital en sitio (coyuntura)', category: '3. Setup Acompañamiento' },
    { value: 'proceso-acompanamiento-diario', label: 'Diseño de proceso de acompañamiento (reporte diario)', category: '3. Setup Acompañamiento' },
    { value: 'proceso-acompanamiento-playbook', label: 'Diseño de proceso de acompañamiento (Playbook)', category: '3. Setup Acompañamiento' },
    { value: 'proceso-comunicacion-instantanea', label: 'Diseño de proceso de comunicación instantánea', category: '3. Setup Acompañamiento' },
    { value: 'proceso-levantamiento-imagen', label: 'Diseño de proceso de levantamiento de imagen', category: '3. Setup Acompañamiento' },
    { value: 'proceso-levantamiento-campanas', label: 'Diseño de proceso de levantamiento de campañas concurrentes', category: '3. Setup Acompañamiento' },

    // 5. Setup Producción
    { value: 'portada-5-setup-produccion', label: 'Portada 5. Setup Producción', category: 'Portadas' },
    { value: 'subportada-identidad-grafica', label: 'Subportada Identidad gráfica', category: 'Subportadas' },
    { value: 'estudio-colorimetria-general', label: 'Estudio de Colorimetría 1a. General', category: '5. Setup Producción' },
    { value: 'estudio-colorimetria-partidos', label: 'Estudio de Colorimetría 1b. Partidos', category: '5. Setup Producción' },
    { value: 'estudio-colorimetria-candidatos', label: 'Estudio de Colorimetría 1c. Benchmark Candidatos', category: '5. Setup Producción' },
    { value: 'estudio-tendencias-graficas-locales', label: 'Estudio de Tendencias Gráficas 2a. Locales', category: '5. Setup Producción' },
    { value: 'estudio-tendencias-graficas-globales', label: 'Estudio de Tendencias Gráficas 2b. Globales', category: '5. Setup Producción' },
    { value: 'referencias-interno', label: 'Referencias (perfil, adjetivo, colorimetría) ***Solo interno', category: '5. Setup Producción' },
    { value: 'proceso-id-grafica-interno', label: 'Proceso Id. Gráfica Línea de Acción 1 ***Solo interno', category: '5. Setup Producción' },
    { value: 'identidad-grafica-completa', label: 'Identidad gráfica Logo, tipografía, paleta, aplicaciones, etc', category: '5. Setup Producción' },

    // Parrilla de Contenidos
    { value: 'subportada-parrilla-contenidos', label: 'Subportada Parrilla de Contenidos Inicial', category: 'Subportadas' },
    { value: 'programacion-parrilla', label: 'Programación', category: 'Parrilla de Contenidos' },
    { value: 'microcampana-1-contenidos', label: 'Microcampaña 1 Contenidos 1-4', category: 'Parrilla de Contenidos' },
    { value: 'microcampana-2-contenidos', label: 'Microcampaña 2 Contenidos 1-4', category: 'Parrilla de Contenidos' },
    { value: 'microcampana-n-contenidos', label: 'Microcampaña n... Contenidos 1-4', category: 'Parrilla de Contenidos' },

    // Siguientes pasos y cierre
    { value: 'portada-siguientes-pasos', label: 'Portada Siguientes pasos', category: 'Portadas' },
    { value: 'siguientes-pasos', label: 'Siguientes pasos', category: 'Cierre' },
    { value: 'portada-siguientes-pasos-2', label: 'Portada Siguientes pasos', category: 'Portadas' },
    { value: 'siguientes-pasos-2', label: 'Siguientes pasos', category: 'Cierre' },
    { value: 'contraportada', label: 'Contraportada', category: 'Cierre' }
];

// Obtener todas las categorías únicas
export const getCategories = (): string[] => {
    const categories = new Set(reportBuilderOptions.map(opt => opt.category).filter(Boolean));
    return Array.from(categories) as string[];
};

// Obtener opciones por categoría
export const getOptionsByCategory = (category: string): ReportOption[] => {
    return reportBuilderOptions.filter(opt => opt.category === category);
};

// Obtener una opción por su value
export const getOptionByValue = (value: string): ReportOption | undefined => {
    return reportBuilderOptions.find(opt => opt.value === value);
};
