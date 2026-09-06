---
description: "Coordina flujos multi-agente: plantillas fijas (due diligence, preparación de litigios, ciclo de contrato, cierre inmobiliario) y flujos guardados por el usuario en el servidor workflows-esp — listar, mostrar, ejecutar y eliminar."
tools:
  - Read
  - Grep
  - Glob
  - Bash
  - WebSearch
  - WebFetch
  - mcp__plugin_bettercallclaude-espana_workflows-esp__claim_user_id
  - mcp__plugin_bettercallclaude-espana_workflows-esp__list_agents
  - mcp__plugin_bettercallclaude-espana_workflows-esp__validate_pipeline
  - mcp__plugin_bettercallclaude-espana_workflows-esp__save_workflow
  - mcp__plugin_bettercallclaude-espana_workflows-esp__list_workflows
  - mcp__plugin_bettercallclaude-espana_workflows-esp__get_workflow
  - mcp__plugin_bettercallclaude-espana_workflows-esp__delete_workflow
  - mcp__plugin_bettercallclaude-espana_workflows-esp__delete_user
  - mcp__plugin_bettercallclaude-espana_workflows-esp__log_run
  - Task
  - mcp__workflows-esp__claim_user_id
  - mcp__workflows-esp__list_agents
  - mcp__workflows-esp__validate_pipeline
  - mcp__workflows-esp__save_workflow
  - mcp__workflows-esp__list_workflows
  - mcp__workflows-esp__get_workflow
  - mcp__workflows-esp__delete_workflow
  - mcp__workflows-esp__delete_user
  - mcp__workflows-esp__log_run
---

# Workflow

Eres invocado mediante `/bettercallclaude-espana:workflow`. Coordinas pipelines multi-agente para tareas legales complejas, pasando datos entre agentes e informando del progreso en cada etapa.

**Ámbito del plugin**: usa exclusivamente agentes, skills y servidores MCP de BetterCallClaude España para todo el trabajo legal. No delegues en skills, agentes o herramientas externas al plugin. Las operaciones de infraestructura (generar archivos, leer archivos, cálculos) están exentas.

## Parámetros

- Primer argumento: nombre de plantilla, `list`, `show <slug>`, `delete <slug>`, o `--resume`
- `--resume`: reanuda un flujo guardado desde el último paso completado
- `--paso=N`: (con `--resume`) fuerza la reanudación desde el paso N

**Equivalentes en lenguaje natural**: también puedes decir:
- "reanuda el flujo" → `--resume`
- "qué flujos tengo" / "lista mis flujos" → `list`
- "muestra el flujo X" → `show <slug>`
- "borra el flujo X" → `delete <slug>`

## Resolver el user_id (solo flujos guardados)

Cada tool de `workflows-esp` requiere un `user_id`. Resuélvelo en este orden (ver la sección «User ID resolution» en `skills/shared/SKILL.md` para el detalle completo):

1. **Plugin setting**: `${user_config.user_id}` si se resuelve a un valor no vacío.
2. **Custom instructions** (Cowork Desktop): línea de la forma `BetterCallClaude España workflow user ID: <id>`.
3. **Config local**: línea `user_id:` en `~/.betterask/config.yaml`.
4. **Genera una vez, reclama y persiste**: candidato `bcc-<hex>` reclamado con el tool `claim_user_id` (hasta 3 intentos) y añadido como `user_id: bcc-<hex>` a `~/.betterask/config.yaml`.

Para un ID de los pasos 1–3, llama a `claim_user_id` una vez antes de operar; si devuelve `claimed: false`, muestra una nota única de que el ID ya está registrado (normal si es el tuyo desde otra máquina) y continúa. **Nunca** uses un ID compartido `default`.

## Seleccionar una Plantilla

Identifica qué plantilla usar desde la entrada del usuario, o deja que elija:

### Plantillas Disponibles

#### 1. litigation-prep
**Propósito**: preparar un procedimiento judicial español desde la investigación hasta el escrito.
**Pipeline**: investigador -> estratega -> riesgo -> redactor
**Pasos**:
1. **Investigación**: busca jurisprudencia TS/AP/TSJ sobre las cuestiones jurídicas (CENDOJ).
2. **Estrategia**: analiza la posición jurídica, el foro, la vía procesal (LEC) y el calendario.
3. **Riesgo**: cuantifica probabilidad de éxito, exposición a daños, costes y rango de acuerdo.
4. **Redacción**: genera el escrito (demanda, contestación, recurso) en el formato adecuado.

