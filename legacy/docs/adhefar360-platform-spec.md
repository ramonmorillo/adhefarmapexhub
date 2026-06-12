# ADHEFAR360 — Especificación conceptual, funcional, visual y técnica de alto nivel

> Plataforma digital para aterrizar en la práctica real la Guía ADHEFAR-MAPEX para la medición, monitorización y mejora de la adherencia en consultas externas de Farmacia Hospitalaria.

## 1. Visión estratégica

ADHEFAR360 se concibe como una plataforma institucional, modular e interactiva que convierte una guía clínica en un sistema operativo práctico para la consulta externa de Farmacia Hospitalaria. No es una web informativa: es un entorno de decisión, implantación, seguimiento, formación y mejora continua.

La propuesta parte de cuatro principios:

1. **De la recomendación a la acción**: cada concepto de la guía debe traducirse en una decisión, intervención, indicador, material o circuito implantable.
2. **Modelo CMO como lenguaje común**: Capacidad, Motivación y Oportunidad estructuran la valoración, las barreras, las intervenciones, los indicadores y los materiales.
3. **Utilidad dual**: debe servir tanto al farmacéutico en consulta como al servicio que necesita desplegar, medir y mejorar la estrategia.
4. **Privacidad desde el diseño**: la versión inicial debe poder funcionar sin datos identificativos, sin base de datos externa y con exportaciones controladas.

La ambición es que ADHEFAR360 evolucione hacia una plataforma nacional de referencia para implementar estrategias de adherencia desde Farmacia Hospitalaria, con capacidad de generar aprendizaje agregado, benchmarking no identificable, formación certificable y materiales adaptados a pacientes y cuidadores.

## 2. Propuesta de nombre y alternativas

### Nombre principal recomendado

**ADHEFAR360**

**Racional**: comunica visión integral, continuidad asistencial, medición, intervención, seguimiento y mejora. Es suficientemente institucional, escalable y fácil de recordar.

### Alternativas

| Nombre | Enfoque | Ventaja | Riesgo |
|---|---|---|---|
| ADHEFAR360 | Integral, institucional, escalable | Equilibrio entre marca y funcionalidad | Puede requerir explicar el “360” |
| MAPEX Adherencia Lab | Innovación y laboratorio de implantación | Muy diferencial | Menos institucional |
| ADHEFAR Navigator | Navegación de decisiones | Evoca guía práctica | Anglicismo |
| CMO Adherence Hub | Motor CMO y plataforma | Internacionalizable | Menos alineado con marca ADHEFAR |
| ADHEFAR Praxis | Aplicación práctica de la guía | Elegante y académico | Menos autoexplicativo |
| MAPEX CMO Studio | Diseño de planes e intervenciones | Muy visual | Puede sonar menos sanitario |

### Taglines posibles

- “De la guía a la práctica. De la medición a la mejora.”
- “Adherencia medida, barreras entendidas, intervenciones accionables.”
- “La plataforma para implantar ADHEFAR-MAPEX en la consulta real.”
- “Medir. Clasificar. Intervenir. Evaluar. Mejorar.”

## 3. Arquitectura completa de la plataforma

### Arquitectura funcional por capas

1. **Capa de experiencia**
   - Inicio institucional.
   - Rutas por perfil: profesional, servicio, paciente/cuidador.
   - Modo demo y modo formación.
   - Biblioteca de intervenciones y materiales.

2. **Capa de decisión clínica-operativa**
   - Motor de barreras CMO.
   - Selector de herramientas de medición.
   - Recomendador de intervenciones.
   - Generador de planes individualizados.
   - Semáforo de prioridad y radar de barreras.

3. **Capa de implantación del servicio**
   - Diagnóstico de madurez.
   - Hoja de ruta 30/60/90 días.
   - Plan de mejora.
   - Indicadores mínimos y avanzados.
   - Informe ejecutivo.

4. **Capa de datos no identificativos**
   - Casos anónimos o seudonimizados localmente.
   - Sesiones de valoración sin persistencia por defecto.
   - Exportación PDF/CSV.
   - Importación opcional de datos agregados.
   - Dashboard agregado.

5. **Capa documental**
   - Resumen para historia clínica.
   - Plan de adherencia para paciente.
   - Informe de intervención.
   - Informe de indicadores.
   - Checklist de implantación.

6. **Capa de inteligencia asistida**
   - Sugerencias explicables.
   - Redacción asistida de informes.
   - Adaptación de lenguaje para pacientes.
   - Propuesta de indicadores y planes de mejora.
   - Auditoría y revisión humana obligatoria.

### Arquitectura técnica de alto nivel

**MVP recomendado**:

- Aplicación web estática o SPA ligera en HTML/CSS/JavaScript.
- Sin autenticación real en primera versión.
- Sin servidor de datos clínicos.
- Persistencia opcional en `localStorage` o `IndexedDB`, desactivada por defecto.
- Exportación client-side a PDF/CSV.
- Datos de ejemplo integrados para modo demo.

**Versión avanzada**:

- Frontend en React, Vue o Svelte.
- Motor de reglas CMO versionado en JSON.
- Biblioteca de intervenciones en JSON/Markdown estructurado.
- Generación documental mediante plantillas.
- Dashboard con datos agregados.
- Control de roles y permisos.

**Versión institucional**:

- Backend seguro con API auditada.
- Integración opcional con sistemas corporativos.
- Módulo de autenticación federada.
- Repositorio central de conocimiento validado.
- Analítica nacional con datos agregados y gobernanza.
- Trazabilidad de versiones de reglas, contenidos e informes.

## 4. Mapa de módulos

