# Playbook Local — BetterCallClaude España

> Copia este archivo en la carpeta `.claude/` del proyecto (Claude Code) o en la carpeta compartida (Cowork Desktop) y renómbralo a `bettercallclaude-espana.local.md` (elimina la extensión `.example`). Personaliza las secciones siguientes para tu despacho. Este playbook es solo orientativo y no sustituye el criterio profesional del letrado.

## Instrucciones de uso

- **Ubicación preferida (Claude Code)**: copia el archivo en la carpeta `.claude/` del proyecto y renómbralo a `bettercallclaude-espana.local.md`. Se aplica automáticamente a las sesiones que abran ese proyecto.
- **Ubicación alternativa (Cowork Desktop)**: copia el archivo en la carpeta compartida de BetterCallClaude y renómbrarlo igual. Aplica a todas las conversaciones iniciadas en ese entorno.
- **No contiene secretos**: este playbook no almacena claves API, tokens ni credenciales. Para datos sensibles usa los modos de privacidad (ver `## Privacidad y Secreto Profesional`).
- **Cambiar modo de privacidad**: ejecuta `/bettercallclaude-espana:privacidad --set <estricto|equilibrado|nube>` tras instalar el playbook. El archivo `~/.betterask/config.yaml` solo puede *elevar* la protección (guarda el modo `strict`): el modo `nube` no se activa desde el archivo local — requiere la configuración de usuario de Cowork Desktop (`CLAUDE_PLUGIN_USER_CONFIG`).
- **Regenerar**: tras cada versión principal revisa esta plantilla por cambios en comandos, hooks o flujos de trabajo.

## Perfil del despacho

- **Nombre**: [Nombre del despacho]
- **Sede principal**: [Ciudad]
- **Tipo**: [p. ej. individual, boutique, gran firma]
- **Comunidades autónomas de actuación habitual**: [p. ej. Madrid, Cataluña, Andalucía, País Vasco, Valencia]
- **Idiomas de trabajo**: ES, EN (opcionalmente CA, GL, EU, FR, DE, IT)

## Posiciones contractuales estándar

- **Ley aplicable**: Derecho español (con exclusión expresa de la Convención de Viena de 1980 sobre compraventa internacional de mercaderías, ex art. 6 del propio Convenio).
- **Foro competente**: Tribunales de [ciudad], con sumisión expresa (art. 55 LEC).
- **Tope de responsabilidad**: [importe o referencia, p. ej. importe máximo del contrato].
- **Cláusula penal**: arts. 1152 y 1154 CC. El art. 1152 CC establece que la pena sustituye a la indemnización salvo pacto en contrario; el art. 1154 CC permite la moderación judicial cuando la obligación se ha cumplido parcialmente o con cumplimiento irregular. Máximo recomendado: [X]% del valor del contrato.
- **Cláusula resolutoria expresa**: art. 1124 CC — siempre incluida, con detalle de los incumplimientos graves que la activan.
- **NDA — duración máxima recomendada**: 5 años (práctica habitual del mercado; no existe límite legal general en Derecho español).
- **NDA tipo preferido**: bilateral, con obligaciones recíprocas y exclusión de información pública, conocida o desarrollada de forma independiente.
- **Exclusión CISG**: indicar expresamente la exclusión del Convenio de Viena 1980 cuando las partes sean ambas residentes en Estados contratantes (art. 6 del Convenio).

## Umbrales de riesgo

- **Valor a partir del cual se requiere revisión humana obligatoria**: > EUR [importe].
- **Cláusulas que requieren escalamiento inmediato**:
  - Renuncia a derechos irrenunciables del trabajador o del consumidor.
  - Garantías ilimitadas o indemnizaciones sin tope.
  - Limitación de responsabilidad por dolo o culpa grave (art. 1102 CC, no disponible convencionalmente).
  - Renuncia o modificación del saneamiento por vicios ocultos (arts. 1484, 1485 y 1490 CC): los plazos y derechos son inderogables en perjuicio del adquirente, sin perjuicio de la exoneración del art. 1485 CC cuando el vendedor desconocía los vicios y no ha prestado declaración expresa de garantía.
  - No-competencia postcontractual: revisar límites del art. 21.2 ET (relación laboral) y el principio general del art. 1255 CC (autonomía de la voluntad, sin contravenir normas imperativas).
  - Sumisión a fuero extranjero o arbitraje con sede fuera de España.
  - Contratación con consumidores: aplicación imperativa del TRLGDCU (RDL 1/2007) y de la LCGC (Ley 7/1998); las cláusulas abusivas no son válidas.

