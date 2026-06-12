/* implantacion.js — Herramientas de implantación y calidad */
'use strict';

/* ── Utilidades ── */
function exportarTexto(txt, nombre) {
  const b = new Blob([txt], { type: 'text/plain;charset=utf-8' });
  const u = URL.createObjectURL(b);
  const a = document.createElement('a');
  a.href = u; a.download = nombre; a.click(); URL.revokeObjectURL(u);
}
function exportarJSON(obj, nombre) {
  const b = new Blob([JSON.stringify(obj, null, 2)], { type: 'application/json' });
  const u = URL.createObjectURL(b);
  const a = document.createElement('a');
  a.href = u; a.download = nombre; a.click(); URL.revokeObjectURL(u);
}

/* ══════════════════════════════════════════
   A. AUTOEVALUACIÓN DEL DECÁLOGO
══════════════════════════════════════════ */
(function() {
  const form = document.getElementById('form-decalogo');
  if (!form) return;
  const res = document.getElementById('decalogo-resultado');

  const puntos = [
    'La adherencia se mide en todas las visitas.',
    'La estratificación es obligatoria y dinámica.',
    'El farmacéutico de hospital identifica la causa real del incumplimiento.',
    'Las intervenciones son personalizadas y adaptadas.',
    'La decisión es siempre compartida con el paciente.',
    'La atención dual (presencial + telemática) es práctica habitual.',
    'Los PROMs y PREMs se recogen como indicadores clínicos obligatorios.',
    'El registro estructurado es parte de la actuación clínica.',
    'La coordinación multidisciplinar es estándar de seguimiento.',
    'El seguimiento es longitudinal y proactivo.',
  ];

  form.addEventListener('submit', e => {
    e.preventDefault();
    const vals = puntos.map((_, i) => {
      const el = form.querySelector(`[name="dec-${i+1}"]:checked`);
      return el ? el.value : null;
    });

    if (vals.some(v => !v)) {
      alert('Valora todos los puntos del decálogo antes de generar el resultado.'); return;
    }

    const si = vals.filter(v => v === 'si').length;
    const parcial = vals.filter(v => v === 'parcial').length;
    const no = vals.filter(v => v === 'no').length;
    const puntuacion = si * 2 + parcial;
    const max = 20;
    const pct = Math.round(puntuacion / max * 100);

    const nivel = pct >= 80 ? { label: 'Servicio avanzado', clase: 'ok', color: 'var(--c-ok)', bg: 'var(--c-ok-claro)' }
                : pct >= 50 ? { label: 'Servicio en desarrollo', clase: 'alerta', color: 'var(--c-parcial)', bg: 'var(--c-parcial-claro)' }
                :             { label: 'Fase inicial', clase: 'error', color: 'var(--c-no)', bg: 'var(--c-no-claro)' };

    const pendientes = vals
      .map((v, i) => ({ v, punto: puntos[i], n: i + 1 }))
      .filter(x => x.v !== 'si');

    let html = `<div style="display:grid;gap:16px">
      <div style="background:${nivel.bg};border-radius:var(--radius-card);padding:20px;display:flex;gap:16px;align-items:center;flex-wrap:wrap">
        <div style="flex:1;min-width:180px">
          <div style="font-size:0.778rem;font-weight:600;text-transform:uppercase;letter-spacing:.07em;color:${nivel.color};margin-bottom:4px">${nivel.label}</div>
          <div style="font-size:2.2rem;font-weight:600;font-family:var(--ff-display);color:${nivel.color}">${pct} %</div>
          <div style="font-size:0.778rem;color:var(--c-texto-secundario);margin-top:4px">Puntuación: ${puntuacion} / ${max} · Sí: ${si} · Parcial: ${parcial} · No: ${no}</div>
        </div>
        <div style="width:100%;height:10px;background:rgba(0,0,0,.08);border-radius:999px;overflow:hidden">
          <div style="height:100%;width:${pct}%;background:${nivel.color};border-radius:999px"></div>
        </div>
      </div>`;

    // Semáforo
    html += '<div style="display:grid;gap:8px">';
    vals.forEach((v, i) => {
      const col = v === 'si' ? 'var(--c-ok)' : v === 'parcial' ? 'var(--c-parcial)' : 'var(--c-no)';
      const etiq = v === 'si' ? 'Sí' : v === 'parcial' ? 'Parcial' : 'No';
      html += `<div style="display:flex;gap:12px;align-items:center;padding:8px 12px;background:var(--c-superficie);border-radius:var(--radius);border-left:4px solid ${col}">
        <div style="width:10px;height:10px;border-radius:50%;background:${col};flex-shrink:0"></div>
        <span style="font-size:0.778rem;flex:1;line-height:1.4"><strong>${i+1}.</strong> ${puntos[i]}</span>
        <span style="font-size:0.667rem;font-weight:600;text-transform:uppercase;letter-spacing:.06em;color:${col}">${etiq}</span>
      </div>`;
    });
    html += '</div>';

    // Hoja de ruta
    if (pendientes.length) {
      html += `<div style="background:var(--c-institucional-claro);border-radius:var(--radius-card);padding:16px;border:1.5px solid var(--c-institucional)">
        <div style="font-size:0.778rem;font-weight:600;text-transform:uppercase;letter-spacing:.07em;color:var(--c-institucional);margin-bottom:12px">Hoja de ruta de mejora (${pendientes.length} puntos)</div>
        <ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:8px">`;
      pendientes.forEach(x => {
        const prio = x.v === 'no' ? '🔴 Prioridad alta' : '🟡 Prioridad media';
        html += `<li style="font-size:0.778rem;display:flex;gap:8px;align-items:flex-start"><span style="flex-shrink:0">${prio}</span><span><strong>${x.n}.</strong> ${x.punto}</span></li>`;
      });
      html += '</ul></div>';
    }

    html += '</div>';
    res.innerHTML = html;
    res.className = 'result-box visible';
    res.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    form._datos = { puntos: vals.map((v, i) => ({ n: i+1, texto: puntos[i], valor: v })), puntuacion, pct, nivel: nivel.label };
  });

  document.getElementById('decalogo-exportar')?.addEventListener('click', () => {
    if (!form._datos) { alert('Genera primero el resultado.'); return; }
    const d = form._datos;
    let txt = `AUTOEVALUACIÓN DEL DECÁLOGO — MAPEX-ADHEFAR Hub\n${'='.repeat(48)}\nNivel: ${d.nivel} | Puntuación: ${d.puntuacion}/20 (${d.pct} %)\n\n`;
    d.puntos.forEach(p => {
      txt += `[${p.valor.toUpperCase().padEnd(7)}] ${p.n}. ${p.texto}\n`;
    });
    const pendientes = d.puntos.filter(p => p.valor !== 'si');
    if (pendientes.length) {
      txt += `\nHOJA DE RUTA DE MEJORA\n${'─'.repeat(24)}\n`;
      pendientes.forEach(p => txt += `${p.valor === 'no' ? 'PRIORIDAD ALTA' : 'PRIORIDAD MEDIA'} — ${p.n}. ${p.texto}\n`);
    }
    txt += `\nGenerado: ${new Date().toLocaleString('es-ES')}\nNota: datos del servicio, no de pacientes individuales.`;
    exportarTexto(txt, 'autoevaluacion-decalogo.txt');
  });

  document.getElementById('decalogo-limpiar')?.addEventListener('click', () => {
    form.reset();
    res.className = 'result-box'; res.innerHTML = '';
  });
})();