| Módulo | Usuario principal | Resultado principal |
|---|---|---|
| Inicio institucional | Todos | Orientación por perfil y comprensión del modelo |
| Módulo profesional | Farmacéutico | Valoración estructurada y plan de intervención |
| Motor CMO | Farmacéutico | Barreras clasificadas y prioridad de actuación |
| Selector de herramientas | Farmacéutico | Herramienta de medición recomendada |
| Generador de planes | Farmacéutico | Plan individualizado exportable |
| Módulo servicio | Responsable de servicio | Diagnóstico y hoja de ruta |
| Diagnóstico de madurez | Servicio | Nivel básico/intermedio/avanzado/excelente |
| Cuadro de mando | Servicio | Indicadores agregados y mejora continua |
| Biblioteca de intervenciones | Profesional/servicio | Intervenciones filtrables y aplicables |
| Área paciente | Paciente/cuidador | Educación, preparación y materiales claros |
| Modo formación | Profesionales | Entrenamiento con casos y feedback |
| Generador documental | Todos según rol | Informes, planes y checklists |

## 5. User journeys

### 5.1 Journey del farmacéutico hospitalario

1. Entra en ADHEFAR360 y selecciona **“Valorar un caso”**.
2. Elige modo: consulta presencial, teleconsulta o atención dual.
3. Introduce datos no identificativos: perfil clínico, tipo de tratamiento, complejidad y contexto.
4. Selecciona o responde preguntas sobre barreras observadas.
5. El motor CMO clasifica barreras y muestra dimensión dominante.
6. El selector recomienda herramientas de medición de adherencia.
7. El farmacéutico introduce resultado de medición o lo simula.
8. La plataforma propone intervenciones priorizadas.
9. El farmacéutico ajusta objetivos, seguimiento e indicadores.
10. Se genera un resumen para historia clínica y un plan comprensible para el paciente.
11. Si procede, se exporta el caso de forma anonimizada para indicadores agregados.

### 5.2 Journey del servicio de Farmacia Hospitalaria

1. El responsable selecciona **“Evaluar mi servicio”**.
2. Completa un cuestionario de madurez por dominios: medición, circuitos, tecnología, indicadores, formación, telefarmacia, PROMs/PREMs y mejora continua.
3. El sistema clasifica el nivel: básico, intermedio, avanzado o excelente/QPEX.
4. Se muestran fortalezas, brechas y riesgos de implantación.
5. La plataforma genera hoja de ruta 30/60/90 días.
6. Se seleccionan indicadores mínimos y avanzados.
7. El servicio descarga un informe para dirección o comisión de calidad.
8. Con datos agregados, el dashboard permite seguimiento mensual.

### 5.3 Journey del paciente o cuidador

1. Entra en **“Área paciente”** sin login ni datos personales.
2. Selecciona una necesidad: “me olvido”, “tengo dudas”, “me cuesta organizarme”, “tengo efectos adversos”, “quiero preparar mi consulta”.
3. Recibe información en lenguaje claro y recomendaciones generales.
4. Descarga una hoja de preparación de consulta, diario de tomas u hoja de objetivos.
5. Se le anima a hablar con su equipo sanitario ante problemas, dudas o cambios.
6. Puede imprimir materiales para revisar con su farmacéutico hospitalario.

## 6. Descripción funcional por módulo

### 6.1 Inicio institucional

**Objetivo**: presentar ADHEFAR360 como plataforma de implementación de la guía y dirigir al usuario al itinerario adecuado.

**Componentes**:

- Hero institucional con mensaje principal.
- Tres tarjetas de acceso por perfil.
- Resumen visual del ciclo ADHEFAR-MAPEX.
- Bloque CMO con tres columnas.
- Métricas demo: barreras, intervenciones, indicadores, materiales.
- CTA final: “Empezar valoración”, “Evaluar servicio”, “Entrar al área paciente”.

**Mensaje principal**:

> “Convierte la adherencia en decisiones, intervenciones e indicadores desde la consulta externa de Farmacia Hospitalaria.”

**Resumen visual del modelo**:

1. Medir adherencia.
2. Identificar barreras.
3. Clasificar en CMO.
4. Intervenir de forma personalizada.
5. Monitorizar resultados.
6. Aprender y mejorar.

### 6.2 Módulo profesional

**Objetivo**: ayudar al farmacéutico a valorar un caso, seleccionar herramientas, definir intervenciones y exportar un plan.

**Flujo de trabajo**:

1. Contexto del caso.
2. Sospecha o evidencia de adherencia subóptima.
3. Identificación de barreras.
4. Clasificación CMO.
5. Selección de herramienta de medición.
6. Generación de intervención.
7. Plan de seguimiento.
8. Exportación documental.

**Campos no identificativos**:

- Grupo de edad: adolescente, adulto, mayor.
- Tipo de paciente: inicio, estable, complejo, frágil, cuidador dependiente.
- Patología agrupada: oncohematología, VIH, inmunomediadas, trasplante, neurología, otras.
- Tipo de tratamiento: oral crónico, inyectable, hospitalario domiciliario, polifarmacia, alta complejidad.
- Modalidad: presencial, telemática, dual.
- Recursos disponibles: básicos, intermedios, avanzados.

**Salida**:

- Perfil CMO dominante.
- Nivel de prioridad.
- Herramienta recomendada.
- Intervención principal y secundarias.
- Objetivo farmacoterapéutico.
- Seguimiento.
- Indicador asociado.
- Texto exportable.

### 6.3 Motor de barreras CMO

**Objetivo**: transformar barreras en una lectura accionable y priorizada.

**Dimensiones**:

#### Capacidad

Barreras relacionadas con conocimiento, comprensión, habilidades, alfabetización sanitaria, deterioro cognitivo, destreza, organización o capacidad física.

Ejemplos:

- No comprende la pauta.
- Confunde dosis u horarios.
- Dificultad para manejar dispositivos.
- Baja alfabetización sanitaria.
- Problemas de memoria.
- Dificultad para reconocer efectos adversos relevantes.

#### Motivación

Barreras relacionadas con creencias, percepción de necesidad, miedo, expectativas, experiencia previa, estado emocional o preferencia.

Ejemplos:

- Duda de la necesidad del tratamiento.
- Miedo a efectos adversos.
- Baja percepción de beneficio.
- Cansancio terapéutico.
- Rechazo por experiencias negativas.
- Prioridades vitales que desplazan el tratamiento.

