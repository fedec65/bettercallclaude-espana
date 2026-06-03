# MCP Server Integration — CONNECTORS

This document describes the 12 MCP (Model Context Protocol) servers included with the BetterCallClaude España plugin. These servers provide direct integration with Spanish legal databases for legislation lookup, court decision retrieval, citation verification, academic doctrine access, and local privacy classification.

---

## Overview

| Server | Purpose | Transport |
|--------|---------|-----------|
| `boe-legislacion` | BOE state legislation database | HTTP |
| `legal-citations-esp` | Citation verification and formatting | HTTP |
| `legal-persona-esp` | Spain-law document intelligence | HTTP |
| `cendoj-jurisprudencia` | CENDOJ court decisions (TS + AP + Juzgados) | HTTP |
| `tribunal-constitucional` | Tribunal Constitucional decisions | HTTP |
| `eu-law-esp` | EU law application in Spain | HTTP |
| `congreso-debates` | Congressional debates and legislative history | HTTP |
| `doctrina-academica` | Academic legal doctrine and commentary | HTTP |
| `derecho-historico` | Historical Spanish legislation | HTTP |
| `catalunya-legal` | Catalan legal system (DOGC, TSJC) | HTTP |
| `busqueda-general` | General search across all legal sources | HTTP |
| `ollama` | Privacy classification for privileged content | Local (stdio) |

### Configuration

All 11 remote servers connect via HTTP to `https://mcp.bettercallclaude.es`. The plugin's `.mcp.json` configures these automatically — no local setup, Node.js, or API keys are required for the remote servers.

The ollama privacy classifier runs locally via stdio to ensure sensitive content never leaves your machine.

After plugin installation, verify with `/mcp` that all 12 servers appear. Restart Claude Code or Cowork if needed.

#### Without MCP Servers

BetterCallClaude España operates in reduced mode when servers are unavailable. Commands fall back to built-in Spanish law knowledge but cannot search live databases, verify citation existence, or access current legislation. Run `/bettercallclaude-espana:setup` to check connectivity.

> **Note**: The remote MCP servers use HTTP transport via `StreamableHTTPServerTransport`. Ensure your backend deployment supports this protocol.

---

## boe-legislacion

Provides search and retrieval of Spanish state legislation from the BOE (Boletín Oficial del Estado) database.

### Tools

#### search_legislation

Search state statutes by keywords.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `query` | string | Yes | Free-text search query |
| `limit` | number | No | Maximum results. Default: `10` |

#### get_article

Retrieve article text from official BOE.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `statute` | string | Yes | Statute abbreviation (e.g., `CC`, `CP`, `LEC`) |
| `article` | string | Yes | Article number |

#### lookup_statute

