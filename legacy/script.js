(function () {
  'use strict';

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

  const state = {
    cmo: null,
    tools: null,
    maturity: null
  };

  function showResult(element, html, tone) {
    element.className = 'result-box show';
    if (tone) element.classList.add(tone);
    element.innerHTML = html;
  }

  function initMenu() {
    const toggle = $('.nav-toggle');
    const menu = $('#main-menu');
    if (!toggle || !menu) return;

    toggle.addEventListener('click', () => {
      const isOpen = menu.classList.toggle('open');
      toggle.classList.toggle('active', isOpen);
      toggle.setAttribute('aria-expanded', String(isOpen));
      document.body.classList.toggle('menu-open', isOpen);
    });

    $$('#main-menu a').forEach((link) => {
      link.addEventListener('click', () => {
        menu.classList.remove('open');
        toggle.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('menu-open');
      });
    });
  }

  function initSmoothScroll() {
    $$('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', (event) => {
        const target = $(anchor.getAttribute('href'));
        if (!target) return;
        event.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  function initReveal() {
    const elements = $$('.reveal');
    if (!('IntersectionObserver' in window)) {
      elements.forEach((element) => element.classList.add('visible'));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    elements.forEach((element) => observer.observe(element));
  }

  function initCmoEngine() {
    const form = $('#cmo-form');
    const result = $('#cmo-result');
    if (!form || !result) return;

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const groups = ['capacidad', 'motivacion', 'oportunidad'];
      const counts = Object.fromEntries(groups.map((group) => [group, $$(`input[name="${group}"]:checked`, form).length]));
      const total = Object.values(counts).reduce((sum, value) => sum + value, 0);

      if (!total) {
        state.cmo = null;
        showResult(result, '<strong>Selecciona al menos una barrera</strong> para calcular el perfil CMO.', 'warning');
        return;
      }

      const max = Math.max(...Object.values(counts));
      const dominant = groups.filter((group) => counts[group] === max);
      const profile = dominant.map(capitalize).join(' + ');
      const priority = total >= 9 || max >= 4 ? 'Alta' : total >= 5 ? 'Media' : 'Inicial';
      const followUp = counts.oportunidad >= 3 ? 'dual con componente telemático' : counts.motivacion >= 3 ? 'presencial o dual para entrevista motivacional' : 'presencial con refuerzo telemático si procede';
      const recommendations = [];

      if (counts.capacidad) recommendations.push('Adaptar educación, revisar complejidad terapéutica y anticipar manejo de eventos adversos.');
      if (counts.motivacion) recommendations.push('Explorar creencias, necesidad percibida y objetivos farmacoterapéuticos significativos.');
      if (counts.oportunidad) recommendations.push('Revisar acceso, apoyo disponible, recordatorios, dispensación y necesidad de telefarmacia.');

      state.cmo = { profile, priority, followUp, recommendations };
      showResult(result, `
        <strong>Perfil dominante:</strong> ${profile}<br>
        <strong>Nivel de prioridad:</strong> ${priority}<br>
        <strong>Seguimiento sugerido:</strong> ${followUp}<br>
        <strong>Recomendaciones iniciales:</strong>
        <ul>${recommendations.map((item) => `<li>${item}</li>`).join('')}</ul>
      `, priority === 'Alta' ? 'danger' : '');
    });
  }

  function initToolsSelector() {
    const form = $('#tools-form');
    const result = $('#tools-result');
    if (!form || !result) return;

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!form.checkValidity()) {
        showResult(result, '<strong>Completa todos los campos</strong> para obtener una recomendación.', 'warning');
        return;
      }

      const data = Object.fromEntries(new FormData(form).entries());
      const tools = new Set(['Entrevista estructurada', 'Registro de dispensación']);
      if (data.tratamiento === 'oral') tools.add('PDC/MPR');
      if (data.tratamiento === 'inyectable') tools.add('Registro de administración o dispensación');
      if (data.tratamiento === 'mixto') tools.add('Combinación por vía y calendario terapéutico');
      if (data.recursos !== 'basicos') tools.add('Cuestionario validado');
      if (data.recursos === 'avanzados' || data.contexto !== 'presencial') tools.add('App o recordatorio digital');
      if (data.necesidad === 'evaluacion') tools.add('Comparación pre-post intervención con indicador objetivo');
      if (data.contexto === 'dual') tools.add('Combinación recomendada: entrevista + registro + soporte digital');

      const combo = data.necesidad === 'cribado'
        ? 'Cribado pragmático: entrevista estructurada y registro de dispensación.'
        : data.necesidad === 'seguimiento'
          ? 'Seguimiento longitudinal: registro de dispensación, PDC/MPR si aplica y revisión CMO.'
          : 'Evaluación: indicador objetivo, cuestionario validado y revisión de objetivos alcanzados.';

      state.tools = { tools: Array.from(tools), combo };
      showResult(result, `
        <strong>Herramientas sugeridas:</strong>
        <ul>${Array.from(tools).map((tool) => `<li>${tool}</li>`).join('')}</ul>
        <strong>Combinación recomendada:</strong> ${combo}
      `);
    });
  }

  function initMaturity() {
    const form = $('#maturity-form');
    const result = $('#maturity-result');
    if (!form || !result) return;

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const score = $$('input[type="checkbox"]:checked', form).length;
      let level = 'Nivel básico';
      let tone = 'warning';
      if (score >= 7) { level = 'Nivel excelente/QPEX'; tone = ''; }
      else if (score >= 5) { level = 'Nivel avanzado'; tone = ''; }
      else if (score >= 3) { level = 'Nivel intermedio'; tone = ''; }

      const roadmap = [
        '30 días: seleccionar indicadores mínimos, definir circuito de medición y registrar intervenciones clave.',
        '60 días: incorporar CMO, herramientas validadas y criterios de seguimiento presencial, telemático o dual.',
        '90 días: revisar resultados, PROMs/PREMs, aprendizaje del servicio y ciclo de mejora continua.'
      ];
      state.maturity = { score, level, roadmap };
      showResult(result, `
        <strong>${level}</strong> · puntuación ${score}/8<br>
        <strong>Hoja de ruta 30-60-90 días:</strong>
        <ul>${roadmap.map((step) => `<li>${step}</li>`).join('')}</ul>
      `, tone);
    });
  }

  function initInterventionFilters() {
    const buttons = $$('.filter-btn');
    const cards = $$('.intervention-card');
    buttons.forEach((button) => {
      button.addEventListener('click', () => {
        const filter = button.dataset.filter;
        buttons.forEach((item) => item.classList.remove('active'));
        button.classList.add('active');
        cards.forEach((card) => {
          card.classList.toggle('hidden', filter !== 'all' && card.dataset.category !== filter);
        });
      });
    });
  }

  function initReport() {
    const form = $('#report-form');
    const output = $('#report-output');
    const message = $('#report-message');
    const copyButton = $('#copy-report');
    if (!form || !output || !message || !copyButton) return;

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!form.checkValidity()) {
        showResult(message, '<strong>Completa todos los campos</strong> antes de generar el informe.', 'warning');
        return;
      }
      const data = Object.fromEntries(new FormData(form).entries());
      output.value = [
        'Resumen ADHEFAR360 de adherencia (sin datos identificativos)',
        `Perfil de barreras: ${data.perfil}.`,
        `Herramienta recomendada: ${data.herramienta}.`,
        `Intervención sugerida: ${data.intervencion}.`,
        `Seguimiento propuesto: ${data.seguimiento}.`,
        `Indicador de evaluación: ${data.indicador}.`,
        'Nota: informe orientativo de apoyo profesional; no sustituye el juicio clínico.'
      ].join('\n');
      showResult(message, 'Informe generado correctamente. Revisa el texto antes de copiarlo o utilizarlo.', '');
    });

    copyButton.addEventListener('click', async () => {
      if (!output.value.trim()) {
        showResult(message, '<strong>No hay informe generado</strong>. Genera primero el resumen.', 'warning');
        return;
      }
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(output.value);
        } else {
          output.select();
          document.execCommand('copy');
        }
        showResult(message, 'Informe copiado al portapapeles.', '');
      } catch (error) {
        showResult(message, 'No se pudo copiar automáticamente. Selecciona el texto y cópialo manualmente.', 'warning');
      }
    });
  }

  function capitalize(value) {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }

  document.addEventListener('DOMContentLoaded', () => {
    initMenu();
    initSmoothScroll();
    initReveal();
    initCmoEngine();
    initToolsSelector();
    initMaturity();
    initInterventionFilters();
    initReport();
  });
})();