#### Oportunidad

Barreras relacionadas con entorno, acceso, coordinación, apoyo social, logística, recursos económicos o sistema sanitario.

Ejemplos:

- Dificultad de desplazamiento al hospital.
- Problemas de disponibilidad o recogida.
- Falta de apoyo familiar.
- Horarios incompatibles.
- Problemas de coordinación asistencial.
- Brecha digital para telefarmacia.

**Salidas del motor**:

- Dimensión dominante.
- Barreras críticas.
- Barreras modificables.
- Semáforo de prioridad.
- Recomendaciones de intervención.
- Matriz impacto/esfuerzo.
- Sugerencia de modalidad de seguimiento.

### 6.4 Selector de herramientas de medición

**Objetivo**: recomendar una combinación razonada de métodos de medición de adherencia según contexto.

**Variables de entrada**:

- Tipo de paciente.
- Patología o área terapéutica.
- Tipo de tratamiento.
- Complejidad.
- Recursos disponibles.
- Necesidad de medición objetiva, subjetiva o combinada.
- Consulta presencial, telemática o dual.
- Existencia de dispensación hospitalaria trazable.
- Necesidad de seguimiento longitudinal.

**Tipos de herramientas contempladas**:

- Entrevista estructurada.
- Cuestionarios validados cuando proceda.
- Registro de dispensación.
- Recuento de medicación si aplica.
- Diario de tomas.
- Revisión de incidencias, retrasos o interrupciones.
- Dispositivos electrónicos o apps, si están disponibles.
- PROMs/PREMs relacionados con experiencia, carga terapéutica y resultados percibidos.

**Salida**:

- Herramienta principal.
- Herramienta complementaria.
- Justificación.
- Periodicidad.
- Interpretación.
- Umbral de acción.
- Intervención vinculada.

### 6.5 Generador de planes de intervención

**Objetivo**: convertir la valoración en un plan individualizado, breve, trazable y exportable.

**Estructura del plan**:

1. Problema detectado.
2. Barrera principal.
3. Dimensión CMO.
4. Objetivo farmacoterapéutico.
5. Intervención recomendada.
6. Material de apoyo.
7. Modalidad de seguimiento.
8. Indicador de evaluación.
9. Fecha o intervalo de reevaluación.
10. Texto para historia clínica.
11. Texto claro para paciente.

**Ejemplo de salida**:

> Se identifica adherencia subóptima probablemente relacionada con dificultad para comprender la pauta y organizar las tomas, predominando la dimensión Capacidad. Se propone intervención educativa estructurada, simplificación visual del régimen y entrega de plan de tomas. Reevaluar en 4-6 semanas mediante entrevista estructurada y revisión de dispensación. Objetivo: mejorar la toma correcta y reducir olvidos referidos.

### 6.6 Módulo servicio de farmacia

**Objetivo**: ayudar a un servicio a implantar ADHEFAR-MAPEX como programa estable.

**Dominios de evaluación**:

- Gobernanza del programa.
- Circuito de medición de adherencia.
- Herramientas utilizadas.
- Registro y documentación.
- Intervenciones disponibles.
- Formación del equipo.
- Telefarmacia y atención dual.
- Indicadores y cuadro de mando.
- Experiencia del paciente.
- PROMs/PREMs.
- Tecnología y seguridad.
- Mejora continua/QPEX.

**Salida**:

- Nivel de madurez.
- Radar de dominios.
- Brechas prioritarias.
- Hoja de ruta.
- Indicadores mínimos.
- Informe descargable.

### 6.7 Diagnóstico de madurez

| Nivel | Descripción | Señales típicas |
|---|---|---|
| Básico | Actividad no sistematizada | Intervenciones aisladas, registro variable, pocos indicadores |
| Intermedio | Circuitos iniciales | Herramientas seleccionadas, algunos registros, formación parcial |
| Avanzado | Programa estable | Indicadores periódicos, intervenciones protocolizadas, telefarmacia integrada |
| Excelente/QPEX | Mejora continua avanzada | Dashboard, PROMs/PREMs, benchmarking, innovación, revisión sistemática |

**Salida por nivel**:

- Fortalezas.
- Áreas de mejora.
- Próximos pasos.
- Indicadores mínimos.
- Recomendaciones tecnológicas.
- Recomendaciones organizativas.
- Plan 30/60/90 días.

### 6.8 Cuadro de mando

**Objetivo**: visualizar indicadores agregados y no identificables.

**Indicadores clave**:

- Pacientes evaluados.
- Porcentaje con adherencia subóptima.
- Herramientas utilizadas.
- Barreras CMO detectadas.
- Intervenciones realizadas.
- Seguimiento presencial, telemático o dual.
- Mejoría tras intervención.
- Objetivos farmacoterapéuticos alcanzados.
- PROMs/PREMs disponibles.
- Indicadores de calidad y experiencia.

**Gráficos**:

- Evolución mensual de pacientes evaluados.
- Radar CMO.
- Semáforo de indicadores.
- Barreras más frecuentes.
- Intervenciones más utilizadas.
- Antes-después de adherencia.
- Matriz impacto/esfuerzo.
- Embudo: evaluados → barreras → intervención → reevaluación → mejora.

### 6.9 Biblioteca de intervenciones ADHEFAR-MAPEX

**Objetivo**: ofrecer intervenciones filtrables, accionables y registrables.

**Filtros**:

- Capacidad, Motivación, Oportunidad.
- Tipo de barrera.
- Tipo de paciente.
- Patología.
- Recursos disponibles.
- Modalidad asistencial.
- Nivel de complejidad.
- Tiempo disponible.

**Ficha de intervención**:

- Nombre.
- Objetivo.
- Cuándo usarla.
- Cómo aplicarla.
- Tiempo estimado.
- Material necesario.
- Indicador asociado.
- Ejemplo de registro.
- Nivel de prioridad.
- Adaptación a telefarmacia.
- Material descargable asociado.

### 6.10 Área paciente

