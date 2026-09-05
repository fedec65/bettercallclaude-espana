#!/usr/bin/env node
/**
 * timeline-render.mjs — validador + renderizador determinista para los eventos de legal-chronology.
 *
 * Uso:
 *   node timeline-render.mjs validate <events.json>
 *   node timeline-render.mjs render <events.json> [--outdir <dir>] [--formats all|table|visual|docx]
 *   node timeline-render.mjs selfcheck
 *
 * Cero dependencias (Node >= 18). Hace cumplir la única regla no negociable de la
 * skill legal-chronology: NINGÚN EVENTO SIN FUENTE.
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";

const GAP_DAYS = 30;
const STATUSES = new Set(["undisputed", "alleged", "contested"]);
const PRECISIONS = new Set(["day", "month", "year", "unknown"]);
const STATUS_LABEL = { undisputed: "no controvertido", alleged: "alegado", contested: "controvertido" };
// Canonical deadline-marker kinds (per skills/legal-chronology/references/event-schema.md):
// procesal (plazo procesal, LEC/LJCA/LRJS/LECrim art. 133) and prescripcion (CC arts.
// 1964-1968, CP art. 131). Ambos siempre desde tabla de mapeo, siempre "indicativo".
const DEADLINE_KINDS = new Set(["procesal", "prescripcion", "sustantivo", "caducidad"]);
const ALLOWED_FORMATS = new Set(["all", "table", "visual", "docx"]);
const MONTHS_ES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];

// ---------------------------------------------------------------- helpers
const ISO_RE = /^\d{4}-\d{2}-\d{2}$/;
// Semantic ISO date check: rejects syntactically-valid but impossible dates
// like 2024-02-31 or 2024-13-01 (the bare regex accepted both).
function isValidDate(s) {
  if (typeof s !== "string" || !ISO_RE.test(s)) return false;
  const d = new Date(s + "T00:00:00Z");
  if (isNaN(d)) return false;
  return d.toISOString().slice(0, 10) === s;
}
const daysBetween = (a, b) => Math.round((Date.parse(b) - Date.parse(a)) / 86400000);
const escXml = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const escHtml = escXml;
// Markdown cell escape: `|` would break table column count, newlines would split
// a single event into multiple table rows. Backslashes must be escaped first.
const escMd = (s) => String(s ?? "").replace(/\\/g, "\\\\").replace(/\|/g, "\\|").replace(/\r?\n/g, " ");
const srcLabel = (src) => (src || []).map((s) => `${s.doc}${s.locus ? ", " + s.locus : ""}`).join("; ");
const statusLabel = (s) => `${s} (${STATUS_LABEL[s] || s})`;
// Spanish long-form date: "15 ene 2024". Default 'es'; other langs fall back to ISO.
function fmtDateLocalized(e, lang = "es") {
  if (!e.date) return "(sin fecha)";
  if (e.precision === "month") return e.date.slice(0, 7);
  if (e.precision === "year") return e.date.slice(0, 4);
  if (lang !== "es") return e.date;
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(e.date);
  if (!m) return e.date;
  return `${parseInt(m[3], 10)} ${MONTHS_ES[parseInt(m[2], 10) - 1]} ${m[1]}`;
}

function loadEvents(path) {
  const raw = JSON.parse(readFileSync(path, "utf8"));
  return Array.isArray(raw) ? { case: {}, events: raw } : raw;
}

// ---------------------------------------------------------------- validate
function validate(data) {
  const problems = [];
  const events = data.events || [];
  const idSet = new Set(events.map((e) => e.id).filter(Boolean));
  events.forEach((e, i) => {
    const id = e.id || `#${i}`;
    if (!Array.isArray(e.source) || e.source.length === 0)
      problems.push(`${id}: FUENTE FALTANTE — evento rechazado ("${(e.event || "").slice(0, 60)}")`);
    else
      e.source.forEach((s, j) => {
        if (!s.doc) problems.push(`${id}: source[${j}] falta doc`);
        if (!s.locus) problems.push(`${id}: source[${j}] falta locus`);
      });
    if (e.date && !isValidDate(e.date)) problems.push(`${id}: fecha no ISO o inválida ("${e.date}")`);
    if (!e.date && e.precision !== "unknown") problems.push(`${id}: sin fecha pero precision != unknown`);
    if (!PRECISIONS.has(e.precision)) problems.push(`${id}: precision no válida ("${e.precision}")`);
    if (!STATUSES.has(e.status)) problems.push(`${id}: status no válido ("${e.status}")`);
    if ((e.status === "alleged" || e.status === "contested") && !e.attribution)
      problems.push(`${id}: status "${e.status}" requiere attribution`);
    if (!e.event || !String(e.event).trim()) problems.push(`${id}: texto de evento vacío`);
    // Conflict dates must also be valid ISO dates
    (e.conflicts || []).forEach((c, j) => {
      if (!c.date || !isValidDate(c.date)) problems.push(`${id}: conflicts[${j}] fecha inválida ("${c.date}")`);
      if (c.source && !c.source.doc) problems.push(`${id}: conflicts[${j}] falta source.doc`);
    });
    // Deadline markers schema (see references/event-schema.md)
    (e.deadline_markers || []).forEach((m, j) => {
      if (!m.due || !isValidDate(m.due)) problems.push(`${id}: deadline_markers[${j}] due inválido ("${m.due}")`);
      if (!m.kind || !DEADLINE_KINDS.has(m.kind)) problems.push(`${id}: deadline_markers[${j}] kind no soportado ("${m.kind}")`);
      if (!m.basis || !String(m.basis).trim()) problems.push(`${id}: deadline_markers[${j}] basis vacío`);
      if (!m.anchored_to) problems.push(`${id}: deadline_markers[${j}] falta anchored_to`);
      else if (!idSet.has(m.anchored_to)) problems.push(`${id}: deadline_markers[${j}] anchored_to "${m.anchored_to}" no existe en la colección`);
    });
  });
  return problems;
}

// ---------------------------------------------------------------- analysis
function sortEvents(events) {
  return [...events].sort((a, b) => String(a.date || "9999").localeCompare(String(b.date || "9999")));
}

function findGaps(events) {
  const dated = sortEvents(events.filter((e) => e.date && e.precision === "day"));
  const partial = events.filter((e) => e.date && (e.precision === "month" || e.precision === "year"));
  const candidateGaps = [];
  for (let i = 1; i < dated.length; i++) {
    const d = daysBetween(dated[i - 1].date, dated[i].date);
    if (d >= GAP_DAYS)
      candidateGaps.push({ from: dated[i - 1].date, to: dated[i].date, days: d });
  }
  // Partial-date events (precision month/year) cover a candidate gap if the
  // month/year they belong to falls inside [from, to]. Such events are anchored
  // sources — the gap is no longer a "no documented events" window.
  return candidateGaps.filter((g) => {
    const gFrom = g.from, gTo = g.to;
    return !partial.some((p) => {
      const y = p.date.slice(0, 4);
      const m = p.precision === "month" || p.precision === "year" ? p.date.slice(5, 7) : "01";
      const day = p.precision === "month" || p.precision === "year" ? "01" : p.date.slice(8, 10);
      const pDate = `${y}-${m}-${day}`;
      return pDate >= gFrom && pDate <= gTo;
    });
  });
}

function collectDeadlines(events) {
  const out = [];
  for (const e of events)
    for (const m of e.deadline_markers || [])
      out.push({ ...m, anchor: e.id, anchor_event: e.event });
  return out.sort((a, b) => String(a.due).localeCompare(String(b.due)));
}

// Legacy alias: preserves `fmtDate(e)` call sites; defaults to ES localized
// long-form ("15 ene 2024"). The canonical implementation is fmtDateLocalized.
function fmtDate(e) {
  return fmtDateLocalized(e, "es");
}

// ---------------------------------------------------------------- markdown
function renderMd(data, lang = "es") {
  const events = sortEvents((data.events || []).filter((e) => e.precision !== "unknown"));
  const undated = (data.events || []).filter((e) => e.precision === "unknown");
  const gaps = findGaps(data.events || []);
  const deadlines = collectDeadlines(data.events || []);
  const title = data.case?.title || "Cronología";
  const L = [];
  L.push(`# ${title} — Cronología`, "");
  L.push(`Eventos: ${events.length} | Conflictos: ${events.filter((e) => (e.conflicts || []).length > 0).length} | Controvertidos: ${events.filter((e) => e.status === "contested").length} | Lagunas: ${gaps.length} | Marcadores de plazo: ${deadlines.length}`, "");
  L.push("| Fecha | Evento | Fuente | Estado | Partes |", "|---|---|---|---|---|");
  const gapBefore = new Map(gaps.map((g) => [g.to, g]));
  for (const e of events) {
    const g = gapBefore.get(e.date);
    if (g) L.push(`| **LAGUNA** | ⚠ Laguna probatoria: ningún evento documentado ${g.from} → ${g.to} (${g.days} días) | — | — | — |`);
    const conflict = (e.conflicts || []).length ? ` ⚠ **conflicto de fechas**: ${e.conflicts.map((c) => `${escMd(c.date)} (${escMd(c.source.doc)})`).join(" vs ")}` : "";
    const attr = e.attribution ? ` — *${escMd(e.attribution)}*` : "";
    L.push(`| ${escMd(fmtDateLocalized(e, lang))} | ${escMd(e.event)}${conflict}${attr} | ${escMd(srcLabel(e.source))} | ${escMd(statusLabel(e.status))} | ${escMd((e.parties || []).join(", "))} |`);
  }
  if (undated.length) {
    L.push("", "## Hechos documentados sin fecha", "");
    for (const e of undated) L.push(`- ${escMd(e.event)} (${escMd(srcLabel(e.source))}) — ${escMd(statusLabel(e.status))}`);
  }
  const conflicted = events.filter((e) => (e.conflicts || []).length);
  if (conflicted.length) {
    L.push("", "## Conflictos de fechas", "");
    for (const e of conflicted)
      L.push(`- **${escMd(e.event)}**: ` + e.conflicts.map((c) => `${escMd(c.date)} según ${escMd(c.source.doc)}${c.source.locus ? ", " + escMd(c.source.locus) : ""}`).join(" — CONFLICTO — "));
  }
  if (gaps.length) {
    L.push("", "## Lagunas probatorias", "");
    for (const g of gaps) L.push(`- ${g.from} → ${g.to}: ${g.days} días sin eventos documentados`);
  }
  if (deadlines.length) {
    L.push("", "## Marcadores de plazo (indicativos)", "");
    for (const m of deadlines) L.push(`- **${escMd(m.due)}** — ${escMd(m.label)} (${escMd(m.kind)}, base: ${escMd(m.basis)}), anclado a ${escMd(m.anchor)}: ${escMd(m.anchor_event)}`);
  }
  L.push("", "---", "_Solo herramienta de trabajo — verifique fechas, estados y plazos en el expediente. Los marcadores de plazo son indicativos y no constituyen asesoramiento legal; verifique ante la oficina judicial competente._", "");
  return L.join("\n");
}

// ---------------------------------------------------------------- html
function renderHtml(data, lang = "es") {
  const events = sortEvents((data.events || []).filter((e) => e.precision !== "unknown"));
  const gaps = findGaps(data.events || []);
  const deadlines = collectDeadlines(data.events || []);
  const title = data.case?.title || "Cronología";
  const gapBefore = new Map(gaps.map((g) => [g.to, g]));
  const sources = [];
  const srcId = (s) => {
    const label = srcLabel([s]);
    let i = sources.indexOf(label);
    if (i === -1) { sources.push(label); i = sources.length - 1; }
    return i + 1;
  };
  const rows = [];
  for (const e of events) {
    const g = gapBefore.get(e.date);
    if (g) rows.push(`<tr class="gap"><td colspan="5">⚠ LAGUNA PROBATORIA — ningún evento documentado ${escHtml(g.from)} → ${escHtml(g.to)} (${g.days} días)</td></tr>`);
    const refs = (e.source || []).map((s) => `<a href="#src-${srcId(s)}">[${srcId(s)}]</a>`).join(" ");
    // XSS guard: every dynamic string that lands in the HTML goes through escHtml.
    // Previously `<b>${m.due}</b>` (issue 13) and `${c.date}` in the conflict block
    // were raw — a malicious events.json could inject `<script>` tags.
    const conflict = (e.conflicts || []).length
      ? `<div class="conflict">⚠ conflicto de fechas: ${e.conflicts.map((c) => `${escHtml(c.date)} <i>(${escHtml(c.source.doc)}${c.source.locus ? ", " + escHtml(c.source.locus) : ""})</i>`).join(" vs ")}</div>` : "";
    const attr = e.attribution ? `<div class="attr">${escHtml(e.attribution)}</div>` : "";
    rows.push(`<tr class="${escHtml(e.status)}" data-status="${escHtml(e.status)}"><td class="date">${escHtml(fmtDateLocalized(e, lang))}</td><td>${escHtml(e.event)}${conflict}${attr}</td><td>${refs}</td><td><span class="badge ${escHtml(e.status)}">${escHtml(statusLabel(e.status))}</span></td><td>${escHtml((e.parties || []).join(", "))}</td></tr>`);
  }
  const dl = deadlines.length
    ? `<h2>Marcadores de plazo (indicativos)</h2><ul>${deadlines.map((m) => `<li class="deadline"><b>${escHtml(m.due)}</b> — ${escHtml(m.label)} <i>(${escHtml(m.kind)}; base: ${escHtml(m.basis)})</i> — anclado a ${escHtml(m.anchor)}: ${escHtml(m.anchor_event)}</li>`).join("")}</ul>` : "";
  return `<!DOCTYPE html>
<html lang="es"><head><meta charset="utf-8"><title>${escHtml(title)} — Cronología</title>
<style>
body{font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;margin:2rem;color:#1a1a1a}
table{border-collapse:collapse;width:100%}td,th{border:1px solid #ccc;padding:.45rem .6rem;vertical-align:top;text-align:left}
th{background:#f4f4f4;position:sticky;top:0}
tr.undisputed td:first-child{border-left:5px solid #2e7d32}
tr.alleged td:first-child{border-left:5px solid #f9a825}
tr.contested td:first-child{border-left:5px solid #c62828}
tr.gap td{background:#eceff1;color:#546e7a;font-weight:600}
.badge{border-radius:3px;padding:.1rem .4rem;font-size:.85em;color:#fff}
.badge.undisputed{background:#2e7d32}.badge.alleged{background:#f9a825;color:#222}.badge.contested{background:#c62828}
.conflict{color:#c62828;font-weight:600;margin-top:.3rem}
.attr{color:#555;font-style:italic;margin-top:.2rem}
.date{white-space:nowrap}
.filters{margin:1rem 0}.filters button{margin-right:.5rem;padding:.3rem .8rem;cursor:pointer}
.deadline{color:#1565c0}
.srcs{margin-top:2rem;font-size:.9em;color:#444}
</style></head><body>
<h1>${escHtml(title)} — Cronología</h1>
<p>Eventos: ${events.length} | Controvertidos: ${events.filter((e) => e.status === "contested").length} | Lagunas: ${gaps.length} | Marcadores de plazo: ${deadlines.length}</p>
<div class="filters">Filtro:
<button onclick="f('all')">todos</button><button onclick="f('undisputed')">no controvertidos</button><button onclick="f('alleged')">alegados</button><button onclick="f('contested')">controvertidos</button>
</div>
<table><thead><tr><th>Fecha</th><th>Evento</th><th>Fuente</th><th>Estado</th><th>Partes</th></tr></thead>
<tbody>${rows.join("\n")}</tbody></table>
${dl}
<div class="srcs"><h2>Fuentes</h2><ol>${sources.map((s, i) => `<li id="src-${i + 1}">${escHtml(s)}</li>`).join("")}</ol></div>
<p><small>Solo herramienta de trabajo — verifique fechas, estados y plazos en el expediente. Los marcadores de plazo son indicativos y no constituyen asesoramiento legal; verifique ante la oficina judicial competente.</small></p>
<script>function f(s){document.querySelectorAll('tbody tr[data-status]').forEach(r=>{r.style.display=(s==='all'||r.dataset.status===s)?'':'none'})}</script>
</body></html>`;
}

// ---------------------------------------------------------------- docx (OOXML mínimo, JS puro)
const CRC_TABLE = (() => { const t = new Uint32Array(256); for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } return t; })();
function crc32(buf) { let c = 0xffffffff; for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; }

function zipStore(files) {
  const chunks = [], central = [];
  let offset = 0;
  for (const f of files) {
    const name = Buffer.from(f.name, "utf8"), data = f.data, crc = crc32(data);
    const lh = Buffer.alloc(30);
    lh.writeUInt32LE(0x04034b50, 0); lh.writeUInt16LE(20, 4); lh.writeUInt16LE(0x0800, 6);
    lh.writeUInt16LE(0, 8); lh.writeUInt16LE(0, 10); lh.writeUInt16LE(0, 12);
    lh.writeUInt32LE(crc, 14); lh.writeUInt32LE(data.length, 18); lh.writeUInt32LE(data.length, 22);
    lh.writeUInt16LE(name.length, 26); lh.writeUInt16LE(0, 28);
    chunks.push(lh, name, data);
    const cd = Buffer.alloc(46);
    cd.writeUInt32LE(0x02014b50, 0); cd.writeUInt16LE(20, 4); cd.writeUInt16LE(20, 6); cd.writeUInt16LE(0x0800, 8); cd.writeUInt16LE(0, 10); cd.writeUInt16LE(0, 12); cd.writeUInt16LE(0, 14);
    cd.writeUInt32LE(crc, 16); cd.writeUInt32LE(data.length, 20); cd.writeUInt32LE(data.length, 24);
    cd.writeUInt16LE(name.length, 28); cd.writeUInt16LE(0, 30); cd.writeUInt16LE(0, 32);
    cd.writeUInt16LE(0, 34); cd.writeUInt16LE(0, 36); cd.writeUInt32LE(0, 38); cd.writeUInt32LE(offset, 42);
    central.push(cd, name);
    offset += 30 + name.length + data.length;
  }
  const cdBuf = Buffer.concat(central);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0); end.writeUInt16LE(0, 4); end.writeUInt16LE(0, 6);
  end.writeUInt16LE(files.length, 8); end.writeUInt16LE(files.length, 10);
  end.writeUInt32LE(cdBuf.length, 12); end.writeUInt32LE(offset, 16); end.writeUInt16LE(0, 20);
  return Buffer.concat([...chunks, cdBuf, end]);
}

function docxCell(text, bold = false) {
  return `<w:tc><w:tcPr><w:tcW w:w="2400" w:type="dxa"/></w:tcPr><w:p><w:r>${bold ? "<w:rPr><w:b/></w:rPr>" : ""}<w:t xml:space="preserve">${escXml(text)}</w:t></w:r></w:p></w:tc>`;
}

function renderDocx(data, lang = "es") {
  const events = sortEvents((data.events || []).filter((e) => e.precision !== "unknown"));
  const gaps = findGaps(data.events || []);
  const deadlines = collectDeadlines(data.events || []);
  const title = data.case?.title || "Cronología";
  const gapBefore = new Map(gaps.map((g) => [g.to, g]));
  const rows = [];
  rows.push(["Fecha", "Evento", "Fuente", "Estado", "Partes"].map((h) => docxCell(h, true)).join(""));
  for (const e of events) {
    const g = gapBefore.get(e.date);
    if (g) rows.push(`<w:tr>${docxCell("LAGUNA")}${docxCell(`Laguna probatoria: ningún evento documentado ${g.from} -> ${g.to} (${g.days} días)`, true)}${docxCell("")}${docxCell("")}${docxCell("")}</w:tr>`);
    const conflict = (e.conflicts || []).length ? ` [CONFLICTO DE FECHAS: ${e.conflicts.map((c) => `${c.date} (${c.source.doc})`).join(" vs ")}]` : "";
    const attr = e.attribution ? ` (${e.attribution})` : "";
    rows.push(`<w:tr>${docxCell(fmtDateLocalized(e, lang))}${docxCell(e.event + conflict + attr)}${docxCell(srcLabel(e.source))}${docxCell(statusLabel(e.status))}${docxCell((e.parties || []).join(", "))}</w:tr>`);
  }
  const summary =
    `<w:p><w:r><w:rPr><w:b/></w:rPr><w:t>Conflictos: ${events.filter((e) => (e.conflicts || []).length).length} | Lagunas: ${gaps.length} | Marcadores de plazo: ${deadlines.length}</w:t></w:r></w:p>` +
    deadlines.map((m) => `<w:p><w:r><w:t>- ${m.due}: ${escXml(m.label)} (${m.kind}; base: ${escXml(m.basis)}), anclado a ${escXml(m.anchor)}</w:t></w:r></w:p>`).join("");
  const documentXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>
<w:p><w:r><w:rPr><w:b/><w:sz w:val="32"/></w:rPr><w:t>${escXml(title)} — Cronología</w:t></w:r></w:p>
<w:tbl><w:tblPr><w:tblBorders><w:top w:val="single" w:sz="4"/><w:left w:val="single" w:sz="4"/><w:bottom w:val="single" w:sz="4"/><w:right w:val="single" w:sz="4"/><w:insideH w:val="single" w:sz="4"/><w:insideV w:val="single" w:sz="4"/></w:tblBorders></w:tblPr>${rows.join("\n")}</w:tbl>
<w:p/>${summary}
<w:p><w:r><w:rPr><w:i/></w:rPr><w:t>Solo herramienta de trabajo — verifique fechas, estados y plazos en el expediente. Los marcadores de plazo son indicativos y no constituyen asesoramiento legal; verifique ante la oficina judicial competente.</w:t></w:r></w:p>
</w:body></w:document>`;
  const contentTypes = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>`;
  const rels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>`;
  return zipStore([
    { name: "[Content_Types].xml", data: Buffer.from(contentTypes, "utf8") },
    { name: "_rels/.rels", data: Buffer.from(rels, "utf8") },
    { name: "word/document.xml", data: Buffer.from(documentXml, "utf8") },
  ]);
}

// ---------------------------------------------------------------- commands
function cmdValidate(path) {
  const problems = validate(loadEvents(path));
  if (problems.length) {
    console.error(`VALIDACIÓN FALLIDA — ${problems.length} problema(s):`);
    problems.forEach((p) => console.error("  - " + p));
    process.exitCode = 1;
  } else console.log("VALIDACIÓN OK — cada evento tiene una fuente.");
}

function cmdRender(path, args) {
  const outdir = args.outdir || "bcc-output/cronologia";
  const rawFormats = (args.formats || "all").split(",").map((s) => s.trim()).filter(Boolean);
  // 'all' is a meta-format that expands to all concrete formats; concrete formats
  // must all be in ALLOWED_FORMATS (issue 10).
  const all = rawFormats.includes("all");
  const concrete = rawFormats.filter((f) => f !== "all");
  const unknown = concrete.filter((f) => !ALLOWED_FORMATS.has(f));
  if (concrete.length === 0 && !all) {
    console.error("formato no soportado: <vacío>. Soportados: all, table, visual, docx");
    process.exitCode = 2;
    return;
  }
  if (unknown.length) {
    console.error(`formato no soportado: ${unknown.join(", ")}. Soportados: all, table, visual, docx`);
    process.exitCode = 2;
    return;
  }
  const data = loadEvents(path);
  const problems = validate(data);
  if (problems.length) {
    console.error(`Renderizado rechazado: ${problems.length} problema(s) de validación. Corrige o elimina antes los eventos afectados.`);
    problems.forEach((p) => console.error("  - " + p));
    process.exitCode = 1;
    return;
  }
  mkdirSync(outdir, { recursive: true });
  const written = [];
  if (all || concrete.includes("table")) { writeFileSync(join(outdir, "cronologia.md"), renderMd(data)); written.push("cronologia.md"); }
  if (all || concrete.includes("visual")) { writeFileSync(join(outdir, "cronologia.html"), renderHtml(data)); written.push("cronologia.html"); }
  if (all || concrete.includes("docx")) { writeFileSync(join(outdir, "cronologia.docx"), renderDocx(data)); written.push("cronologia.docx"); }
  console.log(`Renderizado en ${outdir}: ${written.join(", ")}`);
}

// ---------------------------------------------------------------- selfcheck
function selfcheck() {
  // Plazo del fixture: apelación 20 días hábiles desde el día siguiente a la notificación
  // (LEC 133.1-133.2; 1 de mayo inhábil) — 16.4 → 14.5.2024, computado a mano, indicativo.
  const fixture = {
    case: { title: "Fixture Selfcheck" },
    events: [
      { id: "evt-1", date: "2024-01-15", precision: "day", event: "Firma del contrato.", source: [{ doc: "01-contrato", locus: "p. 1" }], status: "undisputed", parties: ["A", "B"] },
      { id: "evt-2", date: "2024-03-03", precision: "day", event: "Entrega de la máquina.", source: [{ doc: "01-contrato", locus: "art. 4.1" }, { doc: "02-carta", locus: "p. 1" }], status: "contested", attribution: "La actora alega la entrega del 3.3.; la demandada la controvierte.", parties: ["A", "B"], conflicts: [{ date: "2024-03-03", source: { doc: "01-contrato", locus: "art. 4.1" } }, { date: "2024-03-10", source: { doc: "02-carta", locus: "p. 1" } }] },
      { id: "evt-3", date: "2024-04-15", precision: "day", event: "Notificación de la sentencia.", source: [{ doc: "04-notificacion", locus: "acuse de recibo" }], status: "undisputed", parties: ["A", "B"], deadline_markers: [{ kind: "procesal", label: "Apelación (art. 458.1 LEC: 20 días)", due: "2024-05-14", basis: "tabla-mapeo (indicativo)", anchored_to: "evt-3" }] },
      { id: "evt-bad", date: "2024-05-01", precision: "day", event: "Hecho sin fuente.", source: [], status: "alleged", attribution: "La actora lo alega.", parties: ["A"] },
    ],
  };
  const checks = [];
  const ok = (name, cond) => { checks.push([name, !!cond]); };
  // 1. evento sin fuente rechazado
  const problems = validate(fixture);
  ok("evento sin fuente rechazado", problems.some((p) => p.includes("evt-bad")));
  // 2-12. render con el evento erróneo eliminado
  const clean = { ...fixture, events: fixture.events.filter((e) => e.id !== "evt-bad") };
  ok("fixture limpia válida", validate(clean).length === 0);
  const md = renderMd(clean);
  ok("conflicto muestra AMBAS fechas", md.includes("2024-03-03") && md.includes("2024-03-10"));
  ok("estado controvertido + atribución", md.includes("contested (controvertido)") && md.includes("La actora alega la entrega del 3.3.; la demandada la controvierte."));
  ok("evento fusionado tiene dos fuentes", md.includes("01-contrato, art. 4.1; 02-carta, p. 1"));
  ok("laguna >= 30 días señalada (15.01 -> 03.03)", md.includes("Laguna probatoria") && md.includes("48 días"));
  ok("marcador de plazo renderizado", md.includes("Apelación (art. 458.1 LEC: 20 días)") && md.includes("tabla-mapeo (indicativo)"));
  const html = renderHtml(clean);
  ok("html autónomo (sin CDN)", !/src="http|href="http/.test(html));
  ok("html con lang es y clases de estado", html.includes('lang="es"') && (html.includes('class="contested"') || html.includes("badge contested")));
  const docx = renderDocx(clean);
  ok("docx es un zip (PK)", docx[0] === 0x50 && docx[1] === 0x4b);
  ok("docx contiene la entrada document.xml", docx.includes(Buffer.from("word/document.xml")));

  // ---- nuevos controles para los issues 5-10, 13 ----

  // issue 5: fechas imposibles rechazadas (sintaxis OK pero día/mes invalidados)
  const badDate = { ...fixture, events: [
    ...clean.events,
    { id: "evt-imposible", date: "2024-02-31", precision: "day", event: "Imposible.", source: [{ doc: "x", locus: "1" }], status: "undisputed" },
  ]};
  const badDateProblems = validate(badDate);
  ok("fecha imposible 2024-02-31 rechazada", badDateProblems.some((p) => p.includes("evt-imposible") && p.includes("2024-02-31")));

  const badMonth = { ...fixture, events: [
    ...clean.events,
    { id: "evt-mesmal", date: "2024-13-01", precision: "day", event: "Mes inválido.", source: [{ doc: "x", locus: "1" }], status: "undisputed" },
  ]};
  const badMonthProblems = validate(badMonth);
  ok("fecha 2024-13-01 rechazada", badMonthProblems.some((p) => p.includes("evt-mesmal") && p.includes("2024-13-01")));

  // issue 6: evento con precision month dentro de un gap day-day ya no señala la laguna
  const partialGap = {
    case: { title: "Partial Gap" },
    events: [
      { id: "p1", date: "2024-01-15", precision: "day", event: "Inicio.", source: [{ doc: "d", locus: "1" }], status: "undisputed" },
      { id: "pm", date: "2024-02-15", precision: "month", event: "Hecho parcial dentro del gap.", source: [{ doc: "d", locus: "2" }], status: "undisputed" },
      { id: "p2", date: "2024-03-03", precision: "day", event: "Fin.", source: [{ doc: "d", locus: "3" }], status: "undisputed" },
    ],
  };
  ok("partial-date event dentro de gap anula la laguna", findGaps(partialGap.events).length === 0);
  ok("validate acepta partial-date entre day-day", validate(partialGap).length === 0);

  // issue 7: deadline con anchored_to inexistente rechazado
  const badAnchor = { ...clean, events: [
    ...clean.events,
    { id: "evt-anchor-bad", date: "2024-06-01", precision: "day", event: "Anclaje roto.", source: [{ doc: "d", locus: "1" }], status: "undisputed",
      deadline_markers: [{ kind: "procesal", label: "Plazo huérfano", due: "2024-06-30", basis: "tabla-mapeo (indicativo)", anchored_to: "evt-nonexistent" }] },
  ]};
  const badAnchorProblems = validate(badAnchor);
  ok("deadline anchored_to inexistente rechazado", badAnchorProblems.some((p) => p.includes("evt-anchor-bad") && p.includes("evt-nonexistent")));

  // issue 8: locale spagnolo (15 ene 2024)
  const mdEs = renderMd(clean, "es");
  ok("renderMd ES usa mes corto español", mdEs.includes("15 ene 2024"));
  ok("renderMd ES no se queda en ISO Fecha", !mdEs.includes("| 2024-01-15 |"));

  // issue 9: pipe y newline en event se escapan, no rompen la tabla
  const dirty = { ...fixture, events: [
    { id: "d1", date: "2024-01-15", precision: "day", event: "Pago | a | cuenta\ncorriente", source: [{ doc: "d", locus: "1" }], status: "undisputed", parties: ["A"] },
  ]};
  const dirtyMd = renderMd(dirty);
  const rowsCount = (dirtyMd.match(/^\|/gm) || []).length;
  // Cabecera + separador + 1 evento (sin LAGUNA) = 3 líneas que empiezan con "|"
  ok("pipe/newline en event NO multiplica filas de tabla", rowsCount === 3);
  ok("pipe en event se escapa", dirtyMd.includes("Pago \\| a \\| cuenta corriente"));

  // issue 10: formato desconocido rechazado con exit 2
  const tmpEvents = join(tmpdir(), "cronologia-fmtcheck.json");
  writeFileSync(tmpEvents, JSON.stringify(clean));
  try {
    cmdRender(tmpEvents, { formats: "docx,foo" });
    ok("formato desconocido → exit 2", process.exitCode === 2);
  } catch (_) {
    ok("formato desconocido → exit 2", false);
  }
  // Reset exitCode for the rest of the selfcheck
  process.exitCode = 0;

  // issue 13: XSS — un evento con <script> debe ser escapado en HTML
  const xss = { ...clean, events: [
    { id: "xss1", date: "2024-01-15", precision: "day", event: "<img src=x onerror=alert(1)>", source: [{ doc: "d", locus: "1" }], status: "undisputed", parties: [] },
    { id: "xss2", date: "2024-02-01", precision: "day", event: "Notif.", source: [{ doc: "d", locus: "1" }], status: "undisputed", parties: [],
      deadline_markers: [{ kind: "procesal", label: "plazo", due: "2024-05-14<script>alert(1)</script>", basis: "tabla-mapeo (indicativo)", anchored_to: "xss2" }] },
  ]};
  const xssHtml = renderHtml(xss);
  ok("html escapa <script> en event", !xssHtml.includes("<img src=x") && xssHtml.includes("&lt;img"));
  ok("html escapa <script> en deadline due", !xssHtml.includes("<script>alert(1)</script>") && xssHtml.includes("&lt;script&gt;"));

  // escribe los output en temp para inspección
  const outdir = join(tmpdir(), "cronologia-selfcheck");
  mkdirSync(outdir, { recursive: true });
  writeFileSync(join(outdir, "cronologia.md"), md);
  writeFileSync(join(outdir, "cronologia.html"), html);
  writeFileSync(join(outdir, "cronologia.docx"), docx);
  let failed = 0;
  for (const [name, passed] of checks) {
    console.log(`${passed ? "PASS" : "FAIL"}  ${name}`);
    if (!passed) failed++;
  }
  console.log(failed ? `SELFCHECK FALLIDO (${failed})` : `SELFCHECK OK (${checks.length} controles) — output de ejemplo en ${outdir}`);
  process.exitCode = failed ? 1 : 0;
}

// ---------------------------------------------------------------- main
const [cmd, target, ...rest] = process.argv.slice(2);
const args = {};
for (let i = 0; i < rest.length; i += 2) args[rest[i].replace(/^--/, "")] = rest[i + 1];
if (cmd === "validate" && target) cmdValidate(target);
else if (cmd === "render" && target) cmdRender(target, args);
else if (cmd === "selfcheck") selfcheck();
else {
  console.log("Uso: timeline-render.mjs validate <events.json> | render <events.json> [--outdir dir] [--formats all|table|visual|docx] | selfcheck");
  process.exitCode = 2;
}