Look up statute by name or abbreviation.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name_or_abbr` | string | Yes | Statute name or abbreviation |

#### find_related

Find related statutes.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `statute` | string | Yes | Statute abbreviation |

---

## legal-citations-esp

Validate and format Spanish legal citations.

### Tools

#### validate_citation

Verify a citation exists and is correctly formatted.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `citation` | string | Yes | Citation string to validate |

#### format_citation

Convert citation to target language format.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `citation` | string | Yes | Citation to format |
| `target_language` | string | No | Target language: `ES` or `EN` |

#### parse_citation

Decompose citation into components.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `citation` | string | Yes | Citation to parse |

#### standardize_document_citations

Batch-standardize all citations in a document.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `text` | string | Yes | Document text containing citations |

---

## legal-persona-esp

Spain-law document intelligence for strategy, drafting, and analysis.

### Tools

#### analyze_document

Analyze a legal document for issues, clauses, and compliance.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `document` | string | Yes | Document text |
| `document_type` | string | No | Type: `contract`, `court_submission`, `opinion`, `statute` |

#### draft_document

Generate a draft document based on parameters.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `document_type` | string | Yes | Type to draft |
| `parameters` | object | Yes | Drafting parameters |

#### analyze_strategy

Analyze litigation strategy for a given case.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `case_facts` | string | Yes | Case facts |
| `desired_outcome` | string | No | Desired outcome |

---

## cendoj-jurisprudencia

Search and retrieve court decisions from CENDOJ (Centro de Documentación Judicial) covering Tribunal Supremo, Audiencias Provinciales, and Juzgados.

### Tools

#### search_decisions

Search court decisions by keywords, article references, date ranges, and court levels.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `query` | string | Yes | Free-text search query |
| `article_ref` | string | No | Filter by statutory article reference (e.g., `"Art. 1255 CC"`) |
| `date_from` | string | No | Start date. Format: `YYYY-MM-DD` |
| `date_to` | string | No | End date. Format: `YYYY-MM-DD` |
| `sala` | string | No | Filter by TS chamber: `Civil`, `Penal`, `Contencioso-Administrativo`, `Laboral`, `Militar` |
| `ccaa` | string | No | Filter by CCAA code (e.g., `MD`, `CT`, `AN`) |
| `court_level` | string | No | `primera`, `audiencia`, `supremo`, `constitucional` |
| `limit` | number | No | Maximum results. Default: `10`. Max: `50` |

#### get_decision

Retrieve a court decision by citation or ID.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `citation` | string | Yes | STS, SAP, or Auto citation |

#### get_fundamento

Retrieve a specific *Fundamento de Derecho* from a decision.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Decision identifier |
| `fundamento_nr` | number | Yes | Fundamento number |

#### get_headnote

Retrieve the official headnote (*Regeste* / *Nota de Premsa*).

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Decision identifier |

#### get_case_brief

Structured summary of key facts, holding, and ratio.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Decision identifier |

#### find_leading_cases

Surface landmark STS on a topic.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `query` | string | Yes | Topic query |

#### find_citations

Find decisions citing a given STS.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `citation` | string | Yes | STS citation to find citations to |

---

## tribunal-constitucional

Search and retrieve Tribunal Constitucional (TC) decisions.

### Tools

#### search_tc

Search TC decisions by keywords, date, and topic.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `query` | string | Yes | Search query |
| `date_from` | string | No | Start date filter |
| `date_to` | string | No | End date filter |
| `limit` | number | No | Maximum results |

#### get_tc_decision

Retrieve a TC decision by citation.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `citation` | string | Yes | STC citation |

---

## eu-law-esp

EU law application in the Spanish legal system.

### Tools

#### search_eu_law

Search EU directives, regulations, and CJEU cases relevant to Spain.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `query` | string | Yes | Search query |
| `type` | string | No | `directive`, `regulation`, `decision`, `cjue` |

#### get_directive

Retrieve an EU directive and its Spanish transposition.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `directive_number` | string | Yes | Directive number (e.g., `2016/679`) |

#### get_cjue_case

Retrieve a CJEU case and its Spanish impact.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `case_number` | string | Yes | CJEU case number |

---

## congreso-debates

Congressional debates and legislative history from the Congreso de los Diputados.

### Tools

#### search_debates

Search congressional debates by keywords, date, and legislative initiative.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `query` | string | Yes | Search query |
| `date_from` | string | No | Start date |
| `date_to` | string | No | End date |

#### get_iniciativa_legislativa

Retrieve legislative initiative materials (exposición de motivos).

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `boletin` | string | Yes | Boletín Oficial de las Cortes Generales number |

---

## doctrina-academica

Academic legal doctrine and scholarly commentary.

### Tools

#### search_doctrine

Search academic articles, commentaries, and legal treatises.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `query` | string | Yes | Search query |
| `author` | string | No | Filter by author |
| `journal` | string | No | Filter by journal |

#### get_commentary_for_article

Get scholarly commentary on a specific statutory article.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `statute` | string | Yes | Statute abbreviation |
| `article` | string | Yes | Article number |

---

## derecho-historico

Historical Spanish legislation and jurisprudence.

### Tools

#### search_historical

Search historical statutes and decisions.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `query` | string | Yes | Search query |
| `era` | string | No | Historical era filter |

---

## catalunya-legal

Catalan legal system including DOGC (Diari Oficial de la Generalitat de Catalunya), TSJC (Tribunal Superior de Justícia de Catalunya) decisions, and Catalan civil law (*dret civil català*).

### Tools

#### search_dogc

Search DOGC legislation.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `query` | string | Yes | Search query |

#### search_tsjc

Search TSJC decisions.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `query` | string | Yes | Search query |

#### get_civil_catala

Retrieve Catalan civil law provisions.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `book` | string | Yes | Book number or title |
| `article` | string | Yes | Article number |

---

## busqueda-general

General search across all Spanish legal sources (BOE, CENDOJ, TC, DOGC, doctrine).

### Tools

#### search_all

Search across all connected legal databases.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `query` | string | Yes | Search query |
| `sources` | array | No | Limit to specific sources |
| `limit` | number | No | Maximum results per source |

---

## ollama

Local privacy classifier. Runs entirely offline.

### Tools

#### classify_privacy

Classify text for privileged content indicators.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `text` | string | Yes | Text to classify |

#### translate

Local translation between ES and EN.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `text` | string | Yes | Text to translate |
| `target_language` | string | Yes | Target language: `ES` or `EN` |

#### summarize

Local summarization.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `text` | string | Yes | Text to summarize |
| `length` | string | No | Summary length: `short`, `medium`, `long` |

---

## Reduced Mode

When MCP servers are unavailable, the plugin operates in reduced mode with these degradation paths:

| Server | Full Mode | Reduced Mode (no MCP) |
|--------|-----------|----------------------|
| boe-legislacion | Live BOE legislation queries | Training data statute references |
| legal-citations-esp | Format validation + existence verification | Format validation only |
| legal-persona-esp | Document intelligence | No document intelligence |
| cendoj-jurisprudencia | Live search across TS + AP + Juzgados | Training data only, citations unverified |
| tribunal-constitucional | TC decision search | Training data only |
| eu-law-esp | EU law and CJEU cases | Training data only |
| congreso-debates | Congressional debates | No debate access |
| doctrina-academica | Commentary access | No commentary access |
| derecho-historico | Historical legislation | No historical access |
| catalunya-legal | DOGC + TSJC search | Training data only |
| busqueda-general | Cross-source search | No cross-source search |

When operating in reduced mode:
- Inform the user that MCP servers are not connected
- Mark all citations as **unverified**
- Suggest running `/bettercallclaude-espana:setup`
- Still provide analysis using built-in Spanish law knowledge
- Note limitations in the professional disclaimer