**Objetivo**: proporcionar información clara y herramientas prácticas sin sustituir el criterio clínico.

**Secciones**:

- Qué significa tomar bien la medicación.
- Cómo preparar la consulta con Farmacia Hospitalaria.
- Qué hacer si olvido una toma.
- Cómo organizar mi medicación.
- Cómo comunicar dudas o efectos adversos.
- Cómo usar recordatorios.
- Diario de tomas.
- Hoja de objetivos.
- Material para cuidadores.
- Infografías descargables.

**Microcopy clave**:

- “No cambies ni suspendas tu tratamiento sin consultar con tu equipo sanitario.”
- “Si tienes dudas, efectos adversos o dificultades para tomar la medicación, cuéntalo: puede ayudarte.”
- “Esta herramienta no sustituye la consulta con profesionales sanitarios.”

### 6.11 Modo formación

**Objetivo**: entrenar a profesionales en el uso del modelo ADHEFAR-MAPEX.

**Elementos**:

- Casos clínicos interactivos.
- Decisiones paso a paso.
- Clasificación CMO.
- Selección de herramienta.
- Selección de intervención.
- Feedback inmediato.
- Puntuación por razonamiento.
- Certificado simbólico descargable.

**Tipos de casos**:

- Inicio de tratamiento oral complejo.
- Paciente con olvidos recurrentes.
- Paciente con miedo a efectos adversos.
- Barrera logística por desplazamiento.
- Paciente frágil con cuidador.
- Telefarmacia con brecha digital.

### 6.12 Generador documental

**Objetivo**: producir documentos útiles y seguros desde los módulos.

**Documentos**:

- Informe individual de intervención.
- Resumen para historia clínica.
- Plan de adherencia para paciente.
- Informe de madurez del servicio.
- Informe de indicadores.
- Checklist de implantación.
- Informe ejecutivo para dirección.

**Principios**:

- Textos editables antes de exportar.
- Etiqueta “borrador generado, revisar por profesional”.
- Sin datos identificativos por defecto.
- Exportación PDF/CSV.
- Registro de fecha, versión de reglas y aviso de uso responsable.

## 7. Diseño conceptual de pantallas principales

### 7.1 Pantalla de inicio

**Objetivo**: orientar, inspirar y activar.

**Componentes**:

- Header con logo ADHEFAR360 y navegación.
- Hero con gradiente verde-turquesa y azul petróleo.
- Ilustración abstracta: radar CMO + circuito de decisión.
- Tres tarjetas por perfil.
- Bloque “Cómo funciona”.
- Panel CMO.
- CTA institucional.

**Interacciones**:

- Hover en tarjetas con microanimación.
- Selector de perfil.
- Acceso a modo demo.

**Microcopy**:

- “Empieza sin introducir datos identificativos.”
- “Genera planes, informes e indicadores desde una valoración estructurada.”

### 7.2 Pantalla del módulo profesional

**Objetivo**: guiar la valoración sin saturar.

**Componentes**:

- Stepper horizontal: Contexto → Barreras → Medición → Intervención → Seguimiento → Exportar.
- Panel lateral con resumen vivo.
- Formulario por bloques.
- Semáforo de adherencia.
- Radar CMO.
- Botón “Generar plan”.

**Interacciones**:

- Autoguardado local opcional.
- Chips seleccionables de barreras.
- Recomendaciones en tiempo real.
- Modo “explicar recomendación”.

### 7.3 Pantalla del módulo servicio

**Objetivo**: evaluar madurez y construir hoja de ruta.

**Componentes**:

- Cuestionario por dominios.
- Radar de madurez.
- Tarjeta de nivel alcanzado.
- Lista de brechas priorizadas.
- Roadmap 30/60/90.
- Botón “Descargar informe ejecutivo”.

**Interacciones**:

- Escalas tipo 0-4 por dominio.
- Comparador contra objetivo deseado.
- Recomendaciones dinámicas.

### 7.4 Pantalla paciente

**Objetivo**: educar y empoderar con lenguaje claro.

**Componentes**:

- Buscador de necesidad: “¿Qué te preocupa hoy?”.
- Tarjetas sencillas con iconos.
- Infografías descargables.
- Diario de tomas.
- Hoja “Preguntas para mi consulta”.

**Interacciones**:

- Modo lectura fácil.
- Tamaño de letra aumentado.
- Descarga/imprimir.
- Avisos de seguridad claros.

### 7.5 Pantalla de resultados

**Objetivo**: mostrar decisiones accionables.

**Componentes**:

- Perfil CMO dominante.
- Semáforo de prioridad.
- Herramienta recomendada.
- Plan de intervención.
- Objetivos e indicadores.
- Exportaciones.

**Interacciones**:

- Editar recomendaciones.
- Añadir comentario profesional.
- Copiar texto para historia clínica.
- Generar versión paciente.

### 7.6 Pantalla dashboard

**Objetivo**: dar visión de programa.

**Componentes**:

- KPIs superiores.
- Evolución mensual.
- Radar CMO agregado.
- Barreras top 10.
- Intervenciones top 10.
- Impacto antes-después.
- Filtros por periodo, área terapéutica y modalidad.

**Interacciones**:

- Filtrar sin mostrar datos individuales.
- Exportar CSV agregado.
- Exportar informe PDF.

### 7.7 Pantalla biblioteca

**Objetivo**: encontrar intervención adecuada en menos de un minuto.

**Componentes**:

- Barra de búsqueda.
- Filtros laterales.
- Tarjetas de intervención.
- Vista detalle.
- Botón “Añadir al plan”.

**Interacciones**:

- Ordenar por prioridad, tiempo o recursos.
- Comparar intervenciones.
- Ver adaptación a teleconsulta.

### 7.8 Pantalla informes

**Objetivo**: centralizar exportaciones.

**Componentes**:

- Selector de tipo de informe.
- Plantilla editable.
- Vista previa.
- Aviso de no incluir identificadores.
- Exportar PDF/CSV/copiar texto.

**Interacciones**:

- Campos editables.
- Validación de seguridad.
- Marca de agua “borrador profesional”.

