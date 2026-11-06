# Sistema visual — MAPEX-ADHEFAR Hub

Interfaz editorial clara: cabecera y pie blancos, navegación activa en turquesa,
jerarquía sans-serif y tarjetas con bordes y sombras discretos. Se comparte entre
Inicio, Modelo, Herramientas, Implantación, Casos, Glosario, Pacientes y Acerca de.

## Identidad y procedencia

La paleta se inspira en la orientación facilitada para el rediseño. No se presenta
como normativa corporativa SEFH. La consulta a https://www.sefh.es/ el 6 de noviembre
de 2026 fue bloqueada por la política de red (403); no se pudo contrastar un manual
oficial. No se aportaron capturas institucionales ni recursos de marca autorizados.
No se incorporan logotipos ni se atribuye aval institucional. Se conservan los
créditos y avisos de autorización existentes.

| Uso | Token | Color |
| --- | --- | --- |
| Acción principal, enlaces, foco | `--c-marca` / `--c-foco` | `#08787C` |
| Hover principal | `--c-marca-hover` | `#06666A` |
| Detalle turquesa decorativo | `--c-marca-vivo` | `#00AFA9` |
| Superficie turquesa clara | `--c-marca-claro` | `#EDF8F7` |
| Acento magenta | `--c-acento` | `#A60076` |
| Texto principal | `--c-texto` | `#173D4B` |
| Texto secundario | `--c-texto-secundario` | `#46616D` |
| Fondo / superficie | `--c-fondo` / `--c-superficie` | `#F6F9FA` / `#FFFFFF` |
| Borde decorativo / control | `--c-borde` / `--c-control-borde` | `#DCE7E9` / `#738C96` |

El turquesa y el magenta para texto/acciones se oscurecen respecto a la propuesta
inicial para mantener contraste AA. El turquesa vivo queda como detalle decorativo.

## Semántica clínica

Se mantienen los tokens CMO documentados en el glosario: Capacidad azul `#2563EB`,
Motivación ámbar `#D97706`, Oportunidad verde `#059669`. No se reasignan a magenta:
el color ya comunica un pilar en contenidos, clasificadores y casos. Los estados
verde/ámbar/rojo conservan su interpretación. En badges y textos de resultados se
usan variantes oscuras de la misma familia para mejorar legibilidad; barras,
bordes, valores, puntos de corte y lógica permanecen intactos.

## Tipografía y componentes

Inter (400, 500, 600), con alternativas locales `system-ui`, `-apple-system`,
`sans-serif`. Se reutiliza la integración existente de Google Fonts, sin nuevas
dependencias de aplicación. Cuerpo base de 18 px. Espaciado principal de 8 px,
con 4 px para ajustes ópticos. Radios de 8–16 px; sombras contenidas. Iconos SVG
locales de trazo homogéneo en las tarjetas de portada.

Los tokens están en `css/tokens.css`; base, layout y componentes en sus hojas
compartidas. Header/footer se editan en `js/nav.js`. Los estilos específicos siguen
en cada HTML. No se modifica la arquitectura ni la versión histórica `legacy/`.

## Accesibilidad y mantenimiento

Foco visible, objetivos principales de 44 px, menú móvil con teclado y Escape,
tablas desplazables accesibles por teclado y movimiento reducido. El encabezado
sticky tiene espacio de anclaje; la búsqueda del glosario respeta su altura.
La visualización móvil se apila sin ocultar contenidos. La lógica clínica y los
scripts embebidos no se modifican. No almacenar datos de pruebas en perfiles reales.

Validación realizada con Chromium: ocho rutas en 375/768/1024/1440 px, auditoría
axe-core WCAG A/AA de páginas iniciales y resultados representativos, pruebas
funcionales de navegación, PDC/MPR, clasificador, checklist, plantillas,
autoevaluación, exportación/importación y persistencia. Las auditorías automáticas
no sustituyen una evaluación manual completa con lectores de pantalla.