/* ══════════════════════════════════════════
   B. CUADRO DE MANDO CONFIGURABLE
   localStorage solo para config del servicio (no datos de pacientes)
══════════════════════════════════════════ */
(function() {
  const cont = document.getElementById('cuadro-mando');
  if (!cont) return;
  const CLAVE_LOCAL = 'mapex_cuadro_mando_v1';
  const avisoLocal = document.getElementById('cm-aviso-local');

  const INDICADORES = [
    // dimensión, nombre, tipo, estándar
    { dim: 'Proceso', nombre: 'Tasa de evaluación de adherencia en visita inicial', tipo: 'Básico', estandar: '≥80-90 %' },
    { dim: 'Proceso', nombre: 'Tasa de medición dual (objetivo + subjetivo) en todas las visitas', tipo: 'Básico', estandar: '100 %' },
    { dim: 'Proceso', nombre: 'Tasa de estratificación de pacientes', tipo: 'Básico', estandar: '100 %' },
    { dim: 'Proceso', nombre: 'Concordancia entre estratificación e intervención', tipo: 'Básico', estandar: '>80 %' },
    { dim: 'Proceso', nombre: 'Tasa de pacientes con objetivo farmacoterapéutico pactado', tipo: 'Recomendado', estandar: '' },
    { dim: 'Proceso', nombre: 'Tasa de aplicación de teach-back', tipo: 'Recomendado', estandar: '' },
    { dim: 'Proceso', nombre: 'Tasa de seguimiento dual (presencial + telemático) implantado', tipo: 'Recomendado', estandar: '' },
    { dim: 'Resultado', nombre: 'Proporción de pacientes con adherencia óptima (PDC/MPR ≥ umbral)', tipo: 'Básico', estandar: '' },
    { dim: 'Resultado', nombre: 'Cambio en PDC/MPR antes/después de intervención', tipo: 'Básico', estandar: '' },
    { dim: 'Resultado', nombre: 'Tasa de consecución de OFT', tipo: 'Básico', estandar: '' },
    { dim: 'Resultado', nombre: 'Tasa de reestratificación (P1→P2/P3)', tipo: 'Recomendado', estandar: '' },
    { dim: 'Resultado', nombre: 'Proporción de barreras resueltas tras intervención CMO', tipo: 'Recomendado', estandar: '' },
    { dim: 'Experiencia (PROMs/PREMs)', nombre: 'Puntuación PROMs basal y variación tras intervención', tipo: 'Básico', estandar: '' },
    { dim: 'Experiencia (PROMs/PREMs)', nombre: 'Puntuación PREMs (satisfacción con la atención)', tipo: 'Básico', estandar: '' },
    { dim: 'Experiencia (PROMs/PREMs)', nombre: 'Tasa de recogida de PROMs/PREMs en visitas', tipo: 'Recomendado', estandar: '' },
    { dim: 'Implantación y madurez', nombre: 'Fase de madurez MAPEX alcanzada (1-4)', tipo: 'Básico', estandar: '' },
    { dim: 'Implantación y madurez', nombre: 'Grado de cumplimiento del decálogo (%)', tipo: 'Básico', estandar: '' },
    { dim: 'Implantación y madurez', nombre: 'Número de indicadores del cuadro de mando activos', tipo: 'Recomendado', estandar: '' },
    { dim: 'Implantación y madurez', nombre: 'Tasa de registro estructurado de intervenciones en historia clínica', tipo: 'Recomendado', estandar: '' },
  ];

  const tabla = document.getElementById('cm-tabla-body');
  const filtro = document.getElementById('cm-filtro-dim');

  let config = {};
  try {
    const guardado = localStorage.getItem(CLAVE_LOCAL);
    if (guardado) config = JSON.parse(guardado);
  } catch(e) {}

  function guardarLocal() {
    try {
      localStorage.setItem(CLAVE_LOCAL, JSON.stringify(config));
      if (avisoLocal) avisoLocal.style.display = 'flex';
    } catch(e) {}
  }

  function renderTabla(dimFiltro) {
    if (!tabla) return;
    tabla.innerHTML = '';
    const dims = dimFiltro && dimFiltro !== 'todos'
      ? INDICADORES.filter(i => i.dim === dimFiltro)
      : INDICADORES;

    let dimActual = '';
    dims.forEach((ind, idx) => {
      const key = ind.dim + '__' + ind.nombre;
      const cfg = config[key] || { formula: '', fuente: '', periodicidad: '', activo: false };

      if (ind.dim !== dimActual) {
        dimActual = ind.dim;
        const trDim = document.createElement('tr');
        trDim.innerHTML = `<td colspan="7" class="dim-header">${ind.dim}</td>`;
        tabla.appendChild(trDim);
      }

      const tr = document.createElement('tr');
      tr.className = ind.tipo === 'Básico' ? 'ind-basico' : 'ind-recomendado';
      tr.innerHTML = `
        <td><label style="display:flex;gap:8px;align-items:center;cursor:pointer;font-size:0.778rem">
          <input type="checkbox" class="cm-activo" data-key="${key}" ${cfg.activo ? 'checked' : ''} style="accent-color:var(--c-acento);width:15px;height:15px;flex-shrink:0">
          ${ind.nombre}
        </label></td>
        <td><span class="badge ${ind.tipo === 'Básico' ? 'badge-ok' : 'badge-neutral'}">${ind.tipo}</span></td>
        <td>${ind.estandar || '<span style="color:var(--c-texto-tenue);font-style:italic">a definir por el centro</span>'}</td>
        <td><input type="text" class="cm-campo input" data-key="${key}" data-campo="formula" value="${cfg.formula || ''}" placeholder="a definir por el centro" style="min-width:140px" aria-label="Fórmula del indicador ${ind.nombre}"></td>
        <td><input type="text" class="cm-campo input" data-key="${key}" data-campo="fuente" value="${cfg.fuente || ''}" placeholder="a definir por el centro" style="min-width:120px" aria-label="Fuente de datos ${ind.nombre}"></td>
        <td><input type="text" class="cm-campo input" data-key="${key}" data-campo="periodicidad" value="${cfg.periodicidad || ''}" placeholder="a definir por el centro" style="min-width:100px" aria-label="Periodicidad ${ind.nombre}"></td>`;
      tabla.appendChild(tr);
    });

    // Eventos
    tabla.querySelectorAll('.cm-activo').forEach(cb => {
      cb.addEventListener('change', () => {
        const k = cb.dataset.key;
        if (!config[k]) config[k] = {};
        config[k].activo = cb.checked; guardarLocal();
      });
    });
    tabla.querySelectorAll('.cm-campo').forEach(inp => {
      inp.addEventListener('input', () => {
        const k = inp.dataset.key;
        if (!config[k]) config[k] = {};
        config[k][inp.dataset.campo] = inp.value; guardarLocal();
      });
    });
  }

  filtro?.addEventListener('change', () => renderTabla(filtro.value));
  renderTabla('todos');

  document.getElementById('cm-exportar')?.addEventListener('click', () => {
    let txt = `CUADRO DE MANDO MAPEX-ADHEFAR — Configuración del servicio\n${'='.repeat(58)}\nExportado: ${new Date().toLocaleString('es-ES')}\n\n`;
    let dimActual = '';
    INDICADORES.forEach(ind => {
      const key = ind.dim + '__' + ind.nombre;
      const cfg = config[key] || {};
      if (!cfg.activo) return;
      if (ind.dim !== dimActual) { txt += `\n${ind.dim.toUpperCase()}\n${'─'.repeat(40)}\n`; dimActual = ind.dim; }
      txt += `\n[${ind.tipo}] ${ind.nombre}\n`;
      if (ind.estandar) txt += `  Estándar guía: ${ind.estandar}\n`;
      txt += `  Fórmula:       ${cfg.formula || '(a definir por el centro)'}\n`;
      txt += `  Fuente:        ${cfg.fuente || '(a definir por el centro)'}\n`;
      txt += `  Periodicidad:  ${cfg.periodicidad || '(a definir por el centro)'}\n`;
    });
    const activos = Object.values(config).filter(c => c.activo).length;
    if (!activos) { alert('Activa al menos un indicador (marca el checkbox) antes de exportar.'); return; }
    exportarTexto(txt, 'cuadro-mando-mapex.txt');
  });

  document.getElementById('cm-exportar-json')?.addEventListener('click', () => {
    exportarJSON({ version: 1, fecha: new Date().toISOString(), indicadores: config }, 'cuadro-mando-mapex.json');
  });

  document.getElementById('cm-importar')?.addEventListener('change', function() {
    const file = this.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
      try {
        const datos = JSON.parse(e.target.result);
        if (datos.indicadores) { config = datos.indicadores; guardarLocal(); renderTabla(filtro?.value || 'todos'); alert('Configuración importada correctamente.'); }
        else alert('Formato de fichero no reconocido.');
      } catch { alert('Error al leer el fichero JSON.'); }
    };
    reader.readAsText(file);
    this.value = '';
  });

  document.getElementById('cm-limpiar')?.addEventListener('click', () => {
    if (!confirm('¿Eliminar toda la configuración del cuadro de mando? Esta acción borrará también los datos guardados en el navegador.')) return;
    config = {};
    try { localStorage.removeItem(CLAVE_LOCAL); } catch(e) {}
    if (avisoLocal) avisoLocal.style.display = 'none';
    renderTabla(filtro?.value || 'todos');
  });
})();