## 8. Identidad visual

### Paleta de colores

| Uso | Color | HEX |
|---|---|---|
| Turquesa institucional | Primary | `#00A99D` |
| Verde sanitario profundo | Primary dark | `#007C70` |
| Azul petróleo | Secondary | `#123B4A` |
| Azul noche | Text strong | `#0B2530` |
| Gris claro | Surface | `#F4F7F8` |
| Gris medio | Border/text secondary | `#6B7C85` |
| Blanco | Background | `#FFFFFF` |
| Magenta discreto | Accent 1 | `#C03A7A` |
| Naranja seguridad | Accent 2 | `#F28C28` |
| Verde lima | Accent 3 | `#A6CE39` |
| Rojo alerta | Risk | `#D64545` |
| Ámbar | Warning | `#F5B942` |
| Verde éxito | Success | `#2EAD68` |

### Tipografías

- **Principal**: Inter, Source Sans 3 o IBM Plex Sans.
- **Titulares institucionales**: Manrope, Avenir Next o Montserrat.
- **Datos y dashboard**: IBM Plex Sans Condensed o Inter.
- **Paciente/lectura fácil**: Atkinson Hyperlegible como opción accesible.

### Estilo visual

- **Iconografía**: lineal, redondeada, 2 px, estilo sanitario-tecnológico; iconos para CMO, medición, intervención, seguimiento, indicadores, paciente, servicio.
- **Tarjetas**: bordes 16-24 px, sombra muy suave, borde superior coloreado por dimensión CMO.
- **Formularios**: bloques progresivos, chips seleccionables, ayudas contextuales, validación amable.
- **Botones**: primario sólido turquesa, secundario outline azul petróleo, terciario texto; estados hover/focus muy visibles.
- **Gráficos**: fondos blancos, líneas limpias, semáforos discretos, uso moderado de acentos.
- **Dashboards**: KPIs grandes, jerarquía clara, filtros persistentes, cero decoración innecesaria.
- **Responsive**: mobile-first para paciente, tablet-friendly para consulta, desktop para dashboard.
- **Accesibilidad**: contraste WCAG AA, navegación por teclado, foco visible, textos alternativos, no depender solo del color.

## 9. Propuesta de dashboard

### Estructura

1. **Cabecera**
   - Periodo analizado.
   - Área terapéutica.
   - Modalidad asistencial.
   - Nivel de datos: agregado/no identificable.

2. **KPIs principales**
   - Evaluaciones realizadas.
   - Adherencia subóptima.
   - Intervenciones activadas.
   - Reevaluaciones completadas.
   - Mejoría registrada.
   - Objetivos alcanzados.

3. **Bloque CMO**
   - Radar CMO agregado.
   - Distribución de barreras.
   - Tendencia mensual por dimensión.

4. **Bloque herramientas**
   - Herramientas utilizadas.
   - Combinación objetivo/subjetivo.
   - Uso en presencial/telemático/dual.

5. **Bloque impacto**
   - Antes-después.
   - Intervenciones con mayor mejora.
   - Pacientes reevaluados.

6. **Bloque experiencia y calidad**
   - PREMs disponibles.
   - PROMs disponibles.
   - Indicadores de continuidad.
   - Incidencias de circuito.

## 10. Motor CMO de adherencia

### Lógica de puntuación

Cada barrera seleccionada recibe:

- Dimensión CMO.
- Severidad: 1-3.
- Modificabilidad: 1-3.
- Impacto esperado en adherencia: 1-3.
- Urgencia clínica/contextual: 1-3.

**Puntuación de prioridad**:

`prioridad = severidad + impacto + urgencia + modificabilidad`

**Semáforo**:

- 4-6: prioridad baja.
- 7-9: prioridad moderada.
- 10-12: prioridad alta.

**Perfil dominante**:

- Suma de puntuaciones por dimensión.
- Dominante si supera a la segunda dimensión en al menos 20%.
- Mixto si dos dimensiones tienen diferencia menor del 20%.
- Complejo si las tres dimensiones están altas.

### Matriz de decisión

| Perfil | Primera respuesta | Seguimiento sugerido |
|---|---|---|
| Capacidad dominante | Educación, simplificación, apoyos visuales, entrenamiento | Reevaluación 4-6 semanas |
| Motivación dominante | Entrevista motivacional, toma de decisiones compartida, abordaje de creencias | Reevaluación 2-6 semanas según riesgo |
| Oportunidad dominante | Solución logística, coordinación, telefarmacia, apoyo social | Reevaluación tras cambio de circuito |
| Mixto | Intervención combinada priorizada | Seguimiento dual |
| Complejo | Plan intensivo multidisciplinar | Seguimiento estrecho |

## 11. Selector de herramientas

### Reglas de recomendación

| Contexto | Recomendación principal | Complementaria |
|---|---|---|
| Recursos básicos | Entrevista estructurada | Revisión de dispensación si existe |
| Necesidad objetiva | Dispensación/recuento/dispositivo | Entrevista para barreras |
| Telefarmacia | Entrevista estructurada remota | Diario de tomas/PROMs/PREMs |
| Alta complejidad | Método combinado | Revisión longitudinal |
| Paciente con baja alfabetización | Entrevista guiada sencilla | Material visual y confirmación de comprensión |
| Dudas motivacionales | Entrevista centrada en creencias | Registro de resultados percibidos |
| Problemas logísticos | Revisión de dispensación y retrasos | Valoración de oportunidad |

### Salida estándar

- “Herramienta recomendada: método combinado entrevista estructurada + revisión de dispensación.”
- “Justificación: permite captar barreras subjetivas y contrastar patrones objetivos.”
- “Periodicidad: basal y reevaluación en 4-8 semanas.”
- “Interpretación: resultados discordantes requieren entrevista de barreras.”
- “Intervención vinculada: educación, coordinación logística o entrevista motivacional según CMO.”

## 12. Generador de planes de intervención

### Algoritmo funcional

