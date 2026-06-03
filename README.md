[![Versión](https://img.shields.io/badge/version-1.0.0-blue)](https://github.com/fedec65/bettercallclaude-espana/releases)
[![Licencia: AGPL-3.0](https://img.shields.io/badge/license-AGPL--3.0-green)](LICENSE)
[![Plataforma](https://img.shields.io/badge/platform-Cowork%20Desktop-orange)](https://claude.ai)
[![Web](https://img.shields.io/badge/web-bettercallclaude.es-brightgreen)](https://bettercallclaude.es)
[![Servidores MCP](https://img.shields.io/badge/MCP%20servers-12-purple)](https://mcp.bettercallclaude.es/health)

<p align="center">
  <img src="docs/images/bettercallclaude_logo.png" alt="Mejor llamaré Claude" width="480">
</p>

<p align="center"><strong>Plugin de inteligencia jurídica española para Cowork Desktop</strong></p>

BetterCallClaude España transforma la investigación jurídica, la estrategia procesal y la redacción documental para abogados y despachos españoles. Integra bases de datos jurídicas españolas, análisis bilingüe (ES/EN) y protección del *secreto profesional* — 20 agentes, 21 comandos, 15 skills y 12 servidores MCP para jurisprudencia TS/STS/AP/STC, legislación BOE, doctrina académica, estrategia de litigios, análisis adversarial, verificación de citas y arbitraje deportivo en las 17 Comunidades Autónomas.

> **Usuarios de Claude Code CLI**: este repositorio es para Cowork Desktop. La versión CLI está en [fedec65/bettercallclaude-cli](https://github.com/fedec65/bettercallclaude-cli).

---

## Visión general

BetterCallClaude España proporciona una metodología estructurada para gestionar trabajo jurídico con asistencia de IA. El framework coordina investigación, análisis, estrategia, revisión adversarial y redacción final.

![BetterCallClaude Framework](docs/images/bettercallclaude_framework.png)

---

## Novedades en v1.0.0

**v1.0.0 — Primera versión para España.** Adaptación completa del plugin BetterCallClaude al entorno jurídico español.

- **20 agentes especializados** para las principales áreas del derecho español
- **21 comandos** para investigación, estrategia, redacción, citas, análisis y workflows
- **15 skills** con conocimiento jurídico reutilizable
- **12 servidores MCP** en `.mcp.json` (11 remotos HTTP + `ollama` local STDIO)
- **Protección de secreto profesional** con hook local antes del uso de herramientas externas

**Contenido**: 20 agentes, 21 comandos, 15 skills y 12 servidores MCP.

---

## Instalación

1. En Cowork, haz clic en **Personalizar** > **Explorar plugins** > **Personales** > **+** > **Añadir marketplace desde GitHub**
2. Introduce `fedec65/bettercallclaude-espana` y haz clic en **Sincronizar**
3. Haz clic en **Instalar** en la tarjeta BetterCallClaude España

Los servidores MCP se conectan automáticamente por HTTP. No se requiere configuración local ni claves API para los servidores remotos.

---

## Comandos

| Comando | Descripción |
|---------|-------------|
| `/bettercallclaude-espana:legal` | Gateway inteligente: analiza la intención, enruta al agente especialista y gestiona workflows. |
| `/bettercallclaude-espana:refine` | Convierte consultas vagas en prompts jurídicos estructurados mediante diálogo socrático. |
| `/bettercallclaude-espana:research` | Busca precedentes españoles y compila memorandos de investigación. |
| `/bettercallclaude-espana:strategy` | Estrategia procesal con evaluación de riesgos, costes y probabilidad de éxito. |
| `/bettercallclaude-espana:draft` | Redacta contratos, escritos judiciales, opiniones y documentos jurídicos españoles. |
| `/bettercallclaude-espana:cite` | Verifica y formatea citas españolas (STS, SAP, STC, BOE). |
| `/bettercallclaude-espana:validate` | Valida citas jurídicas españolas en lote. |
| `/bettercallclaude-espana:precedent` | Busca y analiza jurisprudencia TS/STS/STC con seguimiento de cadenas jurisprudenciales. |
| `/bettercallclaude-espana:federal` | Analiza conforme al derecho estatal español (CC, CP, LEC, LOPJ, CE). |
| `/bettercallclaude-espana:autonomic` | Analiza normativa autonómica para una Comunidad Autónoma específica. |
| `/bettercallclaude-espana:adversarial` | Análisis adversarial con tres agentes: abogado, contraparte y analista judicial. |
| `/bettercallclaude-espana:briefing` | Briefing previo con panel de especialistas y plan de ejecución. |
| `/bettercallclaude-espana:workflow` | Workflows multiagente para due diligence, preparación de litigios y ciclo contractual. |
| `/bettercallclaude-espana:translate` | Traducción jurídica ES ↔ EN preservando terminología y citas. |
| `/bettercallclaude-espana:doc-analyze` | Analiza documentos jurídicos españoles: riesgos, cláusulas, citas y cumplimiento. |
| `/bettercallclaude-espana:summarize` | Consolida resultados de pipelines multiagente. |
| `/bettercallclaude-espana:setup` | Comprueba conectividad MCP. |
| `/bettercallclaude-espana:version` | Muestra versión, componentes y estado del sistema. |
| `/bettercallclaude-espana:legal-5step` | Ejecuta el framework de 5 pasos: intake → investigación → estrategia → adversarial → borrador. |
| `/bettercallclaude-espana:privacy` | Consulta o cambia el modo de privacidad (`strict` / `balanced` / `cloud`). |
| `/bettercallclaude-espana:help` | Muestra referencia de comandos, agentes, skills y ejemplos. |

### Skills

| Skill | Descripción |
|-------|-------------|
| `legal-5step-framework` | Coordina el pipeline de 5 pasos, controla el flujo de datos y gestiona quality gates. |

### Ejemplos de uso

```
/bettercallclaude-espana:legal Necesito evaluar nuestra exposición bajo el Art. 1255 CC por incumplimiento contractual

/bettercallclaude-espana:refine Tengo problemas con mi arrendador

/bettercallclaude-espana:research Art. 1101 CC responsabilidad contractual por incumplimiento

/bettercallclaude-espana:strategy Disputa de arrendamiento comercial en Madrid, arrendador reclama EUR 200k

/bettercallclaude-espana:draft Contrato de trabajo para ingeniero de software en Barcelona, bilingüe ES/EN

/bettercallclaude-espana:adversarial ¿Es exigible la cláusula de no competencia en este contrato de trabajo?

/bettercallclaude-espana:workflow litigation-prep Reclamación por daños personales contra fabricante

/bettercallclaude-espana:briefing Preparar litigio completo por incumplimiento del Art. 1255 CC, EUR 500K, Madrid

/bettercallclaude-espana:autonomic MD Competencia del Juzgado de Primera Instancia para disputas contractuales

/bettercallclaude-espana:doc-analyze @contrato.pdf Revisar este contrato de arrendamiento comercial
```

---

## Funcionalidades clave

- **Sesiones de briefing** — Las consultas complejas activan intake colaborativo con paneles de especialistas y planes estructurados.
- **Análisis adversarial** — Workflow con abogado, contraparte y analista judicial según metodología jurídica española.
- **Workflows multiagente** — Pipelines para due diligence, preparación de litigios, contratos y análisis documental.
- **Cobertura de las 17 CCAA** — Soporte autonómico con jurisdicciones, formatos de cita y búsqueda MCP.
- **Bilingüe ES/EN** — Detección de idioma y terminología jurídica adecuada.

---

## Servidores MCP

Todos los servidores se conectan automáticamente tras la instalación.

| Servidor | Finalidad | Transporte |
|----------|-----------|------------|
| `boe-legislacion` | Legislación estatal española | HTTP |
| `legal-citations-esp` | Verificación y formato de citas jurídicas | HTTP |
| `legal-persona-esp` | Inteligencia documental jurídica española | HTTP |
| `cendoj-jurisprudencia` | Jurisprudencia española | HTTP |
| `tribunal-constitucional` | Sentencias del Tribunal Constitucional | HTTP |
| `eu-law-esp` | Derecho de la Unión Europea en contexto español | HTTP |
| `congreso-debates` | Debates y actividad parlamentaria | HTTP |
| `doctrina-academica` | Doctrina académica jurídica | HTTP |
| `derecho-historico` | Derecho histórico español | HTTP |
| `catalunya-legal` | Derecho catalán y fuentes autonómicas | HTTP |
| `busqueda-general` | Búsqueda jurídica general | HTTP |
| `ollama` | Clasificación local de privacidad para secreto profesional | Local |

Los 11 servidores HTTP remotos se conectan a `https://mcp.bettercallclaude.es`. No requieren claves API.

Consulta [CONNECTORS.md](bettercallclaude-espana/CONNECTORS.md) para la documentación técnica de las APIs MCP.

---

## Privacidad

BetterCallClaude España incluye detección integrada de *secreto profesional*. Un hook `PreToolUse` analiza llamadas salientes a herramientas para detectar indicadores de confidencialidad en español e inglés.

| Modo | Comportamiento |
|------|----------------|
| `strict` | Bloquea marcadores fuertes. El contenido no privilegiado pasa. Ollama queda exento. |
| `balanced` | Pide confirmación ante marcadores fuertes y señales débiles con contexto jurídico. Predeterminado. |
| `cloud` | Pide confirmación solo ante marcadores fuertes. Las señales débiles pasan sin confirmación. |

> **Aviso**: el enrutamiento de privacidad es asistivo y no garantiza cumplimiento normativo. Los abogados mantienen la responsabilidad profesional de proteger la confidencialidad del cliente.

---

## Idiomas

| Idioma | Código | Contexto jurídico |
|--------|--------|-------------------|
| Español | ES | Principal: CC, CP, LEC, STS, STC, BOE. |
| Inglés | EN | Idioma de trabajo con mapeo de terminología jurídica española. |

---

## Requisitos

- Claude Cowork Desktop actualizado
- Node.js >= 18 solo para el clasificador local de privacidad Ollama

---

## Versión CLI

¿Prefieres trabajar desde terminal? **[BetterCallClaude CLI](https://github.com/fedec65/bettercallclaude-cli)** es la edición para Claude Code CLI.

---

## Autor

Federico Cesconi — [fedec65/bettercallclaude-espana](https://github.com/fedec65/bettercallclaude-espana) — [bettercallclaude.es](https://bettercallclaude.es)

## Licencia

AGPL-3.0 — Consulta [LICENSE](LICENSE) para los términos completos.

[Apoya el proyecto](https://buymeacoffee.com/federicocesconi)

---

## Para desarrolladores

Este repositorio contiene el plugin. El código fuente de los servidores MCP vive en un repositorio separado.

```bash
npm run validate       # Validar manifiesto y estructura del plugin
npm run package        # Crear zip distribuible para Cowork
```

Consulta [CONNECTORS.md](bettercallclaude-espana/CONNECTORS.md) para las APIs MCP y [CONTRIBUTING.md](CONTRIBUTING.md) para el flujo de contribución.

---

## Aviso profesional

BetterCallClaude España es una herramienta de investigación y análisis jurídico. Todos los resultados:

- Requieren revisión profesional por un abogado antes de su uso.
- No constituyen asesoramiento jurídico.
- Pueden contener errores, omisiones o información desactualizada.
- Deben verificarse frente a fuentes oficiales (BOE, CENDOJ, bases de datos judiciales, diarios oficiales).
- Deben adaptarse a las circunstancias concretas de cada asunto.

Los abogados mantienen plena responsabilidad profesional. Esta herramienta asiste, pero no sustituye, el juicio profesional.