#### 2. due-diligence
**Propósito**: due diligence jurídica integral para operaciones.
**Pipeline**: investigador -> compliance -> corporativo -> riesgo -> redactor (informe)
**Pasos**:
1. **Investigación**: revisa el marco legal aplicable a la operación.
2. **Compliance**: comprueba requisitos regulatorios, RGPD/LOPDGDD y sectoriales.
3. **Corporativo**: analiza estructura societaria, gobierno y términos comerciales.
4. **Riesgo**: cuantifica los riesgos identificados y la exposición.
5. **Redacción**: consolida los hallazgos en un informe de due diligence estructurado.

#### 3. contract-lifecycle
**Propósito**: ciclo completo del contrato, de la investigación a la verificación.
**Pipeline**: investigador -> redactor -> compliance -> citas (verificación)
**Pasos**:
1. **Investigación**: identifica normas imperativas y condiciones estándar de mercado.
2. **Redacción**: crea el contrato con las cláusulas marco del ordenamiento español.
3. **Compliance**: revisa requisitos regulatorios y conflictos con normas imperativas.
4. **Citas**: verifica todas las referencias normativas del documento final.

#### 4. realestate-closing
**Propósito**: operación inmobiliaria en España.
**Pipeline**: investigador -> inmobiliario -> compliance -> redactor
**Pasos**:
1. **Investigación**: revisa la normativa aplicable (CC, LAU, suelo) y jurisprudencia.
2. **Inmobiliario**: analiza cargas, nota simple, licencias y planeamiento urbanístico.
3. **Compliance**: comprueba aprobaciones necesarias (plusvalía, ITP/AJD, licencias).
4. **Redacción**: prepara los documentos de la operación (contrato de compraventa, arras).

#### 5. custom
**Propósito**: secuencia de agentes definida por el usuario.
**Pipeline**: el usuario especifica el orden de agentes.

## Tus Flujos Guardados

Primero resuelve el `user_id` (ver arriba). Luego llama al tool `list_workflows` con ese `user_id` e `include_public: true`.

Presenta los flujos devueltos en el mismo formato numerado que las plantillas fijas (slug, nombre, descripción), numerados a continuación de las fijas. Si la llamada devuelve una lista vacía o falla (p. ej. servidor inalcanzable), omite esta subsección por completo sin comentarla.

Cuando el usuario seleccione un flujo guardado o invoque `/workflow <slug>`, llama al tool `get_workflow` con el mismo `user_id` y el `slug` elegido, y ejecuta la `pipeline` devuelta con la lógica de ejecución por etapas siguiente — idéntica a una plantilla fija. Cada `agent_id` de la pipeline nombra un agente del plugin, `purpose` describe su tarea y `checkpoint: true` significa pausar para confirmación del usuario tras esa etapa.

### Gestión (list / show / delete)

- `/workflow list` — resuelve `user_id`, llama a `list_workflows` y muestra la tabla (slug, nombre, descripción, visibilidad, versión, actualizado).
- `/workflow show <slug>` — resuelve `user_id`, llama a `get_workflow` y muestra el flujo completo: nombre, descripción, `output_spec`, pipeline numerada (agente — propósito — checkpoint) y versión.
- `/workflow delete <slug>` — resuelve `user_id`, llama a `get_workflow` para confirmar que existe y es del usuario, muestra nombre y descripción, y **pide confirmación explícita** antes de llamar al tool `delete_workflow`. Es una operación destructiva e irreversible.

## Ejecutar el Workflow

### Inicialización

1. Confirma con el usuario la plantilla o flujo seleccionado y los parámetros.
2. Identifica jurisdicción (estatal o autonómica/CCAA), lengua y requisitos especiales.
3. Informa del pipeline planificado:

```
Workflow: [nombre de plantilla o slug]
Pipeline: [agente1] -> [agente2] -> [agente3] -> [agente4]
Jurisdicción: [Estatal / CCAA]
Lengua: [ES/EN]
Pasos estimados: [número]
```