1. Recibe perfil del caso.
2. Identifica barrera principal.
3. Calcula dimensión CMO dominante.
4. Busca intervenciones compatibles.
5. Filtra por recursos, modalidad y complejidad.
6. Prioriza por impacto, factibilidad y urgencia.
7. Propone plan editable.
8. Genera textos para profesional, paciente e indicador.

### Ejemplo de plantilla

| Campo | Ejemplo |
|---|---|
| Problema | Olvidos frecuentes de medicación oral |
| Barrera | Dificultad para integrar tomas en rutina diaria |
| CMO | Capacidad/Oportunidad |
| Objetivo | Reducir olvidos y mejorar continuidad en 4 semanas |
| Intervención | Plan visual de tomas + recordatorio + revisión de rutina |
| Material | Hoja de planificación semanal |
| Seguimiento | Teleconsulta en 4 semanas |
| Indicador | Olvidos referidos y regularidad de dispensación |
| Texto historia | Valoración de adherencia con barreras CMO y plan acordado |

## 13. Módulo de madurez del servicio

### Dominios y puntuación

Cada dominio se puntúa 0-4:

0. No existe.
1. Existe de forma informal.
2. Existe parcialmente.
3. Está protocolizado.
4. Está medido, evaluado y mejorado.

**Dominios**:

- Estrategia y gobernanza.
- Circuito de medición.
- Herramientas y criterios.
- Registro clínico.
- Intervenciones CMO.
- Telefarmacia/atención dual.
- Formación del equipo.
- Indicadores.
- PROMs/PREMs.
- Tecnología.
- Seguridad y privacidad.
- Mejora continua/QPEX.

### Clasificación

- 0-25%: Básico.
- 26-50%: Intermedio.
- 51-75%: Avanzado.
- 76-100%: Excelente/QPEX.

### Hoja de ruta 30/60/90

**30 días**:

- Nombrar responsable.
- Definir circuito mínimo.
- Seleccionar herramientas básicas.
- Crear plantilla de registro.
- Formar al equipo nuclear.

**60 días**:

- Pilotar en un área terapéutica.
- Medir indicadores mínimos.
- Ajustar intervenciones.
- Crear materiales de paciente.
- Activar dashboard básico.

**90 días**:

- Extender a más áreas.
- Revisar resultados.
- Presentar informe a dirección.
- Incorporar PROMs/PREMs si procede.
- Formalizar ciclo de mejora continua.

## 14. Área paciente

### Principios de contenido

- Lenguaje claro.
- Frases cortas.
- Iconos y ejemplos.
- Sin culpabilizar.
- Orientado a resolver problemas reales.
- Siempre remite al equipo sanitario.

### Materiales descargables

- “Mis preguntas para la consulta”.
- “Mi plan de tomas”.
- “Diario semanal de medicación”.
- “Qué hacer si tengo dudas”.
- “Hoja para cuidadores”.
- “Cómo preparar una teleconsulta”.
- “Mis objetivos con el tratamiento”.

### Ejemplo de texto para pacientes

> Tomar la medicación puede ser difícil a veces. Si se te olvida, te preocupa un efecto adverso o no entiendes bien la pauta, no estás solo. Coméntalo con tu farmacéutico hospitalario o tu equipo sanitario para buscar una solución segura.

## 15. Modo formación

### Estructura de un caso

1. Presentación breve del caso.
2. Datos no identificativos.
3. Pregunta: ¿qué barreras sospechas?
4. Pregunta: clasifica en CMO.
5. Pregunta: selecciona herramienta de medición.
6. Pregunta: elige intervención.
7. Feedback comparado con recomendación.
8. Puntuación y aprendizaje clave.

### Métricas formativas

- Precisión de clasificación CMO.
- Adecuación de herramienta.
- Adecuación de intervención.
- Seguridad del plan.
- Calidad del seguimiento.

## 16. Informes exportables

### Informe individual de intervención

Incluye:

- Contexto no identificativo.
- Barreras.
- Perfil CMO.
- Herramientas.
- Plan.
- Seguimiento.
- Indicadores.
- Aviso de revisión profesional.

### Resumen para historia clínica

Formato breve, copiable:

- Motivo de valoración.
- Método de adherencia.
- Barreras detectadas.
- Intervención acordada.
- Plan de seguimiento.

### Plan de adherencia para paciente

Formato claro:

- Objetivo.
- Qué vamos a hacer.
- Qué puedes hacer tú.
- Cuándo pedir ayuda.
- Próximo seguimiento.

### Informe de madurez del servicio

- Nivel global.
- Radar por dominios.
- Fortalezas.
- Brechas.
- Plan 30/60/90.
- Indicadores sugeridos.

### Informe de indicadores

- Periodo.
- Datos agregados.
- Tendencias.
- Interpretación.
- Recomendaciones.

### Checklist de implantación

- Gobernanza.
- Circuito.
- Herramientas.
- Registro.
- Formación.
- Indicadores.
- Privacidad.
- Evaluación.

### Informe ejecutivo para dirección

- Problema abordado.
- Objetivos institucionales.
- Situación actual.
- Impacto esperado.
- Recursos necesarios.
- Indicadores de valor.
- Riesgos y mitigaciones.

## 17. Modelo de datos sin información identificativa

### Entidades principales

```json
{
  "caseSession": {
    "sessionId": "uuid-local",
    "createdAt": "ISO-8601",
    "mode": "demo|local|training",
    "patientProfile": {
      "ageGroup": "adolescent|adult|older",
      "patientType": "new|stable|complex|frail|caregiver-supported",
      "therapeuticArea": "grouped-category",
      "treatmentType": "oral|injectable|combined|high-complexity",
      "careModality": "in-person|remote|dual",
      "resourceLevel": "basic|intermediate|advanced"
    },
    "barriers": [
      {
        "barrierId": "capacity-understanding-regimen",
        "dimension": "capacity",
        "severity": 2,
        "impact": 3,
        "urgency": 2,
        "modifiable": 3
      }
    ],
    "measurement": {
      "recommendedTool": "structured-interview-plus-dispensing-review",
      "periodicity": "4-8 weeks",
      "resultCategory": "optimal|suboptimal|unknown"
    },
    "plan": {
      "mainInterventionId": "visual-regimen-education",
      "followUp": "remote-4-weeks",
      "indicator": "reported-missed-doses-and-dispensing-regularity"
    }
  }
}
```

