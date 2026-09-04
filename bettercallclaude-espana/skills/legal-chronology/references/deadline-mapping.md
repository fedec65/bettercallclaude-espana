# Mapeo de Plazos — Tipos de Evento → Plazos Legales

Dos familias distintas: plazos procesales (LEC/LJCA/LRJS/LECrim) y prescripción/caducidad sustantiva (CC/CP). Mantenlas separadas en el output y no confundas jamás la distinción — en España además opera una tercera distinción interna: **prescripción** (se interrumpe, CC 1973) vs **caducidad** (no se interrumpe, CC 1930.2).

**Regla fundamental para el ordenamiento español**: no existe tool MCP determinista de plazos (la edición italiana usa `legal-persona-ita_compute_deadlines`; la española no tiene equivalente). TODO marcador deriva de la tabla de este archivo (fecha del evento + plazo legal, computado según las reglas de abajo) y es SIEMPRE etiquetado **indicativo — verificar** con `basis: tabla-mapeo (indicativo)`. Nunca presentar un marcador como autorizado ni simular un cálculo de tool.

**Reglas de cómputo** (aplicar y declarar manualmente en cada marcador): art. 133 LEC — el plazo corre desde el día siguiente al acto de comunicación (133.1); los plazos por días excluyen los inhábiles (133.2); los plazos por meses/años se computan de fecha a fecha (133.3); si vencen en sábado, domingo o inhábil se entienden prorrogados al siguiente hábil (133.4); presentación de escritos hasta las 15:00 del día hábil siguiente al vencimiento (135.5). Días inhábiles a efectos procesales: el mes de agosto completo y del 24 de diciembre al 6 de enero (art. 130.2 LEC y art. 183 LOPJ); en lo contencioso-administrativo el plazo de interposición tampoco corre en agosto (art. 128.2 LJCA). **Ojo despido**: el plazo de demanda es de caducidad y computa en días hábiles excluyendo sábados, domingos y festivos (art. 103 LRJS). La verificación final corresponde a la oficina judicial competente.

## A. Plazos Procesales (LEC / LJCA / LRJS / LECrim) → Tabla de Mapeo (INDICATIVO)

| Evento ancla (ejemplos) | Plazo | Base |
|---|---|---|
| Traslado de la demanda (juicio ordinario) | Contestación: 20 días | Art. 404.1 LEC |
| Notificación de sentencia de primera instancia | Apelación: 20 días | Art. 458.1 LEC |
| Notificación de la resolución recurrible en casación / infracción procesal | Casación e IEP: 20 días | Art. 479.1 LEC |
| Notificación de providencia o auto no definitivo | Reposición: 5 días | Art. 452.1 LEC |
| Notificación del acto que agota la vía administrativa | Recurso contencioso-administrativo: 2 meses (6 meses si silencio tácito) | Art. 46.1 LJCA |
| Notificación de sentencia contencioso-administrativa | Apelación: 15 días | Art. 85.1 LJCA |
| Notificación de sentencia C-A susceptible de casación | Preparación de casación: 30 días; interposición: 30 días † | Arts. 89.1 y 92 LJCA |
| Requerimiento de pago (proceso monitorio) | Pagar u oponerse: 20 días | Art. 815.1 LEC |
| Requerimiento de pago (juicio cambiario) | Demanda de oposición: 10 días | Art. 824.1 LEC |
| Extinción del contrato (despido) | Demanda: 20 días hábiles — **plazo de caducidad** | Art. 103 LRJS |
| Citación para juicio (social) | Celebración no antes de 10 días | Art. 82.1 LRJS |
| Notificación de sentencia laboral recurrible en suplicación | Anuncio: 5 días; interposición: 10 días †; impugnación: 5 días | Arts. 194, 196 † y 197.1 LRJS |
| Notificación de sentencia de suplicación | Preparación casación unificación de doctrina: 10 días †; formalización: 20 días † | Arts. 219 y 224 LRJS |
| Notificación de resolución penal (ordinario / abreviado / delitos leves) | Apelación: 5 días | Arts. 212, 766.3 y 976.1 LECrim |
| Notificación de sentencia penal recurrible en casación | Preparación: 5 días; emplazamiento ante el TS: 15 días (20 Baleares; 30 Canarias/Ceuta/Melilla) | Arts. 856 y 859 LECrim |

† plazo verificado solo por fuente doctrinal — verificación literal del texto consolidado pendiente; etiquetar igualmente indicativo.

Reglas:
- El evento ancla DEBE ser un evento de tipo notificación/publicación/requerimiento con fuente ("notificación de la sentencia del …", "requerimiento de pago del …").
- La etiqueta del marcador incluye la base: `Apelación (art. 458.1 LEC: 20 días) — tabla-mapeo (indicativo)`.
- Si el ancla es publicación sin notificación fehaciente, anótalo en el marcador — el cómputo puede variar.
- Ritos no cubiertos por la tabla: marca `procesal (fuera de tabla — cálculo manual necesario)`; no fabricar un plazo.