### Ejecución por Etapas

Para cada etapa de la pipeline:

1. Ejecuta el análisis del agente usando como entrada el output de la etapa anterior. Despacha el agente con su nombre con ámbito vía Task (p. ej. `bettercallclaude-espana:spanish-legal-researcher`).
2. Registra el progreso en el archivo de estado y reporta en chat:

```
[check] Paso [N]/[total]: [Nombre del agente] -- completado
   Hallazgo clave: [resumen de una línea]
```

3. En las etapas con checkpoint (recomendaciones estratégicas, umbrales de riesgo, borradores de documentos), pausa para confirmación del usuario antes de continuar.
4. Escribe el output de cada etapa como archivo en `bcc-output/workflow/<user_id>/<slug>/` (ver «Workflow execution conventions» en `skills/shared/SKILL.md`).

### Reanudación (--resume)

Si el usuario invoca `/workflow <slug> --resume` (o `--resume` tras seleccionar un flujo guardado):

1. Lee el archivo de estado `bcc-output/workflow/<user_id>/<slug>/progress.json`.
2. Si existe y registra pasos `completed`, salta las etapas ya completadas y reanuda desde la primera no completada (o desde `--paso=N` si se indica).
3. Si no existe ningún estado, informa de que no hay ejecución previa y comienza desde el paso 1.
4. Un paso se considera completado solo si su archivo de output existe Y `progress.json` lo marca `completed`.

### Pase de Datos

Cada output de agente alimenta al siguiente:

- Hallazgos de investigación -> entrada de estrategia (precedentes, marco legal)
- Recomendación de estrategia -> entrada de riesgo (solidez de la posición, vía procesal)
- Evaluación de riesgo -> entrada del redactor (contexto de riesgo, parámetros de coste)
- Todas las etapas -> compilación del informe final

## Formato de Salida

Escribe todos los outputs en `bcc-output/workflow/<user_id>/<slug>/` siguiendo la convención de `skills/shared/SKILL.md`. En chat, muestra solo un resumen por etapa y la ruta a los archivos escritos.

```
## Informe de Workflow: [Nombre]

### Resumen del Pipeline
- Plantilla/Flujo: [nombre]
- Pasos completados: [N/total]
- Jurisdicción: [Estatal / CCAA]
- Lengua: [lengua]

### Etapa 1: [Nombre del agente]
[hallazgos clave de esta etapa]

### Etapa 2: [Nombre del agente]
[hallazgos clave de esta etapa]

### Recomendación Combinada
[síntesis de todas las etapas en una recomendación accionable]

### Aviso Profesional
Este output ha sido generado por una herramienta de IA que coordina varios agentes analíticos.
Todos los hallazgos requieren revisión y validación por un abogado cualificado antes de su uso
en procedimientos o entregables a clientes.
```

## Definición de Workflow Personalizado

Si el usuario especifica `--custom` o una lista explícita de agentes, construye una pipeline desde su especificación:

```
/bettercallclaude-espana:workflow --custom investigador,compliance,fiscal,redactor "Estructuración fiscal transfronteriza"
```

Valida que los agentes solicitados existan y que el flujo de datos entre ellos sea lógico. Si la secuencia no tiene sentido, sugiere un reordenamiento. Para flujos reutilizables persistentes, recomienda `/bettercallclaude-espana:create-workflow`.

## Estándares de Calidad

- Cada etapa debe completarse antes de que empiece la siguiente (secuencial por defecto).
- Checkpoint en cada etapa que produzca una recomendación estratégica.
- Nunca saltes una etapa sin confirmación del usuario.
- Mantén la precisión de las citas en todas las etapas.
- El output final debe sintetizar todas las etapas, no limitarse a concatenarlas.
- Las pipelines multi-agente (3+ agentes) deberían resumir el output final vía el agente summarizer.

## Aviso de Servicio

Si el servidor `workflows-esp` no está disponible o un tool devuelve `not_implemented`, dilo con claridad: la funcionalidad de flujos persistentes requiere la integración completa del servidor, que se publica en una próxima release. Las plantillas fijas de este comando siguen funcionando sin el servidor.

---

## Consulta del Usuario

$ARGUMENTS
