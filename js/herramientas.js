/* herramientas.js — Lógica de las 8 herramientas de consulta */
'use strict';

/* ─────────────────────────────────────────
   UTILIDADES COMUNES
───────────────────────────────────────── */
function fmtPct(n) { return (n * 100).toFixed(1) + ' %'; }
function fmtFecha(d) { return d.toLocaleDateString('es-ES'); }
function parseFecha(s) {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
}
function diffDias(a, b) {
  return Math.round((b - a) / 86400000);
}
function exportarTexto(texto, nombre) {
  const blob = new Blob([texto], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = nombre; a.click();
  URL.revokeObjectURL(url);
}
function exportarJSON(obj, nombre) {
  const blob = new Blob([JSON.stringify(obj, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = nombre; a.click();
  URL.revokeObjectURL(url);
}
function mostrarResultado(el, html, tipo) {
  el.innerHTML = html;
  el.className = 'result-box visible' + (tipo ? ' ' + tipo : '');
}

/* ─────────────────────────────────────────
   A. CALCULADORA PDC / MPR
───────────────────────────────────────── */
(function inicioPDC() {
  const form = document.getElementById('form-pdc');
  if (!form) return;

  let dispensaciones = [];
  const lista = document.getElementById('pdc-lista-disp');
  const resultado = document.getElementById('pdc-resultado');
  const umbralEl = document.getElementById('pdc-umbral');

  function renderLista() {
    lista.innerHTML = '';
    if (!dispensaciones.length) {
      lista.innerHTML = '<p style="font-size:var(--fs-sm);color:var(--c-texto-secundario)">Sin dispensaciones añadidas.</p>';
      return;
    }
    const ul = document.createElement('ul');
    ul.style.cssText = 'list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:8px';
    dispensaciones.forEach((d, i) => {
      const li = document.createElement('li');
      li.style.cssText = 'display:flex;justify-content:space-between;align-items:center;padding:8px 12px;background:var(--c-fondo);border-radius:var(--radius);font-size:var(--fs-sm);border:1px solid var(--c-borde-claro)';
      li.innerHTML = `<span>📅 ${d.fecha} &nbsp;·&nbsp; ${d.dias} días</span>
        <button type="button" data-i="${i}" class="btn btn-ghost btn-sm" aria-label="Eliminar dispensación ${i+1}" style="padding:2px 8px;font-size:12px">✕</button>`;
      li.querySelector('button').addEventListener('click', () => {
        dispensaciones.splice(i, 1); renderLista();
      });
      ul.appendChild(li);
    });
    lista.appendChild(ul);
  }

  document.getElementById('pdc-btn-add').addEventListener('click', () => {
    const fecha = document.getElementById('pdc-disp-fecha').value;
    const dias = parseInt(document.getElementById('pdc-disp-dias').value, 10);
    if (!fecha || !dias || dias < 1) {
      alert('Introduce una fecha y un número de días válido.'); return;
    }
    dispensaciones.push({ fecha, dias });
    dispensaciones.sort((a, b) => a.fecha.localeCompare(b.fecha));
    document.getElementById('pdc-disp-fecha').value = '';
    document.getElementById('pdc-disp-dias').value = '';
    renderLista();
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    const inicio = document.getElementById('pdc-inicio').value;
    const fin = document.getElementById('pdc-fin').value;
    const umbral = parseFloat(umbralEl.value) / 100;

    if (!inicio || !fin) { alert('Introduce las fechas de inicio y fin del período.'); return; }
    if (!dispensaciones.length) { alert('Añade al menos una dispensación.'); return; }

    const dInicio = parseFecha(inicio);
    const dFin = parseFecha(fin);
    const totalDias = diffDias(dInicio, dFin);
    if (totalDias <= 0) { alert('La fecha de fin debe ser posterior a la de inicio.'); return; }

    // PDC: días cubiertos en el período (sin solapar, sin exceder el período)
    const bitmap = new Uint8Array(totalDias);
    dispensaciones.forEach(d => {
      const dD = parseFecha(d.fecha);
      const offset = diffDias(dInicio, dD);
      for (let j = 0; j < d.dias; j++) {
        const idx = offset + j;
        if (idx >= 0 && idx < totalDias) bitmap[idx] = 1;
      }
    });
    const diasCubiertos = bitmap.reduce((s, v) => s + v, 0);
    const PDC = diasCubiertos / totalDias;

    // MPR: suma de días dispensados (puede superar 100%)
    const diasDisp = dispensaciones.reduce((s, d) => s + d.dias, 0);
    const MPR = Math.min(diasDisp / totalDias, 1); // se muestra el real, pero se indica si >100%

    const superaUmbral = PDC >= umbral;
    const clase = superaUmbral ? 'ok' : 'alerta';
    const umbralPct = (umbral * 100).toFixed(0) + ' %';

    mostrarResultado(resultado, `
      <div style="display:grid;gap:16px">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
          <div style="background:${superaUmbral ? 'var(--c-ok-claro)' : 'var(--c-parcial-claro)'};border-radius:var(--radius-card);padding:20px;text-align:center">
            <div style="font-size:2rem;font-weight:600;font-family:var(--ff-display);color:${superaUmbral ? 'var(--c-oportunidad-texto)' : 'var(--c-motivacion-texto)'}">${fmtPct(PDC)}</div>
            <div style="font-size:0.778rem;font-weight:600;text-transform:uppercase;letter-spacing:.07em;color:var(--c-texto-secundario);margin-top:4px">PDC</div>
            <div style="font-size:0.778rem;color:var(--c-texto-secundario);margin-top:4px">${diasCubiertos} días cubiertos / ${totalDias} días</div>
          </div>
          <div style="background:var(--c-capacidad-claro);border-radius:var(--radius-card);padding:20px;text-align:center">
            <div style="font-size:2rem;font-weight:600;font-family:var(--ff-display);color:var(--c-capacidad-texto)">${fmtPct(MPR)}</div>
            <div style="font-size:0.778rem;font-weight:600;text-transform:uppercase;letter-spacing:.07em;color:var(--c-texto-secundario);margin-top:4px">MPR</div>
            <div style="font-size:0.778rem;color:var(--c-texto-secundario);margin-top:4px">${diasDisp} días dispensados / ${totalDias} días</div>
          </div>
        </div>
        <div style="font-size:0.889rem;padding:12px;background:${superaUmbral ? 'var(--c-ok-claro)' : 'var(--c-parcial-claro)'};border-radius:var(--radius);border-left:4px solid ${superaUmbral ? 'var(--c-ok)' : 'var(--c-parcial)'}">
          <strong>Interpretación (umbral ${umbralPct}):</strong> ${superaUmbral
            ? `<span style="color:var(--c-oportunidad-texto)">Adherencia óptima. PDC ≥ ${umbralPct}.</span>`
            : `<span style="color:var(--c-motivacion-texto)">Adherencia insuficiente. PDC &lt; ${umbralPct}. Se recomienda identificar barreras CMO e intervenir.</span>`}
        </div>
        <div style="font-size:0.778rem;color:var(--c-texto-secundario)">
          Período: ${fmtFecha(dInicio)} → ${fmtFecha(dFin)} (${totalDias} días). Umbral configurado: ${umbralPct}.
        </div>
      </div>`, clase);

    // Guardar para exportar
    form._resultado = { PDC: fmtPct(PDC), MPR: fmtPct(MPR), diasCubiertos, totalDias, diasDisp, umbralPct, adherenciaOptima: superaUmbral };
  });

  document.getElementById('pdc-exportar').addEventListener('click', () => {
    if (!form._resultado) { alert('Calcula primero el resultado.'); return; }
    const r = form._resultado;
    const txt = `CALCULADORA PDC/MPR — MAPEX-ADHEFAR Hub\n${'='.repeat(42)}\nPDC: ${r.PDC} (${r.diasCubiertos} días cubiertos / ${r.totalDias} días)\nMPR: ${r.MPR} (${r.diasDisp} días dispensados / ${r.totalDias} días)\nUmbral: ${r.umbralPct}\nResultado: ${r.adherenciaOptima ? 'Adherencia óptima' : 'Adherencia insuficiente'}\n\nNOTA: No incluye datos identificativos de pacientes.\nGenerado por MAPEX-ADHEFAR Hub — ${new Date().toLocaleString('es-ES')}`;
    exportarTexto(txt, 'pdc-mpr.txt');
  });

  document.getElementById('pdc-limpiar').addEventListener('click', () => {
    dispensaciones = []; renderLista();
    resultado.className = 'result-box';
    form.reset();
  });

  renderLista();
})();

/* ─────────────────────────────────────────
   B. CHECKLIST VISITA INICIAL
───────────────────────────────────────── */
(function inicioChecklistA() {
  const cont = document.getElementById('checklist-a');
  if (!cont) return;

  const checks = cont.querySelectorAll('input[type="checkbox"]');
  const progEl = document.getElementById('cha-progreso');
  const pctEl = document.getElementById('cha-pct');

  function actualizar() {
    const total = checks.length;
    const marcados = Array.from(checks).filter(c => c.checked).length;
    const pct = total ? Math.round(marcados / total * 100) : 0;
    if (progEl) progEl.style.width = pct + '%';
    if (pctEl) pctEl.textContent = marcados + ' / ' + total + ' (' + pct + ' %)';
  }

  checks.forEach(c => { c.addEventListener('change', actualizar); });
  actualizar();

  document.getElementById('cha-exportar')?.addEventListener('click', () => {
    const secciones = cont.querySelectorAll('fieldset');
    let txt = 'CHECKLIST VISITA INICIAL — MAPEX-ADHEFAR Hub\n' + '='.repeat(44) + '\n';
    secciones.forEach(fs => {
      const leg = fs.querySelector('legend');
      if (leg) txt += '\n' + leg.textContent.toUpperCase() + '\n' + '-'.repeat(leg.textContent.length + 4) + '\n';
      fs.querySelectorAll('input[type="checkbox"]').forEach(c => {
        txt += (c.checked ? '[x]' : '[ ]') + ' ' + c.closest('label').textContent.trim() + '\n';
      });
    });
    txt += '\nGenerado: ' + new Date().toLocaleString('es-ES') + '\nNota: No incluye datos identificativos de pacientes.';
    exportarTexto(txt, 'checklist-visita-inicial.txt');
  });

  document.getElementById('cha-limpiar')?.addEventListener('click', () => {
    checks.forEach(c => { c.checked = false; }); actualizar();
  });
})();

/* ─────────────────────────────────────────
   C. CHECKLIST VISITA SUCESIVA
───────────────────────────────────────── */
(function inicioChecklistB() {
  const cont = document.getElementById('checklist-b');
  if (!cont) return;

  const checks = cont.querySelectorAll('input[type="checkbox"]');
  const progEl = document.getElementById('chb-progreso');
  const pctEl = document.getElementById('chb-pct');

  // Árbol de decisión
  const oft = document.getElementById('oft-cumplidos');
  const causa = document.getElementById('causa-evitable');
  const arbolRes = document.getElementById('arbol-resultado');

  function evalArbol() {
    if (!arbolRes) return;
    const oftVal = oft?.value;
    const causaVal = causa?.value;
    if (!oftVal) { arbolRes.className = 'result-box'; arbolRes.innerHTML = ''; return; }
    if (oftVal === 'si') {
      mostrarResultado(arbolRes, '<strong style="color:var(--c-oportunidad-texto)">✓ OFT alcanzados.</strong> Consolidar la intervención actual. Valorar paso a Prioridad 3 en la próxima reestratificación.', 'ok');
      causa.closest('.form-group').style.display = 'none';
    } else {
      causa.closest('.form-group').style.display = '';
      if (!causaVal) { arbolRes.className = 'result-box'; arbolRes.innerHTML = ''; return; }
      if (causaVal === 'cmo') {
        mostrarResultado(arbolRes, '<strong>OFT no alcanzados — causa evitable CMO.</strong> Identificar la barrera predominante (C/M/O) e intervenir de forma personalizada. Revisar el objetivo pactado. Considerar reestratificación si concurren los tres criterios.', 'alerta');
      } else {
        mostrarResultado(arbolRes, '<strong>OFT no alcanzados — causa clínica.</strong> Activar coordinación multidisciplinar: comunicar al prescriptor, valorar ajuste de tratamiento. Documentar en historia clínica. Reevaluar adherencia tras el ajuste.', 'alerta');
      }
    }
  }

  function actualizar() {
    const total = checks.length;
    const marcados = Array.from(checks).filter(c => c.checked).length;
    const pct = total ? Math.round(marcados / total * 100) : 0;
    if (progEl) progEl.style.width = pct + '%';
    if (pctEl) pctEl.textContent = marcados + ' / ' + total + ' (' + pct + ' %)';
  }

  checks.forEach(c => c.addEventListener('change', actualizar));
  oft?.addEventListener('change', evalArbol);
  causa?.addEventListener('change', evalArbol);
  actualizar();

  // Criterios de reestratificación
  const criteriosInputs = cont.querySelectorAll('.criterio-restrat');
  const reestratRes = document.getElementById('reestrat-resultado');
  function evalReestrat() {
    if (!reestratRes) return;
    const todos = Array.from(criteriosInputs).every(c => c.checked);
    if (todos) {
      mostrarResultado(reestratRes, '<strong>Reestratificación indicada.</strong> Concurren los tres criterios: incumplimiento sostenido de OFT + adherencia insuficiente validada + PROMs/PREMs alterados. Reclasificar a Prioridad 1 y planificar intervención intensiva.', 'alerta');
    } else if (Array.from(criteriosInputs).some(c => c.checked)) {
      mostrarResultado(reestratRes, 'Se cumple al menos un criterio, pero no los tres. Continuar seguimiento reforzado. Revaluar en la próxima visita.', '');
    } else {
      reestratRes.className = 'result-box'; reestratRes.innerHTML = '';
    }
  }
  criteriosInputs.forEach(c => c.addEventListener('change', evalReestrat));

  document.getElementById('chb-exportar')?.addEventListener('click', () => {
    const secciones = cont.querySelectorAll('fieldset');
    let txt = 'CHECKLIST VISITA SUCESIVA — MAPEX-ADHEFAR Hub\n' + '='.repeat(46) + '\n';
    secciones.forEach(fs => {
      const leg = fs.querySelector('legend');
      if (leg) txt += '\n' + leg.textContent.toUpperCase() + '\n' + '-'.repeat(30) + '\n';
      fs.querySelectorAll('input[type="checkbox"]').forEach(c => {
        txt += (c.checked ? '[x]' : '[ ]') + ' ' + c.closest('label').textContent.trim() + '\n';
      });
    });
    const oftV = oft?.value;
    const causaV = causa?.value;
    if (oftV) {
      txt += '\nÁRBOL DE DECISIÓN OFT\n' + '-'.repeat(24) + '\n';
      txt += 'OFT cumplidos: ' + (oftV === 'si' ? 'Sí' : 'No') + '\n';
      if (oftV === 'no' && causaV) txt += 'Causa: ' + (causaV === 'cmo' ? 'Evitable CMO' : 'Clínica') + '\n';
    }
    txt += '\nGenerado: ' + new Date().toLocaleString('es-ES') + '\nNota: No incluye datos identificativos de pacientes.';
    exportarTexto(txt, 'checklist-visita-sucesiva.txt');
  });

  document.getElementById('chb-limpiar')?.addEventListener('click', () => {
    checks.forEach(c => { c.checked = false; });
    criteriosInputs.forEach(c => { c.checked = false; });
    if (oft) oft.value = '';
    if (causa) causa.value = '';
    if (causa) causa.closest('.form-group').style.display = 'none';
    if (reestratRes) { reestratRes.className = 'result-box'; reestratRes.innerHTML = ''; }
    if (arbolRes) { arbolRes.className = 'result-box'; arbolRes.innerHTML = ''; }
    actualizar();
  });

  if (causa) causa.closest('.form-group').style.display = 'none';
})();

/* ─────────────────────────────────────────
   D. GUION ADHEFAR-EM 10 MINUTOS + TEMPORIZADOR
───────────────────────────────────────── */
(function inicioGuion() {
  const cont = document.getElementById('guion-em');
  if (!cont) return;

  const btnModo = document.getElementById('guion-modo-consulta');
  const btnSalir = document.getElementById('guion-salir-modo');
  const body = document.body;

  btnModo?.addEventListener('click', () => {
    body.classList.add('modo-consulta');
    document.documentElement.style.setProperty('--fs-base', '22px');
  });
  btnSalir?.addEventListener('click', () => {
    body.classList.remove('modo-consulta');
    document.documentElement.style.removeProperty('--fs-base');
    clearInterval(window._timerInterval);
    resetTimer();
  });

  // Temporizador
  const btnTimer = document.getElementById('timer-start');
  const btnReset = document.getElementById('timer-reset');
  const timerDisplay = document.getElementById('timer-display');
  let timerSec = 0, timerRun = false;

  function resetTimer() {
    timerRun = false;
    timerSec = 0;
    if (timerDisplay) timerDisplay.textContent = '0:00';
    if (btnTimer) btnTimer.textContent = 'Iniciar';
    clearInterval(window._timerInterval);
  }

  function tickTimer() {
    timerSec++;
    const m = Math.floor(timerSec / 60);
    const s = timerSec % 60;
    if (timerDisplay) timerDisplay.textContent = m + ':' + String(s).padStart(2, '0');
    // Iluminar bloque activo
    document.querySelectorAll('.guion-bloque').forEach(b => {
      const from = parseInt(b.dataset.from, 10) * 60;
      const to = parseInt(b.dataset.to, 10) * 60;
      b.classList.toggle('bloque-activo', timerSec >= from && timerSec < to);
    });
    if (timerSec >= 600) { clearInterval(window._timerInterval); timerRun = false; if (btnTimer) btnTimer.textContent = 'Iniciar'; }
  }

  btnTimer?.addEventListener('click', () => {
    if (timerRun) {
      clearInterval(window._timerInterval); timerRun = false; btnTimer.textContent = 'Reanudar';
    } else {
      timerRun = true; btnTimer.textContent = 'Pausar';
      window._timerInterval = setInterval(tickTimer, 1000);
    }
  });
  btnReset?.addEventListener('click', resetTimer);
})();

/* ─────────────────────────────────────────
   E. CLASIFICADOR CMO
───────────────────────────────────────── */
(function inicioClasificador() {
  const form = document.getElementById('form-cmo');
  if (!form) return;

  const resultado = document.getElementById('cmo-clasificador-resultado');

  const preguntas = [
    // capacidad
    { id: 'cmo-q1', pilar: 'C', texto: 'El paciente tiene dificultades para recordar las tomas o para organizar su medicación.' },
    { id: 'cmo-q2', pilar: 'C', texto: 'Existen barreras físicas o cognitivas para la administración (destreza, visión, comprensión).' },
    { id: 'cmo-q3', pilar: 'C', texto: 'El régimen terapéutico es complejo (múltiples fármacos, distintos horarios, formas especiales).' },
    { id: 'cmo-q4', pilar: 'C', texto: 'El paciente refiere o muestra eventos adversos que le dificultan o desalientan la toma.' },
    // motivacion
    { id: 'cmo-q5', pilar: 'M', texto: 'El paciente expresa dudas, miedos o creencias negativas sobre su medicación o su enfermedad.' },
    { id: 'cmo-q6', pilar: 'M', texto: 'El paciente no percibe la necesidad del tratamiento ("me encuentro bien", "para qué sirve").' },
    { id: 'cmo-q7', pilar: 'M', texto: 'El paciente muestra ambivalencia, resistencia o baja disposición al cambio.' },
    { id: 'cmo-q8', pilar: 'M', texto: 'Hay discrepancia entre lo que el paciente dice y los datos objetivos de adherencia.' },
    // oportunidad
    { id: 'cmo-q9',  pilar: 'O', texto: 'El paciente tiene dificultades de acceso al centro, a la dispensación o al transporte.' },
    { id: 'cmo-q10', pilar: 'O', texto: 'El entorno familiar o social no apoya o interfiere en la toma correcta del tratamiento.' },
    { id: 'cmo-q11', pilar: 'O', texto: 'El paciente carece de recordatorios, rutinas o estructura de toma en su vida diaria.' },
    { id: 'cmo-q12', pilar: 'O', texto: 'Existen barreras logísticas o tecnológicas para el seguimiento telemático.' },
  ];

  form.addEventListener('submit', e => {
    e.preventDefault();
    const C = preguntas.filter(p => p.pilar === 'C' && document.getElementById(p.id)?.checked).length;
    const M = preguntas.filter(p => p.pilar === 'M' && document.getElementById(p.id)?.checked).length;
    const O = preguntas.filter(p => p.pilar === 'O' && document.getElementById(p.id)?.checked).length;
    const total = C + M + O;

    if (!total) {
      mostrarResultado(resultado, 'Marca al menos una barrera observada para clasificar.', ''); return;
    }

    const maxPilar = Math.max(C, M, O);
    const predominante = [];
    if (C === maxPilar) predominante.push('Capacidad');
    if (M === maxPilar) predominante.push('Motivación');
    if (O === maxPilar) predominante.push('Oportunidad');

    const colores = { Capacidad: 'var(--c-capacidad)', Motivación: 'var(--c-motivacion)', Oportunidad: 'var(--c-oportunidad)' };
    const coloresClaros = { Capacidad: 'var(--c-capacidad-claro)', Motivación: 'var(--c-motivacion-claro)', Oportunidad: 'var(--c-oportunidad-claro)' };
    const intervenciones = {
      Capacidad: 'Educación sanitaria adaptada · Simplificación terapéutica · Revisión de complejidad · Técnicas de administración · Herramientas organizativas (SPD, pastillero)',
      Motivación: 'Entrevista motivacional · Exploración de creencias (ICE) · Objetivos farmacoterapéuticos pactados · Refuerzo positivo · Retroalimentación de datos',
      Oportunidad: 'Telefarmacia · Recordatorios adaptados (alarmas, apps, llamadas) · Coordinación con cuidadores · Optimización del circuito de dispensación · Apoyo logístico'
    };

    let html = '<div style="display:grid;gap:12px">';
    // Barras
    html += '<div style="display:grid;gap:8px">';
    [['Capacidad', C, 'cap'], ['Motivación', M, 'mot'], ['Oportunidad', O, 'opp']].forEach(([nombre, n, cls]) => {
      const pct = maxPilar ? Math.round(n / maxPilar * 100) : 0;
      html += `<div>
        <div style="display:flex;justify-content:space-between;font-size:0.778rem;font-weight:600;margin-bottom:4px">
          <span style="color:${colores[nombre]}">${nombre}</span><span>${n} barrera${n !== 1 ? 's' : ''}</span>
        </div>
        <div style="height:10px;background:var(--c-borde-claro);border-radius:var(--radius-pill);overflow:hidden">
          <div style="height:100%;width:${pct}%;background:${colores[nombre]};border-radius:var(--radius-pill);transition:width .4s ease"></div>
        </div>
      </div>`;
    });
    html += '</div>';

    // Pilar predominante
    predominante.forEach(p => {
      html += `<div style="background:${coloresClaros[p]};border-radius:var(--radius-card);padding:16px;border-left:4px solid ${colores[p]}">
        <div style="font-size:0.778rem;font-weight:600;text-transform:uppercase;letter-spacing:.07em;color:${colores[p]};margin-bottom:8px">Pilar predominante: ${p}</div>
        <div style="font-size:0.778rem;color:var(--c-texto-secundario)"><strong>Intervenciones sugeridas:</strong> ${intervenciones[p]}</div>
      </div>`;
    });

    if (total >= 6) {
      html += '<div style="background:var(--c-parcial-claro);border-radius:var(--radius);padding:12px;font-size:0.778rem;border-left:4px solid var(--c-parcial)"><strong>Múltiples barreras.</strong> Se identifican barreras en varios pilares. La intervención debe ser secuencial: comenzar por el pilar predominante y reevaluar en la siguiente visita.</div>';
    }
    html += '</div>';

    mostrarResultado(resultado, html, '');
  });

  document.getElementById('cmo-limpiar')?.addEventListener('click', () => {
    form.reset();
    resultado.className = 'result-box'; resultado.innerHTML = '';
  });
})();

/* ─────────────────────────────────────────
   F. PLANTILLAS DE REGISTRO
───────────────────────────────────────── */
(function inicioPlantillas() {
  const form = document.getElementById('form-plantilla');
  if (!form) return;
  const output = document.getElementById('plantilla-output');

  function genTexto() {
    const v = id => (document.getElementById(id)?.value || '').trim();
    const hoy = new Date().toLocaleDateString('es-ES');
    const tipo = v('plt-tipo');
    const barrera = v('plt-barrera');
    const intervencion = v('plt-intervencion');
    const objetivo = v('plt-objetivo');
    const teachback = v('plt-teachback');
    const multidisc = v('plt-multidisc');
    const prox = v('plt-prox');
    const indicador = v('plt-indicador');
    const notas = v('plt-notas');

    let txt = `REGISTRO DE INTERVENCIÓN FARMACÉUTICA — ADHERENCIA\n`;
    txt += `${'═'.repeat(50)}\n`;
    txt += `Fecha: ${hoy}  |  Tipo de visita: ${tipo || '—'}\n\n`;
    txt += `SEÑAL DE ALERTA / MOTIVO DE INTERVENCIÓN\n${'-'.repeat(40)}\n${barrera || '—'}\n\n`;
    txt += `BARRERA PREDOMINANTE CMO\n${'-'.repeat(40)}\n${intervencion || '—'}\n\n`;
    txt += `INTERVENCIÓN REALIZADA\n${'-'.repeat(40)}\n${v('plt-inter-desc') || '—'}\n\n`;
    txt += `OBJETIVO FARMACOTERAPÉUTICO PACTADO\n${'-'.repeat(40)}\n${objetivo || '—'}\n\n`;
    txt += `TEACH-BACK — COMPRENSIÓN CONFIRMADA\n${'-'.repeat(40)}\n${teachback || '—'}\n\n`;
    txt += `COORDINACIÓN MULTIDISCIPLINAR\n${'-'.repeat(40)}\n${multidisc || 'No precisa'}\n\n`;
    txt += `PLAN DE SEGUIMIENTO\n${'-'.repeat(40)}\n`;
    txt += `Próxima visita/contacto: ${prox || '—'}\n`;
    txt += `Indicador de evaluación: ${indicador || '—'}\n\n`;
    if (notas) txt += `NOTAS ADICIONALES\n${'-'.repeat(40)}\n${notas}\n\n`;
    txt += `${'─'.repeat(50)}\nRegistro generado por MAPEX-ADHEFAR Hub — ${new Date().toLocaleString('es-ES')}\nNOTA: No incluye datos identificativos de pacientes.`;
    return txt;
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    const txt = genTexto();
    if (output) { output.value = txt; output.style.display = 'block'; }
  });

  document.getElementById('plt-copiar')?.addEventListener('click', () => {
    const txt = genTexto();
    navigator.clipboard?.writeText(txt).then(() => alert('Texto copiado al portapapeles.')).catch(() => {
      if (output) { output.value = txt; output.select(); document.execCommand('copy'); alert('Texto copiado.'); }
    });
  });

  document.getElementById('plt-exportar')?.addEventListener('click', () => {
    exportarTexto(genTexto(), 'registro-intervencion-adherencia.txt');
  });

  document.getElementById('plt-limpiar')?.addEventListener('click', () => {
    form.reset();
    if (output) { output.value = ''; output.style.display = 'none'; }
  });
})();

/* ─────────────────────────────────────────
   NAVEGACIÓN LATERAL (sticky sidebar)
───────────────────────────────────────── */
(function inicioNavHerramientas() {
  const selector = document.getElementById('herramienta-selector');
  if (!selector) return;
  selector.addEventListener('change', function() {
    if (this.value) {
      const el = document.getElementById(this.value);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
})();

/* ─────────────────────────────────────────
   H. ADHeCuaR
───────────────────────────────────────── */
const ADHECUAR_CAUSES = [
  { group: 'Causas involuntarias', label: 'Olvido.', intervention: 'Simplificación de la pauta, revisión del plan farmacoterapéutico, uso de pastilleros o sistemas personalizados de dosificación, alarmas o aplicaciones de recordatorio e implicación de un cuidador si procede.' },
  { group: 'Causas involuntarias', label: 'Dificultad con la pauta.', intervention: 'Simplificación de la pauta, revisión del plan farmacoterapéutico, uso de pastilleros o sistemas personalizados de dosificación, alarmas o aplicaciones de recordatorio e implicación de un cuidador si procede.' },
  { group: 'Causas involuntarias', label: 'Otras causas involuntarias.', intervention: 'Simplificación de la pauta, revisión del plan farmacoterapéutico, uso de pastilleros o sistemas personalizados de dosificación, alarmas o aplicaciones de recordatorio e implicación de un cuidador si procede.' },
  { group: 'Causas intencionales', label: 'Intolerancia o efectos adversos.', intervention: 'Mejora de la comunicación profesional sanitario-paciente, intervención educacional, intervención afectiva, entrevista motivacional e intervención cognitivo-conductual adaptada a las barreras identificadas.' },
  { group: 'Causas intencionales', label: 'Pérdida de confianza en el tratamiento.', intervention: 'Mejora de la comunicación profesional sanitario-paciente, intervención educacional, intervención afectiva, entrevista motivacional e intervención cognitivo-conductual adaptada a las barreras identificadas.' },
  { group: 'Causas intencionales', label: 'Otras causas intencionales.', intervention: 'Mejora de la comunicación profesional sanitario-paciente, intervención educacional, intervención afectiva, entrevista motivacional e intervención cognitivo-conductual adaptada a las barreras identificadas.' },
  { group: 'Causas no identificadas', label: 'No se identifican causas concretas en la entrevista.', intervention: 'Combinación de intervenciones y reevaluación longitudinal de la adherencia en próximas visitas.' }
];

function pctAdhecuar(n) { return Number(n).toLocaleString('es-ES', { minimumFractionDigits: 1, maximumFractionDigits: 1 }); }
function isoHoy() { return new Date().toISOString().slice(0, 10); }
function valNum(id) { const v = document.getElementById(id)?.value; return v === '' ? NaN : Number(v); }

function classifyAdherence(adherencePercentage) {
  return adherencePercentage < 90 ? 'subóptima' : 'adecuada';
}

function validateAdhecuarInputs(inputs, mode) {
  const errors = [];
  const required = mode === 'continuous'
    ? ['previousDate', 'currentDate', 'dailyDose', 'available', 'remaining', 'eva']
    : ['onDays', 'dailyDose', 'available', 'remaining', 'eva'];
  required.forEach(k => {
    if (inputs[k] === '' || inputs[k] === null || Number.isNaN(inputs[k])) errors.push('Complete todos los campos obligatorios antes de calcular.');
  });
  ['dailyDose', 'available', 'remaining', 'eva', 'onDays'].forEach(k => {
    if (inputs[k] !== undefined && !Number.isNaN(inputs[k]) && inputs[k] < 0) errors.push('No se permiten valores negativos.');
  });
  if (!Number.isNaN(inputs.eva) && (inputs.eva < 0 || inputs.eva > 100)) errors.push('La adherencia reportada por EVA debe estar entre 0 y 100 %.');
  if (!Number.isNaN(inputs.remaining) && !Number.isNaN(inputs.available) && inputs.remaining > inputs.available) errors.push('Los comprimidos remanentes no pueden ser superiores a la medicación disponible.');
  if (!Number.isNaN(inputs.dailyDose) && inputs.dailyDose <= 0) errors.push('El número de comprimidos al día debe ser mayor que cero para evitar división por cero.');

  if (mode === 'continuous') {
    const prev = inputs.previousDate ? parseFecha(inputs.previousDate) : null;
    const current = inputs.currentDate ? parseFecha(inputs.currentDate) : null;
    const today = parseFecha(isoHoy());
    if (prev && prev > today) errors.push('La fecha de dispensación previa no puede ser futura.');
    if (current && current > today) errors.push('La fecha actual no puede ser futura.');
    if (prev && current && current < prev) errors.push('La fecha actual no puede ser anterior a la fecha de dispensación previa.');
    if (prev && current && diffDias(prev, current) <= 0) errors.push('El período debe incluir al menos un día desde la dispensación previa.');
  } else if (!Number.isNaN(inputs.onDays) && inputs.onDays <= 0) {
    errors.push('Los días ON del ciclo deben ser mayores que cero para evitar división por cero.');
  }
  return [...new Set(errors)];
}

function calculateContinuousAdherence(inputs) {
  const days = diffDias(parseFecha(inputs.previousDate), parseFecha(inputs.currentDate));
  const taken = inputs.available - inputs.remaining;
  const expected = days * inputs.dailyDose;
  const adherence = taken / expected * 100;
  return { ...inputs, mode: 'continuous', days, taken, expected, adherence, classification: classifyAdherence(adherence) };
}

function calculateOnOffAdherence(inputs) {
  const taken = inputs.available - inputs.remaining;
  const expected = inputs.onDays * inputs.dailyDose;
  const adherence = taken / expected * 100;
  return { ...inputs, mode: 'onoff', taken, expected, adherence, classification: classifyAdherence(adherence) };
}

function selectedAdhecuarCauses() {
  return Array.from(document.querySelectorAll('#adh-causes-list input[type="checkbox"]:checked')).map(i => ADHECUAR_CAUSES[Number(i.value)]);
}

function generateAdhecuarReport(result, selectedCauses, mode) {
  if (!result) return '';
  const period = mode === 'continuous'
    ? `Período estudiado: desde ${fmtFecha(parseFecha(result.previousDate))} hasta ${fmtFecha(parseFecha(result.currentDate))}.`
    : `Período/ciclo evaluado: ${result.onDays} días ON.`;
  let txt = `Evaluación de adherencia terapéutica.\n\n${period}\n\n`;
  txt += `Adherencia por método objetivo mediante dispensación y contaje: ${pctAdhecuar(result.adherence)}%.\n`;
  txt += `Adherencia reportada por el paciente mediante EVA: ${pctAdhecuar(result.eva)}%.\n\n`;
  if (result.classification === 'adecuada') {
    txt += 'El paciente presenta una adherencia adecuada según el cálculo realizado. Se refuerza positivamente la conducta adherente y se recomienda mantener seguimiento periódico según práctica habitual.';
  } else {
    const causes = selectedCauses.length ? selectedCauses : [{ label: 'No se registran causas seleccionadas.', intervention: 'Explorar barreras e individualizar intervenciones según entrevista clínica.' }];
    txt += 'Paciente con adherencia subóptima. La adherencia es un proceso multidimensional y se exploran posibles causas durante la consulta farmacéutica.\n\n';
    txt += 'Causas identificadas:\n' + causes.map(c => `- ${c.label}`).join('\n') + '\n\n';
    txt += 'Intervenciones farmacéuticas propuestas:\n' + [...new Set(causes.map(c => c.intervention))].map(i => `- ${i}`).join('\n') + '\n\n';
    txt += 'Se recomienda reevaluar la adherencia en próximas visitas y adaptar las intervenciones según evolución clínica, farmacoterapéutica y necesidades del paciente.';
  }
  return txt;
}

function copyReportToClipboard() {
  const report = document.getElementById('adh-report');
  const txt = report?.value || '';
  if (!txt) { alert('Genere primero un informe.'); return; }
  navigator.clipboard?.writeText(txt).then(() => alert('Informe copiado para HCE.')).catch(() => {
    report.select(); document.execCommand('copy'); alert('Informe copiado para HCE.');
  });
}

(function inicioAdhecuar() {
  const form = document.getElementById('form-adhecuar');
  if (!form) return;
  const currentDate = document.getElementById('adh-current-date');
  const errorsEl = document.getElementById('adh-errors');
  const resultsEl = document.getElementById('adh-results');
  const causesEl = document.getElementById('adh-causes');
  const causesList = document.getElementById('adh-causes-list');
  const reportEl = document.getElementById('adh-report');
  let lastResult = null;

  if (currentDate && !currentDate.value) currentDate.value = isoHoy();
  errorsEl.style.display = 'none';

  function mode() { return form.querySelector('input[name="adhecuar-mode"]:checked')?.value || 'continuous'; }
  function inputs() {
    return mode() === 'continuous'
      ? { previousDate: document.getElementById('adh-prev-date').value, currentDate: document.getElementById('adh-current-date').value, dailyDose: valNum('adh-daily-dose'), available: valNum('adh-available'), remaining: valNum('adh-remaining'), eva: valNum('adh-eva') }
      : { onDays: valNum('adh-on-days'), dailyDose: valNum('adh-on-daily-dose'), available: valNum('adh-on-available'), remaining: valNum('adh-on-remaining'), eva: valNum('adh-on-eva') };
  }
  function renderCauses() {
    let html = '', group = '';
    ADHECUAR_CAUSES.forEach((c, i) => {
      if (c.group !== group) { group = c.group; html += `<h4 style="margin-top:var(--sp-4)">${group}</h4>`; }
      html += `<label><input type="checkbox" value="${i}"><span>${c.label}<span class="adhecuar-intervencion"><strong>Intervención sugerida:</strong> ${c.intervention}</span></span></label>`;
    });
    causesList.innerHTML = html;
    causesList.addEventListener('change', updateReport);
  }
  function updateReport() {
    reportEl.value = generateAdhecuarReport(lastResult, selectedAdhecuarCauses(), mode());
  }
  function renderResult(result) {
    const diff = result.adherence - result.eva;
    const sub = result.classification === 'subóptima';
    const warn = result.adherence > 110 ? '<div class="notice notice-warning" style="margin-top:var(--sp-4)"><div class="notice-icon">⚠️</div><div>La adherencia calculada es superior al 110%. Revise los datos introducidos, posible acumulación, error de contaje o discrepancia entre dispensación y consumo real.</div></div>' : '';
    const interp = sub
      ? 'Existe adherencia subóptima. Se recomienda explorar barreras, creencias, tolerabilidad, comprensión de la pauta y posibles dificultades prácticas.'
      : 'Adherencia adecuada según el umbral establecido. Reforzar positivamente y mantener seguimiento periódico.';
    mostrarResultado(resultsEl, `<div style="display:grid;gap:10px"><strong>Adherencia objetiva calculada: ${pctAdhecuar(result.adherence)}%</strong><span>Comprimidos tomados: ${pctAdhecuar(result.taken).replace(',0','')} · Comprimidos esperados: ${pctAdhecuar(result.expected).replace(',0','')}</span><span>Adherencia reportada por el paciente: ${pctAdhecuar(result.eva)}%</span><span>Diferencia objetiva - reportada: ${pctAdhecuar(diff)} puntos porcentuales</span><span>Clasificación: <strong>adherencia ${result.classification}</strong></span><p style="margin:0">${interp}</p>${warn}</div>`, sub ? 'alerta' : 'ok');
    causesEl.classList.toggle('visible', sub);
    updateReport();
  }

  renderCauses();
  form.querySelectorAll('input[name="adhecuar-mode"]').forEach(r => r.addEventListener('change', () => {
    document.getElementById('adhecuar-continuous').classList.toggle('active', mode() === 'continuous');
    document.getElementById('adhecuar-onoff').classList.toggle('active', mode() === 'onoff');
    lastResult = null; resultsEl.className = 'result-box'; resultsEl.innerHTML = ''; causesEl.classList.remove('visible'); reportEl.value = '';
  }));
  form.addEventListener('submit', e => {
    e.preventDefault();
    const currentMode = mode();
    const data = inputs();
    const errors = validateAdhecuarInputs(data, currentMode);
    if (errors.length) {
      errorsEl.style.display = 'block';
      errorsEl.innerHTML = '<strong>No se puede calcular todavía:</strong><ul>' + errors.map(e => `<li>${e}</li>`).join('') + '</ul>';
      resultsEl.className = 'result-box'; resultsEl.innerHTML = ''; causesEl.classList.remove('visible'); reportEl.value = ''; lastResult = null;
      return;
    }
    errorsEl.style.display = 'none';
    lastResult = currentMode === 'continuous' ? calculateContinuousAdherence(data) : calculateOnOffAdherence(data);
    renderResult(lastResult);
  });
  document.getElementById('adh-copy')?.addEventListener('click', copyReportToClipboard);
  document.getElementById('adh-clear')?.addEventListener('click', () => {
    form.reset(); if (currentDate) currentDate.value = isoHoy(); lastResult = null; errorsEl.style.display = 'none'; resultsEl.className = 'result-box'; resultsEl.innerHTML = ''; causesEl.classList.remove('visible'); reportEl.value = ''; causesList.querySelectorAll('input').forEach(c => { c.checked = false; });
  });
})();