## B. Prescripción Sustantiva (CC arts. 1930-1975) → Tabla de Mapeo (INDICATIVO)

| Tipo de derecho / evento | Periodo | Base |
|---|---|---|
| Acción hipotecaria | 20 años desde que pueda ejercitarse | Arts. 1964.1 CC y 128 LH |
| Acciones personales sin plazo especial | 5 años desde la exigibilidad de la obligación | Art. 1964.2 CC |
| Partición de herencia, división de cosa común, deslinde (entre coherederos, condueños o colindantes) | No prescriben | Art. 1965 CC |
| Pensiones alimenticias, precio de arriendos, pagos por años o en plazos más breves | 5 años | Art. 1966 CC |
| Honorarios de abogados, procuradores, notarios, registradores, peritos y agentes; farmacéuticos; profesores y maestros; menestrales, criados y jornaleros; posaderos y mercaderes | 3 años | Art. 1967 CC |
| Responsabilidad civil extracontractual (art. 1902 CC); injurias y calumnias | 1 año | Art. 1968 CC |
| Acción de nulidad por anulabilidad (intimidación/violencia, error, dolo, menores, discapacidad...) | 4 años — **caducidad** (desde cese de la violencia, consumación del contrato, salida de la patria potestad...) | Art. 1301 CC |
| Saneamiento por vicios ocultos en la compraventa | 6 meses desde la entrega | Art. 1490 CC |
| Ruina de obra por vicios de la construcción | 10 años desde que concluyó la construcción; 15 años si incumplimiento de las condiciones del contrato | Art. 1591 CC |
| Compraventas de consumo (bienes y contenidos digitales) | Régimen especial TRLGDCU: falta de conformidad que se manifieste dentro de 3 años (bienes) / 2 (digitales) desde la entrega; la acción prescribe a los 5 años desde la manifestación | Arts. 120.1 y 124 TRLGDCU |

**Régimen transitorio del art. 1964 CC** (redacción Ley 42/2015, en vigor 7-10-2015; antes 15 años): conforme a la DT 5ª de la Ley 42/2015, el CC 1939 y la STS 29/2020 — acciones nacidas entre el 7-10-2005 y el 7-10-2015: prescriben el 7-10-2020; nacidas entre el 7-10-2000 y el 7-10-2005: mantienen 15 años; anteriores al 7-10-2000: ya prescritas. Si la cronología cruza esa frontera, anota la regla aplicada en el marcador.

Reglas:
- Muestra siempre: evento ancla, artículo de base, fecha calculada, flag **indicativo**.
- El dies a quo puede depender de la exigibilidad del derecho (1964.2 CC) o del cese/consumación (1301 CC) — registra qué representa el ancla ("desde la entrega", "desde que pudo ejercitarse").
- Si el expediente sugiere una interrupción (reclamación extrajudicial, art. 1973 CC) o suspensión (arts. 1931-1932 CC), anótala — NO recalcular en silencio. Los plazos de caducidad (1301, despido, consumos especiales) NO se interrumpen.
- Distingue prescripción (CC 1930 ss.) de caducidad: los términos de caducidad corren igual pero no se interrumpen — anota cuál de las dos figuras aplica.

## C. Prescripción Penal (LO 10/1995) → Tabla de Mapeo (INDICATIVO)

| Figura | Plazo | Base |
|---|---|---|
| Delitos con pena máxima de prisión ≥ 15 años | 20 años | Art. 131 CP |
| Pena de inhabilitación > 10 años, o prisión > 10 y < 15 años | 15 años | Art. 131 CP |
| Prisión o inhabilitación > 5 y ≤ 10 años | 10 años | Art. 131 CP |
| Los demás delitos | 5 años | Art. 131 CP |
| Delitos de injurias y calumnias; delitos leves | 1 año | Art. 131 CP |
| Penas impuestas por sentencia firme | 30/25/20/15/10/5/1 años según la pena, desde la firmeza o el quebrantamiento | Arts. 133-134 CP |

Reglas:
- Dies a quo (art. 132.1 CP): día de la comisión; delito continuado → última actividad; permanente → eliminación de la situación ilícita; habitualidad → cese de la conducta.
- Interrupción (art. 132.2 CP): el procedimiento dirigido contra el indiciariamente responsable (resolución judicial motivada) interrumpe y deja sin efecto el tiempo transcurrido; la querella o denuncia suspende el cómputo como máximo 6 meses.
- La responsabilidad civil derivada del delito (art. 109 CP) prescribe conforme a las reglas civiles en lo no previsto por el CP (en vía extracontractual, 1 año, art. 1968.2ª CC), con la interrupción ligada al proceso penal — verificar jurisprudencia del TS.

## Forma del Marcador en Output

```json
{
  "kind": "procesal | prescripcion",
  "label": "Apelación (art. 458.1 LEC: 20 días)",
  "due": "2024-05-15",
  "basis": "tabla-mapeo (indicativo)",
  "anchored_to": "evt-0007"
}
```

Ningún marcador flotante: cada plazo ancla a un id de evento con fuente.