/* ══════════════════════════════════════════
   C. HOJA DE RUTA POR FASES — Autodiagnóstico
══════════════════════════════════════════ */
(function() {
  const form = document.getElementById('form-fases');
  if (!form) return;
  const res = document.getElementById('fases-resultado');

  form.addEventListener('submit', e => {
    e.preventDefault();
    const checks = Array.from(form.querySelectorAll('input[type="checkbox"]'));
    const fases = [1, 2, 3, 4].map(f => {
      const del = checks.filter(c => c.dataset.fase === String(f));
      const marcados = del.filter(c => c.checked).length;
      return { fase: f, total: del.length, marcados };
    });

    let faseActual = 0;
    for (let i = 0; i < 4; i++) {
      if (fases[i].marcados === fases[i].total) faseActual = fases[i].fase;
      else break;
    }

    const nombres = ['', 'Fase 1 — Inicio (sin MAPEX/CMO)', 'Fase 2 — MAPEX básico', 'Fase 3 — MAPEX+CMO avanzado', 'Fase 4 — Centro de excelencia'];
    const siguiente = faseActual < 4 ? nombres[faseActual + 1] : null;

    let html = `<div style="display:grid;gap:12px">
      <div style="background:var(--c-acento-claro);border-radius:var(--radius-card);padding:20px;border:1.5px solid var(--c-acento)">
        <div style="font-size:0.778rem;font-weight:600;text-transform:uppercase;letter-spacing:.07em;color:var(--c-acento);margin-bottom:8px">Diagnóstico de fase</div>
        <div style="font-size:1.8rem;font-weight:600;font-family:var(--ff-display);color:var(--c-acento-texto)">${faseActual > 0 ? nombres[faseActual] : 'Fase 1 en progreso'}</div>
        ${siguiente ? `<div style="font-size:0.778rem;color:var(--c-texto-secundario);margin-top:8px">Siguiente objetivo: <strong>${siguiente}</strong></div>` : '<div style="font-size:0.778rem;color:var(--c-oportunidad-texto);margin-top:8px">✓ Has alcanzado el nivel de excelencia MAPEX-ADHEFAR.</div>'}
      </div>`;

    fases.forEach(f => {
      const pct = f.total ? Math.round(f.marcados / f.total * 100) : 0;
      const col = pct === 100 ? 'var(--c-ok)' : pct > 50 ? 'var(--c-parcial)' : 'var(--c-no)';
      html += `<div style="display:flex;gap:12px;align-items:center">
        <div style="min-width:48px;font-size:0.778rem;font-weight:600;color:var(--c-texto-secundario)">F${f.fase}</div>
        <div style="flex:1">
          <div style="height:8px;background:var(--c-borde-claro);border-radius:999px;overflow:hidden">
            <div style="height:100%;width:${pct}%;background:${col};border-radius:999px"></div>
          </div>
        </div>
        <div style="min-width:48px;font-size:0.778rem;text-align:right;color:${col};font-weight:600">${pct} %</div>
      </div>`;
    });

    html += '</div>';
    res.innerHTML = html;
    res.className = 'result-box visible';
    res.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });

  document.getElementById('fases-limpiar')?.addEventListener('click', () => {
    form.reset(); res.className = 'result-box'; res.innerHTML = '';
  });
})();

