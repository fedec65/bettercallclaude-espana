# Esquema de Evento — legal-chronology

Esquema JSON canónico para los eventos de la cronología. El renderer (`scripts/timeline-render.mjs validate`) hace cumplir las partes obligatorias.

## Esquema

```json
{
  "id": "evt-0001",
  "date": "2024-03-03",
  "precision": "day | month | year | unknown",
  "event": "Descripción fáctica neutral en una frase.",
  "source": [
    {"doc": "01-contrato", "locus": "p. 2, cl. 4.1"}
  ],
  "status": "undisputed | alleged | contested",
  "attribution": "La parte A alega X; la parte B lo controvierte / calla. (obligatoria si no undisputed)",
  "parties": ["Ejemplo S.L.", "Blanco"],
  "conflicts": [
    {"date": "2024-03-03", "source": {"doc": "01-contrato", "locus": "cl. 4.1"}},
    {"date": "2024-03-10", "source": {"doc": "02-carta", "locus": "p. 1, párr. 2"}, "note": "entrega fechada distinto"}
  ],
  "deadline_markers": [
    {"kind": "procesal | prescripcion", "label": "Apelación (art. 458 LEC: 20 días)", "due": "2024-05-15", "basis": "tabla-mapeo (indicativo)", "anchored_to": "evt-0007"}
  ],
  "tags": ["contrato", "entrega", "notificacion"]
}
```

## Reglas de los Campos

- `id`: estable `evt-NNNN`, asignado en la fusión; nunca reutilizado tras una eliminación.
- `date`: ISO `YYYY-MM-DD`. Para `precision: month` usa el día 1 del mes en `date` y mantén `precision: month` (la visualización muestra "marzo de 2024"). Para `precision: year`, análogamente con el 1 de enero. `precision: unknown` se admite SOLO para candidatos — el renderer excluye los eventos sin fecha del cuerpo de la cronología y los lista bajo "Hechos documentados sin fecha".
- `event`: una frase, neutral. Sin argumentaciones, sin calificaciones jurídicas ("presumiblemente" va en `attribution`, no en `event`).
- `source`: **obligatoria, no vacía**. Cada entrada: `doc` (id de documento del inventario) + `locus` (página/párrafo/sección, lo más precisa posible). Varias entradas para atestaciones multilingües/multidocumento del mismo evento.
- `status` (valores enum en inglés, etiquetas españolas en visualización):
  - `undisputed` — **no controvertido**: todas las fuentes concuerdan; ninguna negación registrada.
  - `alleged` — **alegado**: una parte afirma; la otra calla. `attribution` obligatoria.
  - `contested` — **controvertido**: afirmado y negado. `attribution` obligatoria ("A alega …; B controvierte …").
- `conflicts`: presente cuando las fuentes fechan distinto el mismo evento. Contiene CADA variante fechada con su fuente. El campo `date` lleva la variante más antigua para ordenar; el flag de conflicto gobierna el render de todas las variantes.
- `deadline_markers.kind`: `procesal` o `prescripcion` — en ambos casos siempre desde tabla de mapeo, siempre `basis: "tabla-mapeo (indicativo)"`. En el ordenamiento español no existe base de cálculo automático autorizada: la edición española no tiene tool de plazos.
- `tags`: libres, usadas para el filtrado HTML.

## Ejemplo Válido

```json
{
  "id": "evt-0003",
  "date": "2024-03-03",
  "precision": "day",
  "event": "Entrega de la maquinaria en las instalaciones del comprador.",
  "source": [
    {"doc": "01-contrato", "locus": "cl. 4.1"},
    {"doc": "02-carta", "locus": "p. 1, párr. 2"}
  ],
  "status": "contested",
  "attribution": "Ejemplo S.L. alega la entrega del 3.3.2024; Blanco controvierte la entrega conforme.",
  "parties": ["Ejemplo S.L.", "Blanco"],
  "conflicts": [
    {"date": "2024-03-03", "source": {"doc": "01-contrato", "locus": "cl. 4.1"}},
    {"date": "2024-03-10", "source": {"doc": "02-carta", "locus": "p. 1, párr. 2"}}
  ],
  "tags": ["entrega"]
}
```

## Ejemplo No Válido (rechazado por validate)

```json
{
  "id": "evt-0009",
  "date": "2024-05-01",
  "precision": "day",
  "event": "El defecto fue comunicado telefónicamente.",
  "source": [],
  "status": "alleged",
  "parties": ["Blanco"]
}
```

Rechazado: `source` vacía. Ningún evento sin procedencia — jamás. Si un hecho no puede anclarse a un locus documental, no entra en la cronología.
