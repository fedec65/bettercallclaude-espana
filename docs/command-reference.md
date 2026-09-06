# Referencia de Comandos — BetterCallClaude España

Referencia completa de los **29 comandos activos** del plugin BetterCallClaude España en v2.0, agrupados por categoría, con su sintaxis y sus flags. Complementa a `INSTALACION.md` (instalación, playbook local y tabla de renombrado v1.x → v2.0) y a `docs/PLAYBOOK.md` (uso práctico y flujos recomendados).

## Sintaxis de los comandos

Todos los comandos se invocan como subcomandos del plugin. La forma canónica con el prefijo completo es `/bettercallclaude-espana:<comando>` (la que usan los archivos de `commands/`); en este documento se usa la forma corta `/comando` para facilitar la lectura, igual que en el playbook.

```
/comando "consulta o instrucción en lenguaje natural" [--flag=valor]
```

- El texto entre comillas describe la tarea en lenguaje natural; los comandos aceptan también **equivalentes en lenguaje natural** de sus flags (p. ej. "en inglés" equivale a `--lang=EN` en `/mapa-legal`).
- Los flags son opcionales salvo que se indique lo contrario; cada comando declara su sintaxis en su propia entrada de `commands/`.

## Índice por categoría

| Categoría | Comandos |
|---|---|
| [Gateway y orquestación](#gateway-y-orquestacion) | `legal`, `legal-5step`, `briefing`, `workflow` |
| [Investigación](#investigacion) | `investigacion`, `precedente`, `federal`, `autonomico` |
| [Estrategia y análisis adversarial](#estrategia-y-analisis-adversarial) | `estrategia`, `analisis-adversarial` |
| [Producción de documentos](#produccion-de-documentos) | `borrador`, `traducir`, `resumir` |
| [Citas y validación](#citas-y-validacion) | `cita`, `validar`, `analizar-doc` |
| [Especialistas](#especialistas) | `mapa-legal`, `percurso-legal`, `objetivo-legal`, `bucle-legal`, `cronologia-legal`, `triage-nda` |
| [Onboarding y configuración](#onboarding-y-configuracion) | `start`, `doctor`, `configurar` |
| [Meta](#meta) | `ayuda`, `version`, `refinar`, `privacidad` |

## Gateway y orquestación

### `/legal` — pasarela principal

Clasifica la intención de la consulta, resuelve la jurisdicción aplicable (estatal / autonómica y CCAA) y enruta al agente, comando o flujo especializado. Solo usa agentes, skills y servidores MCP del plugin.

- `/legal "consulta"` — ejecución por defecto (marco de 5 pasos).
- `/legal --briefing "Recurso de casación contra SAP de Barcelona sobre Art. 1255 CC"` — reúne antes el panel de especialistas.
- `/legal --refine "Me han desahuciado, ¿qué hago?"` — estructura la consulta vía diálogo socrático antes de ejecutar.
- `/legal --map=expediente-mercantil "trabaja el siguiente ticket del mapa"` — enruta a `/percurso-legal`.

Flags: `--refine`, `--briefing`, `--skip-briefing` / `--direct` (ejecución directa sin briefing), `--no-framework` (una sola tarea sin el marco de 5 pasos), `--map=<slug-o-ruta>`.

### `/legal-5step` — marco de 5 pasos

Ejecuta el marco completo de extremo a extremo para asuntos de derecho español: **intake → investigación → estrategia → análisis adversarial → borrador**, con verificación de citas en la fase final.

- `/legal-5step "Contrato de arrendamiento de local comercial en Barcelona, 5 años, renta 3.000 EUR/mes"`
- `/legal-5step --skip-adversarial "…"` — salta el paso 4 si hay prisa.

Flags: `--skip-research` (el usuario aporta la investigación), `--skip-adversarial`, `--output-format=markdown|docx-ready|plain text`.

### `/briefing` — briefing previo

Prepara un briefing estructurado antes de la ejecución: reúne un panel de especialistas y fija el contexto del asunto, el plazo y el plan de trabajo.

- `/briefing "Preparar briefing para demanda por responsabilidad civil contra Administración, plazo 20 días, Juzgado Contencioso-Administrativo de Sevilla"`

### `/workflow` — flujos multi-agente

Orquesta flujos multi-agente para asuntos complejos que requieren coordinación de varios especialistas. Cuatro flujos predefinidos: **due diligence** (`due-diligence`), **preparación de litigio** (`litigation-prep`), **ciclo de vida del contrato** (`contract-lifecycle`) y **cierre inmobiliario** (`realestate-closing`).

- `/workflow due-diligence "Due diligence de empresa tecnológica en Madrid, adquisición del 100% del capital social"`
- `/workflow litigation-prep "Preparar demanda por nulidad de cláusula suelo, Banco Santander, Juzgado de Primera Instancia nº 12 de Madrid"`
- `/workflow realestate-closing "Compra de vivienda en Barcelona, 650.000 EUR, con hipoteca BBVA"`

## Investigación

### `/investigacion` — investigación jurídica

Busca precedentes (STS, SAP, STC) y normativa, y elabora memorandos de investigación con formato de cita correcto.

- `/investigacion "Jurisprudencia del TS sobre interpretación del Art. 1255 CC en contratos de arrendamiento urbano"`

### `/precedente` — cadena de precedentes

Busca y analiza precedentes siguiendo la cadena: evolución jurisprudencial, posibles overrulings y precedentes aplicables al caso.

- `/precedente "Evolución jurisprudencial del TS sobre cláusulas abusivas en contratos de consumo, Art. 82 TRLGDCU"`

### `/federal` — derecho estatal

Cuestión bajo derecho estatal (a pesar del nombre histórico, España no es un Estado federal): CC, CP, LEC, CE y demás normas estatales.

- `/federal "Competencia objetiva en materia civil, Art. 10 LEC y jurisprudencia del TS"`

### `/autonomico` — derecho autonómico

Cuestión bajo el derecho de una CCAA concreta: normativa autonómica, derecho foral y jurisprudencia del correspondiente TSJ.

- `/autonomico "Derecho civil foral navarro en materia sucesoria, Art. 18 del Fuero Nuevo"`

## Estrategia y análisis adversarial

### `/estrategia` — estrategia procesal

Define la estrategia procesal conforme a la LEC: vía procesal, riesgos, análisis coste-beneficio (EUR) y plan de acción recomendado.

- `/estrategia "Procedimiento monitorio vs. juicio verbal para reclamación de 8.000 EUR"`

### `/analisis-adversarial` — análisis de tres agentes

Tres agentes: el abogado construye el caso, el adversario lo impugna y el analista judicial sintetiza ambas posiciones con evaluación de probabilidades y pasos recomendados.

- `/analisis-adversarial "…"` — salida: escrito del abogado, respuesta del adversario y síntesis judicial.

## Producción de documentos

### `/borrador` — redacción de documentos

Redacta contratos, escritos procesales (demanda, recurso, escrito) e informes con formato de cita correcto y estándares de redacción del plugin.

- `/borrador "Demanda por resolución de contrato de arrendamiento por incumplimiento, Art. 1124 CC, Juzgado de Primera Instancia de Barcelona"`

### `/traducir` — traducción ES ↔ EN

Traduce entre español e inglés preservando la precisión de la terminología jurídica. Indica la dirección en la consulta.

- `/traducir ES→EN "Traducir escrito de recurso de apelación contra SAP Madrid, Sección 15ª, 234/2023"`
- `/traducir EN→ES "Translate this NDA and employment agreement for use under Spanish law (CC, ET)"`

### `/resumir` — consolidación de salidas

Consolida la salida de pipelines multiagente: deduplica, estructura y controla la extensión.

- `/resumir --short "[pegar salida multiagente]"` — resumen ejecutivo de 1-2 párrafos con las 3 acciones principales.
- `/resumir --medium "Resumir análisis adversarial sobre demanda por cláusula suelo"` — por defecto: secciones, hallazgos y recomendaciones.
- `/resumir --long "Consolidar resultados de due diligence de empresa en Madrid"` — consolidación completa con razonamiento y plan de acción.

Flags: `--short`, `--medium` (por defecto), `--long`.

## Citas y validación

### `/cita` — verificación y formato de citas

Verifica y formatea citas: STS, SAP, STC, BOE y referencias a artículos. Se indica la operación en la consulta ("Verificar:", "Formatear:").

- `/cita "Verificar: STS 1ª de 12 de marzo de 2019"`
- `/cita "Art. 1255 código civil"`

### `/validar` — validación por lotes

Valida listas de citas por lotes: formato, existencia y coherencia.

- `/validar "Art. 1255 CC; STS 1ª de 12-03-2019; SAP Madrid 345/2018; BOE núm. 123 de 20-05-2020"`

### `/analizar-doc` — análisis de documentos

Analiza un documento: identifica problemas, extrae cláusulas, verifica citas y evalúa el cumplimiento normativo.

- `/analizar-doc "Analizar contrato de franquicia, verificar cláusulas de exclusividad y territorio bajo el CC y jurisprudencia del TS"`

## Especialistas

### `/mapa-legal` — mapa decisional (wayfinder)

Traza una práctica grande o nebulosa como **mapa decisional** (archivo de mapa + tickets); solo planifica, no resuelve: ese es el trabajo de `/percurso-legal`. Salida en `bcc-output/YYYY-MM-DD-<slug>/wayfinder/map.md`.

- `/mapa-legal "práctica"` — flags: `--privacy=strict|balanced|cloud`, `--lang=ES|EN`, `--region=XX` (código de CCAA, p. ej. `MD`, `CT`, `PV`).

### `/percurso-legal` — ticket de un mapa

Trabaja un ticket de un mapa decisional existente: reclama un ticket de frontera y lo resuelve por tipo (research / grilling / prototype / task).

- `/percurso-legal "trabaja el siguiente ticket del mapa"` — flags: `--map=<slug-o-ruta>`, `--gate` (ejecuta bajo el bucle worker-evaluador), `--list` (lista los mapas y se detiene).

### `/objetivo-legal` — Goal Record

Define una condición de éxito verificable y produce un **Goal Record** persistido; nunca inicia trabajo por sí mismo.

- `/objetivo-legal --target=<ruta> "objetivo"` — flags: `--target=<ruta>`, `--max-iteraciones=N` (default 5, tope 20), `--evaluador=<agente>`, `--privacy=<modo>`.

### `/bucle-legal` — bucle worker-evaluador

Cicla trabajo + veredicto contra un Goal Record hasta alcanzar el éxito o el límite de iteraciones, dejando un trail de veredictos verificable.

- `/bucle-legal "objetivo"` — flags: `--max-iteraciones=N`, `--prueba-seca` (una sola iteración), `--reanudar` (reanuda un bucle anterior), `--verboso` (veredictos completos en chat).

### `/cronologia-legal` — cronología del caso

Construye la cronología documentada del caso: cada evento con su fuente obligatoria. En chat muestra solo un resumen de 3-5 líneas; los artefactos van en `bcc-output/cronologia/`.

- `/cronologia-legal "documentos del caso"` — flags: `--lang=<es|cat|eus|gl|en|fr|de>`, `--from=<fecha>` / `--to=<fecha>` (ventana temporal), `--parties=<A,B,…>`, `--deadlines` (marcadores de plazo etiquetados como indicativos), `--format=<table|visual|docx|all>` (por defecto `all`), `--merge` (actualiza un `events.json` existente).

### `/triage-nda` — clasificación de NDA

Clasifica uno o más NDA según el derecho español y el playbook local: **GREEN** (aprobación estándar), **YELLOW** (revisión legal recomendada) o **RED** (problemas sustanciales). Modo lote si se pasa una carpeta; sin playbook local aplica los defaults españoles.

- `/triage-nda "ruta del archivo o carpeta con los NDA"`

## Onboarding y configuración

### `/start` — bienvenida y onboarding

Comando de onboarding para usuarios nuevos y recurrentes: detecta el idioma, verifica la conectividad MCP, guía la creación del playbook local (`bettercallclaude-espana.local.md`) y muestra ejemplos según el perfil (despacho, in-house, asesoría fiscal-contable).

- `/start`

### `/doctor` — diagnóstico de servidores MCP

Diagnostica el estado de todos los servidores MCP del plugin y explica el resultado en lenguaje sencillo, con correcciones sugeridas si algo falla.

- `/doctor`

### `/configurar` — conectividad MCP

Comprueba la conectividad de los servidores MCP y muestra su estado.

- `/configurar --verbose`

## Meta

### `/ayuda` — referencia completa

Muestra la referencia completa del plugin: comandos, agentes, skills, servidores MCP y ejemplos, con filtros.

- `/ayuda`, `/ayuda --commands`, `/ayuda --agents`, `/ayuda --skills`

### `/version` — versión del plugin

Muestra la versión del plugin, los componentes instalados y el estado del sistema.

- `/version`, `/version --json`

### `/refinar` — refinamiento de consultas

Transforma consultas vagas o imprecisas en prompts estructurados mediante diálogo socrático, introduciendo la terminología jurídica española correcta.

- `/refinar "Me han desahuciado, ¿qué hago?"`

### `/privacidad` — modo de privacidad

Consulta o cambia el modo de privacidad del plugin (`strict`, `balanced`, `cloud`); los ajustes se guardan en `~/.betterask/config.yaml`.

- `/privacidad`, `/privacidad --set strict`, `/privacidad --set balanced`, `/privacidad --set cloud`

## Comandos deprecados (alias v1.x)

Los 15 nombres v1.x siguen activos como **alias deprecados**: al invocarlos, el plugin avisa «DEPRECADO — usa `/…` en su lugar». Se eliminarán en **v2.1.0**. La misma tabla figura en `INSTALACION.md` §4; actualiza los flujos guardados de tus proyectos antes de esa versión.

| Alias v1.x (deprecado) | Comando v2.0 |
|---|---|
| `adversarial` | `analisis-adversarial` |
| `autonomic` | `autonomico` |
| `cite` | `cita` |
| `doc-analyze` | `analizar-doc` |
| `draft` | `borrador` |
| `help` | `ayuda` |
| `precedent` | `precedente` |
| `privacy` | `privacidad` |
| `refine` | `refinar` |
| `research` | `investigacion` |
| `setup` | `configurar` |
| `strategy` | `estrategia` |
| `summarize` | `resumir` |
| `translate` | `traducir` |
| `validate` | `validar` |