/* ══════════════════════════════════════════
   D. MATRIZ DE COMPETENCIAS
══════════════════════════════════════════ */
(function() {
  const form = document.getElementById('form-competencias');
  if (!form) return;
  const res = document.getElementById('competencias-resultado');

  const COMPETENCIAS = [
    'Modelo CMO y algoritmo ADHEFAR-EM',
    'Entrevista motivacional (técnica y aplicación clínica)',
    'Instrumentos de medición de adherencia (PDC/MPR, cuestionarios)',
    'Telefarmacia y atención telemática',
    'Marco ético-legal de la adherencia y protección de datos',
    'Indicadores MAPEX-ADHEFAR y cuadro de mando',
    'Educación del paciente y teach-back',
  ];

  form.addEventListener('submit', e => {
    e.preventDefault();
    const resultados = COMPETENCIAS.map((c, i) => {
      const val = form.querySelector(`[name="comp-${i}"]:checked`)?.value || null;
      return { competencia: c, nivel: val };
    });

    if (resultados.some(r => !r.nivel)) {
      alert('Valora todas las competencias antes de generar el resultado.'); return;
    }

    const avanzado = resultados.filter(r => r.nivel === 'avanzado').length;
    const basico = resultados.filter(r => r.nivel === 'basico').length;
    const ninguno = resultados.filter(r => r.nivel === 'ninguno').length;

    let html = `<div style="display:grid;gap:12px">
      <div style="background:var(--c-capacidad-claro);border-radius:var(--radius-card);padding:16px;border:1.5px solid rgba(37,99,235,.2)">
        <div style="font-size:0.778rem;font-weight:600;text-transform:uppercase;letter-spacing:.07em;color:var(--c-capacidad-texto);margin-bottom:8px">Perfil del equipo</div>
        <div style="display:flex;gap:16px;flex-wrap:wrap">
          <span style="font-size:0.889rem"><strong style="font-size:1.3rem;color:var(--c-oportunidad-texto)">${avanzado}</strong> avanzado</span>
          <span style="font-size:0.889rem"><strong style="font-size:1.3rem;color:var(--c-motivacion-texto)">${basico}</strong> básico</span>
          <span style="font-size:0.889rem"><strong style="font-size:1.3rem;color:var(--c-no)">${ninguno}</strong> por desarrollar</span>
        </div>
      </div>
      <div style="display:grid;gap:6px">`;

    resultados.forEach(r => {
      const col = r.nivel === 'avanzado' ? 'var(--c-ok)' : r.nivel === 'basico' ? 'var(--c-parcial)' : 'var(--c-no)';
      const etiq = r.nivel === 'avanzado' ? 'Avanzado' : r.nivel === 'basico' ? 'Básico' : 'Por desarrollar';
      html += `<div style="display:flex;gap:10px;align-items:center;padding:8px 12px;background:var(--c-superficie);border-radius:var(--radius);border-left:4px solid ${col}">
        <span style="font-size:0.778rem;flex:1;line-height:1.4">${r.competencia}</span>
        <span style="font-size:0.667rem;font-weight:600;text-transform:uppercase;letter-spacing:.05em;color:${col};white-space:nowrap">${etiq}</span>
      </div>`;
    });

    if (ninguno > 0) {
      html += `<div style="background:var(--c-no-claro);border-radius:var(--radius);padding:12px;font-size:0.778rem;border-left:4px solid var(--c-no);margin-top:8px">
        <strong>Áreas prioritarias de formación:</strong> ${resultados.filter(r => r.nivel === 'ninguno').map(r => r.competencia).join('; ')}.
      </div>`;
    }

    html += '</div></div>';
    res.innerHTML = html;
    res.className = 'result-box visible';
    res.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });

  document.getElementById('competencias-exportar')?.addEventListener('click', () => {
    const resultados = COMPETENCIAS.map((c, i) => ({
      competencia: c,
      nivel: form.querySelector(`[name="comp-${i}"]:checked`)?.value || 'sin valorar'
    }));
    let txt = `MATRIZ DE COMPETENCIAS — MAPEX-ADHEFAR Hub\n${'='.repeat(44)}\n\n`;
    resultados.forEach(r => { txt += `[${r.nivel.toUpperCase().padEnd(12)}] ${r.competencia}\n`; });
    txt += `\nGenerado: ${new Date().toLocaleString('es-ES')}\nNota: autoevaluación del equipo del servicio.`;
    exportarTexto(txt, 'matriz-competencias.txt');
  });

  document.getElementById('competencias-limpiar')?.addEventListener('click', () => {
    form.reset(); res.className = 'result-box'; res.innerHTML = '';
  });
})();