## Privacidad y secreto profesional

- **Modos de privacidad disponibles** (configurar con `/bettercallclaude-espana:privacidad --set <modo>`):
  - **estricto** — secreto profesional reforzado (art. 542.3 LOPJ, art. 199.2 CP): el hook `privacy-check` deniega automáticamente las llamadas salientes (MCP, WebFetch, Bash con red) cuyo contenido active un marcador procesal del art. 437 LEC. Ollama queda exento. Para garantía plena de aislamiento local, configure también el proceso Cowork Desktop sin acceso a red.
  - **equilibrado** (modo por defecto) — privacidad reforzada con verificación previa; adecuado para la mayoría de procedimientos.
  - **nube** — habilita APIs en la nube; úsalo solo con datos no cubiertos por secreto profesional o con consentimiento expreso del cliente.
- **Modelo local recomendado**: Ollama (MCP `ollama`) para datos especialmente sensibles; verificar que no haya filtraciones externas.
- **Normativa aplicable**: RGPD (UE 2016/679) + LOPDGDD (Ley Orgánica 3/2018).
- **Rol habitual del despacho**: [responsable / encargado del tratamiento].
- **DPO**: [sí / no / no obligatorio].
- **Transferencias internacionales fuera del EEE**: requieren garantías adecuadas (arts. 44 y ss. RGPD); documentar SCC, DPF o decisión de adecuación correspondiente.

## Flujos de trabajo preferidos

- **Plantillas de flujo activadas por defecto**: [p. ej. `litigation-prep`, `due-diligence`, `contract-lifecycle`, `realestate-closing`].
- **Estado persistente por usuario**: `user_id` `[user_id]` para reanudar cronologías, expedientes y borradores entre sesiones.
- **Carpeta de salida por defecto**: `bcc-output/` en la raíz del proyecto.

## Plantillas de comandos

- **Comandos de uso frecuente**:
  - `/bettercallclaude-espana:borrador` — borrador inicial de escritos y contratos.
  - `/bettercallclaude-espana:analizar-doc` — análisis estructurado de documentos.
  - `/bettercallclaude-espana:cita` y `/bettercallclaude-espana:precedente` — citas y jurisprudencia.
  - `/bettercallclaude-espana:investigacion` — búsqueda de doctrina y normativa.
  - `/bettercallclaude-espana:cronologia-legal` — línea cronológica de un expediente.
  - `/bettercallclaude-espana:bucle-legal` — razonamiento iterativo sobre una cuestión jurídica.
  - `/bettercallclaude-espana:triage-nda` — triage de confidencialidad (NDA).
  - `/bettercallclaude-espana:privacidad` — configuración del modo de privacidad.
  - `/bettercallclaude-espana:validar`, `/bettercallclaude-espana:refinar`, `/bettercallclaude-espana:resumir`, `/bettercallclaude-espana:traducir`.
- **Lista completa**: ejecuta `/bettercallclaude-espana:ayuda` para ver todos los comandos disponibles en la versión instalada.
- **Comandos de uso excepcional** (verifica jurisdicción antes de usarlos):
  - `/bettercallclaude-espana:federal` — solo para jurisdicciones federales (México, EE. UU., Brasil, etc.); no aplica en España.
  - `/bettercallclaude-espana:autonomico` — solo cuando la cuestión dependa de derecho autonómico propio (CCAA con competencias exclusivas).

## Notas internas

- [Notas internas, observaciones y particularidades del despacho, p. ej. instrucciones internas para cumplimiento normativo, criterios de honorarios, criterios de derivación a procurador, etc.]

## Estilo y formato

- **Formato de citación de jurisprudencia**: `STS, Sala [X], de [fecha], núm. [número] — [ECLI]`.
- **Formato de citación de normativa**: `Ley/Real Decreto/Reglamento (UE) núm. [X], art. [Y]`.
- **Formato de citación doctrinal**: `APELLIDO, Nombre. Título. Editorial, año, p. [página]`.
- **Formato de salida**: Markdown, con encabezados jerarquizados y listas ordenadas cuando proceda.
- **Idioma de las citas**: Español (original o traducción propia indicando la fuente).
- **Carpeta de salida**: `bcc-output/` (configurable).
- **Extensión preferida para borradores extensos**: medio (resumido para vista rápida, ampliado cuando se solicite).
