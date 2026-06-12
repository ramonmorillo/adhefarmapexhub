# Sistema de diseño — MAPEX-ADHEFAR Hub

## Concepto

El color no es decoración: es el sistema semántico de la guía. Los tres pilares CMO tienen un color propio que se aplica de forma consistente en toda la web — en las herramientas, los checklists, el clasificador de barreras, el cuadro de mando y los casos prácticos. Ver el color es ver el pilar.

## Paleta

| Token | Nombre | Hex | Uso |
|---|---|---|---|
| `--c-capacidad` | Cobalto | `#2563EB` | Pilar Capacidad, barreras C, intervenciones C |
| `--c-motivacion` | Ámbar | `#D97706` | Pilar Motivación, barreras M, intervenciones M |
| `--c-oportunidad` | Esmeralda | `#059669` | Pilar Oportunidad, barreras O, intervenciones O |
| `--c-institucional` | Pizarra profunda | `#1E3A5F` | Marca global, cabecera, SEFH/MAPEX/ADHEFAR |
| `--c-acento` | Violeta | `#6D28D9` | Q-PEX, decálogo, acciones primarias |
| `--c-fondo` | Nieve | `#F8FAFC` | Fondos principales |
| `--c-superficie` | Blanco roto | `#FFFFFF` | Tarjetas, formularios |
| `--c-texto` | Pizarra | `#1E293B` | Texto principal |
| `--c-texto-secundario` | Gris medio | `#475569` | Texto secundario, etiquetas |
| `--c-borde` | Gris claro | `#CBD5E1` | Bordes, separadores |

Variantes claras de cada pilar (para fondos de tarjetas):
- `--c-capacidad-claro`: `#EFF6FF`
- `--c-motivacion-claro`: `#FFFBEB`
- `--c-oportunidad-claro`: `#ECFDF5`
- `--c-acento-claro`: `#EDE9FE`

Semáforo de autoevaluación:
- `--c-ok`: `#059669` (verde)
- `--c-parcial`: `#D97706` (ámbar)
- `--c-no`: `#DC2626` (rojo)

## Tipografía

| Rol | Familia | Pesos usados | Origen |
|---|---|---|---|
| Titulares (display) | Source Serif 4 | 400, 600 | Google Fonts |
| Cuerpo y UI | Inter | 400, 500, 600 | Google Fonts |

- **Tamaño base:** 18 px (cuerpo de contenido)
- **Escala:** 14 → 16 → 18 → 22 → 28 → 36 → 48 px (tokens `--fs-*`)
- **Interlineado:** 1.6 en cuerpo, 1.2 en titulares

## Espaciado

Sistema de 4 px base (tokens `--sp-1` a `--sp-16`): 4, 8, 12, 16, 24, 32, 40, 48, 64, 80, 96, 112, 128 px.

## Radios y sombras

- Tarjetas: `--radius-card`: 12px
- Botones: `--radius-btn`: 8px
- Badges: `--radius-badge`: 999px
- Sombra suave: `0 1px 3px rgba(0,0,0,.08), 0 4px 16px rgba(0,0,0,.06)`

## Accesibilidad

- Contraste mínimo 4.5:1 en texto normal (WCAG 2.1 AA)
- Cobalto `#2563EB` sobre blanco: 5.9:1 ✓
- Ámbar `#D97706` sobre blanco: 3.0:1 — solo para iconos/bordes; el texto en tarjetas ámbar usa `#92400E` (8.0:1) ✓
- Esmeralda `#059669` sobre blanco: 3.9:1 — solo para iconos; texto en tarjetas verdes usa `#065F46` (8.7:1) ✓
- Foco de teclado: `outline: 3px solid var(--c-acento); outline-offset: 2px`
- `prefers-reduced-motion`: sin animaciones de transición cuando está activo

## Notas de mantenimiento

- El header/footer comunes están en `js/nav.js` (función `inyectarNav()`).
- Para editar la navegación, editar solo `js/nav.js`.
- Los tokens CSS están en `css/tokens.css`; no hardcodear colores en otros ficheros.