/* ══════════════════════════════════════════
   E. MAPA DE TECNOLOGÍAS
══════════════════════════════════════════ */
(function() {
  const form = document.getElementById('form-tecnologias');
  if (!form) return;
  const res = document.getElementById('tecnologias-resultado');

  const MAPA = {
    'medir-obj': {
      titulo: 'Medir la adherencia objetivamente',
      tecnologias: [
        { nombre: 'Sistemas de información de dispensación hospitalaria', desc: 'Permiten calcular PDC y MPR a partir de los registros de dispensación. Requieren acceso integrado al sistema de farmacia.', consideraciones: 'Disponibilidad variable según el hospital. Limitación en la detección de la no-iniciación primaria.' },
        { nombre: 'Monitores electrónicos de toma (MEMS, Wisepill y similares)', desc: 'Registran cada apertura del envase. Alta precisión; habitualmente usados en investigación clínica.', consideraciones: 'Coste elevado. Uso principalmente en ensayos clínicos y proyectos de investigación.' },
      ]
    },
    'promover': {
      titulo: 'Promover la adherencia y el autocontrol',
      tecnologias: [
        { nombre: 'Apps de recordatorio y registro de tomas (ej.: MyTherapy, Medisafe)', desc: 'Citan la guía como ejemplos representativos. Permiten programar alarmas, registrar tomas y visualizar el progreso.', consideraciones: 'Valorar protección de datos (RGPD), disponibilidad en español, usabilidad para el perfil del paciente y política de privacidad antes de recomendar.' },
        { nombre: 'Mensajería de texto (SMS) y llamadas de seguimiento', desc: 'Bajo coste, alta accesibilidad, no requieren smartphone. Útiles para recordatorios y seguimiento telemático básico.', consideraciones: 'Requieren consentimiento del paciente. Integración con circuitos del servicio.' },
      ]
    },
    'organizar': {
      titulo: 'Organizar la medicación en polimedicación',
      tecnologias: [
        { nombre: 'SPD (Sistemas Personalizados de Dosificación / pastilleros)', desc: 'Organizan la medicación por día y toma. Reducen errores en polimedicación. Disponibles en distintos formatos (manual, automático).', consideraciones: 'Requieren la colaboración del paciente o cuidador para la recarga. Útiles especialmente en Capacidad (barrera de organización).' },
        { nombre: 'Dispensadores electrónicos automáticos', desc: 'Dispensan la dosis correcta en el momento adecuado. Algunos incluyen alertas y registro de tomas.', consideraciones: 'Coste más elevado. Indicados en polimedicación compleja, deterioro cognitivo moderado o necesidad de supervisión.' },
      ]
    },
    'detectar': {
      titulo: 'Detectar no adherencia oculta',
      tecnologias: [
        { nombre: 'Registros de dispensación + cuestionarios validados (medición dual)', desc: 'La combinación de método objetivo y subjetivo es el estándar de la guía. La discordancia entre ambos es un indicador de no adherencia oculta.', consideraciones: 'Aplicar siempre los dos métodos. La discordancia (PDC alto + cuestionario positivo o viceversa) es información diagnóstica.' },
        { nombre: 'Biomarcadores cuando están disponibles (niveles plasmáticos, análisis)', desc: 'En algunos tratamientos permiten confirmar la toma objetivamente (ej.: niveles de antiepilépticos, antivirales).', consideraciones: 'Disponibilidad limitada. No aplicable a todos los tratamientos. Interpretar siempre en contexto clínico.' },
      ]
    },
    'sostener': {
      titulo: 'Sostener la adherencia entre visitas',
      tecnologias: [
        { nombre: 'Telefarmacia (videollamada, mensajería, plataformas de telesalud)', desc: 'Permite el seguimiento remoto entre visitas presenciales. Estándar de la guía como componente de la atención dual.', consideraciones: 'Requiere definir criterios de presencialidad vs. telemática. Adaptar la tecnología al perfil del paciente (brecha digital).' },
        { nombre: 'Plataformas de PROMs digitales', desc: 'Permiten recoger resultados percibidos por el paciente de forma sistemática entre visitas. Facilitan la monitorización proactiva.', consideraciones: 'Integración con la historia clínica. Gestión del dato según normativa de protección de datos.' },
      ]
    },
  };

  form.addEventListener('submit', e => {
    e.preventDefault();
    const objetivo = form.querySelector('[name="objetivo-tec"]:checked')?.value;
    if (!objetivo) { alert('Selecciona un objetivo.'); return; }
    const info = MAPA[objetivo];
    if (!info) return;

    let html = `<div style="display:grid;gap:12px">
      <div style="font-size:0.778rem;font-weight:600;text-transform:uppercase;letter-spacing:.07em;color:var(--c-acento);margin-bottom:4px">Objetivo: ${info.titulo}</div>`;
    info.tecnologias.forEach(t => {
      html += `<div style="background:var(--c-superficie);border-radius:var(--radius-card);padding:16px;border:1.5px solid var(--c-borde-claro)">
        <div style="font-weight:600;margin-bottom:8px;font-size:0.889rem">${t.nombre}</div>
        <p style="font-size:0.778rem;color:var(--c-texto-secundario);margin-bottom:8px">${t.desc}</p>
        <div style="background:var(--c-parcial-claro);border-radius:var(--radius);padding:8px 12px;font-size:0.667rem;border-left:3px solid var(--c-parcial)">
          <strong>Consideraciones:</strong> ${t.consideraciones}
        </div>
      </div>`;
    });
    html += '</div>';
    res.innerHTML = html;
    res.className = 'result-box visible';
  });
})();
