/* nav.js — Header y footer comunes. Editar SOLO aquí para cambiar la navegación. */

(function () {
  'use strict';

  const PAGES = [
    { href: 'index.html',        label: 'Inicio' },
    { href: 'modelo.html',       label: 'El modelo' },
    { href: 'herramientas.html', label: 'Herramientas' },
    { href: 'implantacion.html', label: 'Implantación' },
    { href: 'casos.html',        label: 'Casos prácticos' },
    { href: 'glosario.html',     label: 'Glosario' },
    { href: 'pacientes.html',    label: 'Pacientes' },
    { href: 'acerca.html',       label: 'Acerca de' },
  ];

  function currentPage() {
    const path = window.location.pathname;
    const file = path.split('/').pop() || 'index.html';
    return file === '' ? 'index.html' : file;
  }

  function buildHeader() {
    const cur = currentPage();
    const navItems = PAGES.map(p => {
      const isCurrent = cur === p.href;
      return `<li><a href="${p.href}"${isCurrent ? ' aria-current="page"' : ''}>${p.label}</a></li>`;
    }).join('');

    return `
<a class="skip-link" href="#contenido-principal">Saltar al contenido principal</a>
<header class="site-header">
  <nav class="navbar" aria-label="Navegación principal">
    <a class="nav-brand" href="index.html" aria-label="MAPEX-ADHEFAR Hub — Inicio">
      <div class="nav-logo">
        <span class="nav-logo-title">MAPEX-ADHEFAR <span style="color:rgba(255,255,255,.45);font-weight:400">Hub</span></span>
        <span class="nav-logo-sub">Guía 2026 · Apoyo profesional</span>
      </div>
    </a>
    <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="nav-menu" aria-label="Abrir menú de navegación">
      <span></span><span></span><span></span>
    </button>
    <ul class="nav-menu" id="nav-menu" role="list">
      ${navItems}
    </ul>
  </nav>
</header>`;
  }

  function buildFooter() {
    return `
<footer class="site-footer">
  <div class="container">
    <div class="footer-grid">
      <div class="footer-brand footer-brand-wide">
        <a class="footer-logo" href="index.html">MAPEX-ADHEFAR Hub</a>
        <p>Herramienta digital de apoyo profesional basada en la Guía MAPEX-ADHEFAR para la medición, monitorización y mejora de la adherencia en consultas externas de Farmacia Hospitalaria.</p>
        <p class="footer-privacy-notice">No se han detectado cookies, analítica ni comunicaciones a servidor. El cuadro de mando de implantación puede guardar configuración local del servicio en el navegador.</p>
      </div>
      <div class="footer-col">
        <h4>Para profesionales</h4>
        <ul>
          <li><a href="modelo.html">El modelo CMO</a></li>
          <li><a href="herramientas.html">Herramientas de consulta</a></li>
          <li><a href="implantacion.html">Implantación y calidad</a></li>
          <li><a href="casos.html">Casos prácticos</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>Recursos</h4>
        <ul>
          <li><a href="glosario.html">Glosario</a></li>
          <li><a href="pacientes.html">Para pacientes</a></li>
          <li><a href="acerca.html#citar">Cómo citar la guía</a></li>
          <li><a href="https://www.sefh.es/mapex" target="_blank" rel="noopener">sefh.es/mapex ↗</a></li>
        </ul>
      </div>
      <div class="footer-col footer-legal-links">
        <h4>Información legal</h4>
        <ul>
          <li><a href="acerca.html#autoria-cesion">Autoría y cesión</a></li>
          <li><a href="acerca.html#legal">Aviso legal</a></li>
          <li><a href="acerca.html#proteccion-datos">Protección de datos</a></li>
          <li><a href="acerca.html#condiciones-uso">Condiciones de uso</a></li>
        </ul>
      </div>
    </div>

    <div class="footer-attribution" aria-label="Autoría, cesión y uso profesional">
      <p><strong>Desarrollada por Ramón Morillo Verdugo</strong> · Basada en la Guía MAPEX-ADHEFAR para la medición, monitorización y mejora de la adherencia en consultas externas de Farmacia Hospitalaria · Cedida gratuitamente a SEFH-MAPEX para uso institucional, docente y asistencial no comercial · 2026</p>
      <p>Herramienta de apoyo profesional. No sustituye el juicio clínico, la entrevista farmacoterapéutica ni los protocolos locales de cada centro.</p>
    </div>

    <div class="footer-bottom">
      <p>Uso institucional, docente, científico y asistencial no comercial. Cesión institucional pendiente de formalización documental cuando proceda.</p>
      <p>No usar logotipos de SEFH, MAPEX ni ADHEFAR salvo autorización expresa.</p>
    </div>
  </div>
</footer>`;
  }

  function inyectarNav() {
    // Insertar header al principio del body
    const headerEl = document.getElementById('site-header-placeholder');
    if (headerEl) {
      headerEl.outerHTML = buildHeader();
    } else {
      document.body.insertAdjacentHTML('afterbegin', buildHeader());
    }

    // Insertar footer al final del body
    const footerEl = document.getElementById('site-footer-placeholder');
    if (footerEl) {
      footerEl.outerHTML = buildFooter();
    } else {
      document.body.insertAdjacentHTML('beforeend', buildFooter());
    }

    // Menú responsive toggle
    const toggle = document.querySelector('.nav-toggle');
    const menu = document.getElementById('nav-menu');
    if (toggle && menu) {
      toggle.addEventListener('click', function () {
        const open = this.getAttribute('aria-expanded') === 'true';
        this.setAttribute('aria-expanded', String(!open));
        menu.classList.toggle('is-open', !open);
      });

      // Cerrar al hacer clic fuera
      document.addEventListener('click', function (e) {
        if (!toggle.contains(e.target) && !menu.contains(e.target)) {
          toggle.setAttribute('aria-expanded', 'false');
          menu.classList.remove('is-open');
        }
      });

      // Cerrar al pulsar Escape
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
          toggle.setAttribute('aria-expanded', 'false');
          menu.classList.remove('is-open');
          toggle.focus();
        }
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inyectarNav);
  } else {
    inyectarNav();
  }
})();