### Datos prohibidos por defecto

- Nombre y apellidos.
- DNI/NIE/pasaporte.
- Número de historia clínica.
- Fecha de nacimiento exacta.
- Teléfono, email o dirección.
- Texto libre con identificadores.
- Imágenes clínicas identificables.

### Datos permitidos

- Categorías amplias.
- Códigos locales seudonimizados si el centro lo autoriza.
- Datos agregados por periodo.
- Áreas terapéuticas agrupadas.
- Resultados categóricos.

## 18. Reglas básicas del recomendador CMO

### Reglas de Capacidad

- Si hay baja comprensión de pauta → intervención educativa estructurada + teach-back.
- Si hay problemas de memoria → recordatorios, plan visual, apoyo de cuidador si procede.
- Si hay dificultad con dispositivo → entrenamiento práctico y comprobación de técnica.
- Si hay baja alfabetización → material visual, lenguaje claro y confirmación de comprensión.

### Reglas de Motivación

- Si hay baja percepción de necesidad → conversación sobre objetivos, beneficios esperados y preferencias.
- Si hay miedo a efectos adversos → educación sobre señales de alarma y manejo seguro.
- Si hay cansancio terapéutico → simplificación cuando sea posible y objetivos realistas.
- Si hay experiencias negativas → validar experiencia y acordar plan de seguimiento.

### Reglas de Oportunidad

- Si hay barrera de desplazamiento → valorar telefarmacia, dispensación coordinada o atención dual.
- Si hay problemas de horarios → adaptar circuito y canales de contacto.
- Si hay falta de apoyo → identificar cuidador, recursos comunitarios o coordinación asistencial.
- Si hay brecha digital → alternativa presencial/telefónica y material impreso.

### Reglas de seguridad

- Si existe riesgo clínico alto, toxicidad relevante o interrupción significativa → recomendar contacto profesional prioritario.
- Si el paciente expresa intención de suspender tratamiento → alertar para intervención profesional inmediata.
- Si hay datos insuficientes → mostrar incertidumbre y no sobrerrecomendar.

## 19. Checklist de protección de datos

- [ ] La plataforma no solicita identificadores directos.
- [ ] Los campos libres advierten de no introducir datos personales.
- [ ] El modo por defecto no persiste datos.
- [ ] El almacenamiento local es opcional y explicado.
- [ ] Las exportaciones incluyen aviso de revisión y uso responsable.
- [ ] Los datos agregados no permiten reidentificación.
- [ ] Se separan rutas profesional, servicio y paciente.
- [ ] Existe modo educativo/demo.
- [ ] Se informa de que no sustituye el juicio clínico.
- [ ] Se contempla RGPD y LOPDGDD.
- [ ] Hay control de versiones de reglas y contenidos.
- [ ] Se define política de retención si se activa persistencia.
- [ ] Se evita enviar datos a servicios externos sin base legal.
- [ ] Se prevén evaluación de impacto y análisis de riesgos para versiones con backend.
- [ ] Se documenta responsabilidad del centro en integraciones futuras.

## 20. IA prudente y auditable

### Usos adecuados

- Redactar borradores de informes.
- Sugerir intervenciones CMO explicables.
- Clasificar barreras a partir de selección estructurada.
- Adaptar texto para pacientes en lenguaje claro.
- Generar materiales educativos revisables.
- Proponer indicadores.
- Sugerir planes de mejora para servicios.

### Límites obligatorios

- No toma decisiones clínicas autónomas.
- No sustituye al profesional.
- No debe recibir datos identificativos.
- Debe indicar incertidumbre.
- Debe mostrar la base de la recomendación.
- Debe permitir edición humana.
- Debe registrar versión de modelo/reglas si se usa.
- Debe estar desactivable.

### Diseño de interfaz para IA

- Etiqueta: “Sugerencia asistida, revisar antes de usar”.
- Botón: “Ver por qué se sugiere”.
- Selector de tono para pacientes: estándar, lectura fácil, cuidador.
- Control de seguridad: detección de posibles identificadores antes de enviar texto.

## 21. Roadmap de desarrollo por fases

### MVP viable en 4 semanas

**Objetivo**: prototipo funcional sin backend, demostrable e institucional.

Semana 1:

- Diseño visual base.
- Arquitectura de navegación.
- Datos iniciales en JSON.
- Inicio institucional.

Semana 2:

- Módulo profesional.
- Motor CMO básico.
- Selector de herramientas.
- Generador de plan simple.

Semana 3:

- Módulo servicio.
- Diagnóstico de madurez.
- Dashboard demo con datos agregados.
- Biblioteca inicial.

Semana 4:

- Área paciente.
- Generador documental básico.
- Exportación/copiar texto.
- Revisión de accesibilidad.
- Modo demo.

**Alcance MVP**:

- HTML/CSS/JS o SPA simple.
- Sin login.
- Sin base de datos.
- Datos demo.
- Exportación básica.
- Diseño responsive.

### Versión avanzada en 3 meses

- Frontend robusto en framework moderno.
- Biblioteca ampliada de intervenciones.
- Plantillas documentales completas.
- Dashboard funcional con importación CSV agregada.
- Modo formación con 6-10 casos.
- Persistencia local opcional.
- Motor de reglas versionado.
- Pruebas de usabilidad con farmacéuticos.
- Revisión legal y de protección de datos.
- Paquete de implantación para servicios piloto.

### Versión institucional escalable en 6-12 meses

- Gobernanza clínica y editorial.
- Backend seguro opcional.
- Autenticación institucional.
- Analítica agregada multicentro.
- Integración con sistemas hospitalarios si procede.
- API para indicadores.
- Módulo de benchmarking no identificable.
- IA asistida bajo marco de seguridad.
- Certificación formativa.
- Evaluación de impacto y publicación de resultados.

