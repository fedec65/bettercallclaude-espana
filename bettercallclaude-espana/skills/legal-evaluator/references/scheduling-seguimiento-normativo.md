# Scheduling `seguimiento-normativo` — Seguimiento Normativo

El perfil `seguimiento-normativo` está pensado para invocación programada (automática). Ejecuta un pase de trabajo + un pase de veredicto por ejecución, comprobando todos los temas legales vigilados en busca de cambios.

## Cómo Programarlo

### Opción A: Claude Scheduled Tasks (Cowork Desktop)

Usa la capacidad de scheduling integrada de Claude para ejecutar el loop a intervalos definidos:

```
Schedule: Every weekday at 07:00 CET
Task: Run /bettercallclaude-espana:objetivo-legal seguimiento-normativo --target="bcc-output/config/temas-vigilados.md"
      then /bettercallclaude-espana:bucle-legal <goal-id-resultante>
```

### Opción B: Cron Externo / Task Scheduler

Para entornos con acceso cron (p. ej. Claude Code CLI):

```bash
# Ejemplo de entrada crontab — lunes-viernes a las 07:00 CET
0 7 * * 1-5 claude --plugin bettercallclaude-espana \
  --command "objetivo-legal seguimiento-normativo --target=temas-vigilados.md" \
  --then "bucle-legal"
```

La sintaxis exacta de invocación depende del runtime de Claude. El principio es:
1. Definir el objetivo (idempotente — puede re-ejecutarse con seguridad)
2. Ejecutar el loop contra ese objetivo

### Opción C: Sesiones Programadas Externas

Si usas un agente externo para la automatización:
1. Crea una sesión programada con el prompt que incluye la secuencia `/objetivo-legal seguimiento-normativo` + `/bucle-legal`.
2. Apúntala al workspace del plugin BetterCallClaude España.
3. Los resultados persisten en `bcc-output/loops/` para revisión del usuario.

## Archivo de Temas Vigilados

Crea un archivo que enumere las áreas legales y disposiciones a vigilar:

```markdown
# Temas Vigilados — Seguimiento Normativo

## Temas

1. **RGPD / Protección de Datos**
   - LO 3/2018 (LOPDGDD) y RGPD (Reglamento UE 2016/679) — enmiendas o disposiciones de desarrollo
   - Providencias y sanciones de la AEPD
   - Directrices del EDPB con incidencia en España

2. **PBC / FT (Antiblanqueo)**
   - Ley 10/2010 (prevención del blanqueo de capitales) — variaciones de umbral o ámbito
   - Comunicaciones del SEPBLAC sobre sujetos obligados
   - Nuevas recomendaciones del GAFI/FATF recibidas en el derecho español

3. **Derecho del Trabajo**
   - Modificaciones al Estatuto de los Trabajadores (RDL 2/2015)
   - Nuevas sentencias del TS sobre trabajo a distancia (Ley 10/2021)
   - Convenios colectivos publicados en el BOE en sectores vigilados

4. **Gobierno Societario**
   - Seguimiento a la reforma de la Ley de Sociedades de Capital (RDL 5/2023)
   - Circulares de la CNMV sobre gobierno societario
   - Requisitos de reporting ESG (CSRD, transposición española)
```

Coloca este archivo en `bcc-output/config/temas-vigilados.md` o en cualquier ruta especificada vía `--target`.

## Comportamiento por Ejecución

Cada ejecución programada:
1. **Worker** interroga boe-legislacion (`search_boe`, `get_metadatos`) y jurisprudencia (cendoj-jurisprudencia `search_jurisprudencia`, tribunal-constitucional `search_sentencias_tc`) para cada tema; para normas en trámite usa congreso-debates (`track_legislative_status`); para derecho UE, eu-law-esp; para derecho catalán, catalunya-legal; otras CCAA vía busqueda-general o WebSearch
2. **Evaluator** verifica que todos los temas hayan sido comprobados y asigna relevancia (material / no material)
3. **Output** persiste en `bcc-output/loops/<goal-id>/` con un report datado
4. Solo los **cambios materiales** aparecen en el resumen; las comprobaciones no materiales se registran pero no se señalan

## Revisión de Resultados

Tras cada ejecución, el usuario encuentra:
- `summary.md` — temas comprobados, cambios materiales detectados, MET/NOT MET global
- `final/report-seguimiento.md` — el report de modificaciones normativas (solo entradas materiales)
- `iteration-1.md` — el veredicto de completitud del evaluator

Si NOT MET (p. ej. una fuente de datos era inalcanzable), el summary indica claramente qué temas no han podido ser comprobados y por qué.
