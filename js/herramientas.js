/* herramientas.js — Lógica de las 7 herramientas de consulta */
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