## 22. Prompt posterior para Codex: primera versión HTML/CSS/JS

```text
Construye una primera versión funcional de ADHEFAR360 como aplicación web estática en HTML, CSS y JavaScript puro, sin backend y sin dependencias externas obligatorias.

Objetivo: crear un prototipo institucional, moderno, responsive y demostrable que transforme la guía ADHEFAR-MAPEX en una herramienta práctica para medición, clasificación CMO, intervención, madurez del servicio, dashboard agregado, área paciente, biblioteca e informes.

Requisitos generales:
- Crear `index.html`, `styles.css` y `app.js`.
- No solicitar ni almacenar datos identificativos de pacientes.
- Incluir aviso visible de privacidad y de que la herramienta no sustituye el juicio clínico.
- Usar paleta: turquesa `#00A99D`, verde oscuro `#007C70`, azul petróleo `#123B4A`, gris claro `#F4F7F8`, blanco `#FFFFFF`, acentos magenta `#C03A7A`, naranja `#F28C28` y lima `#A6CE39`.
- Usar tipografía system font con aspecto moderno: Inter/system-ui.
- Diseño responsive, accesible, con foco visible y contraste adecuado.

Pantallas/secciones:
1. Inicio institucional con hero, mensaje principal, tres accesos por perfil y resumen del ciclo ADHEFAR-MAPEX.
2. Módulo profesional con stepper: contexto, barreras, medición, intervención, seguimiento, exportar.
3. Motor CMO con chips de barreras de Capacidad, Motivación y Oportunidad, cálculo de perfil dominante, radar visual simple y semáforo de prioridad.
4. Selector de herramientas que recomiende herramienta principal, complementaria, periodicidad e interpretación según variables seleccionadas.
5. Generador de plan con problema, barrera, dimensión CMO, objetivo, intervención, seguimiento, indicador y texto copiable para historia clínica.
6. Módulo servicio con cuestionario de madurez 0-4 por dominios, clasificación básico/intermedio/avanzado/excelente y plan 30/60/90 días.
7. Dashboard demo con KPIs agregados, barras simples, radar CMO y semáforo.
8. Biblioteca filtrable de intervenciones con tarjetas y detalle.
9. Área paciente con lenguaje claro, materiales descargables simulados, diario de tomas y hoja de objetivos.
10. Modo formación con 3 casos interactivos y feedback.
11. Generador documental con vista previa, copiar texto y botones de exportación simulada PDF/CSV.

Interacciones:
- Navegación por pestañas o rutas hash.
- Cálculo en cliente del motor CMO.
- Recomendaciones explicables.
- Botones para copiar textos.
- Modo demo con datos precargados.
- Validación que advierta si el usuario intenta introducir identificadores en texto libre.

Entregable:
- Código limpio, comentado solo cuando aporte claridad.
- Estructura modular en JavaScript.
- Sin try/catch alrededor de imports.
- Incluir README breve con instrucciones de uso.
```

## 23. Riesgos y mitigaciones

| Riesgo | Impacto | Mitigación |
|---|---:|---|
| Convertirse en web informativa sin utilidad real | Alto | Diseñar flujos de decisión, exportables e indicadores desde el MVP |
| Sobrecargar al farmacéutico en consulta | Alto | Stepper corto, recomendaciones automáticas, resumen lateral y plantillas |
| Recomendaciones demasiado rígidas | Medio | Motor explicable, editable y basado en reglas versionadas |
| Uso indebido con datos personales | Alto | Privacy by design, avisos, bloqueo de identificadores, modo sin persistencia |
| Interpretación como sustituto del juicio clínico | Alto | Avisos, revisión profesional obligatoria, trazabilidad de recomendaciones |
| Falta de alineación institucional | Alto | Identidad visual sobria, gobernanza editorial y lenguaje SEFH/MAPEX |
| Baja adopción por servicios con pocos recursos | Medio | Recomendaciones por nivel de recursos y MVP sin infraestructura |
| Dashboard con datos no comparables | Medio | Definir diccionario de indicadores y criterios mínimos |
| Sesgo o errores de IA | Alto | IA opcional, auditada, sin datos identificativos y siempre supervisada |
| Dificultad de mantenimiento | Medio | Contenidos estructurados, motor JSON, versionado y modularidad |
| Riesgo legal en integraciones | Alto | Fasear integraciones, DPIA, acuerdos, seguridad y gobernanza |
| Material paciente poco comprensible | Medio | Lectura fácil, test con pacientes/cuidadores y revisión sanitaria |

## 24. Criterios de éxito

### En consulta

- Valorar un caso en menos de 5 minutos.
- Generar un plan en menos de 2 minutos.
- Exportar texto para historia clínica sin datos identificativos.
- Mejorar consistencia en clasificación de barreras CMO.

### En servicio

- Obtener diagnóstico de madurez en menos de 20 minutos.
- Disponer de hoja de ruta 30/60/90 días.
- Activar indicadores mínimos en un piloto.
- Presentar informe ejecutivo a dirección.

### En paciente

- Comprender qué es la adherencia sin lenguaje culpabilizador.
- Preparar mejor la consulta.
- Usar materiales prácticos.
- Saber cuándo contactar con el equipo sanitario.

## 25. Posicionamiento final

ADHEFAR360 debe presentarse como una plataforma viva de implantación, no como un repositorio. Su valor diferencial está en conectar consulta, servicio y paciente mediante un lenguaje común CMO, generar documentos útiles, medir indicadores y facilitar mejora continua. Su diseño debe ser tan sobrio como institucional y tan interactivo como una herramienta clínica moderna.

La versión inicial puede ser estática y sin datos personales, pero su arquitectura debe preparar la evolución hacia una plataforma nacional, segura, escalable y evaluable, capaz de situar a Farmacia Hospitalaria como referente internacional en estrategias de adherencia centradas en resultados, experiencia y valor.
