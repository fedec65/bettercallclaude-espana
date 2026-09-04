# Registro de Partes — Reglas de Normalización

El registro de partes mapea cada variante de nombre hallada en los documentos a una única parte normalizada. Todos los eventos hacen referencia solo a nombres normalizados.

## Forma del Registro

```json
{
  "parties": [
    {
      "name": "Ejemplo S.L.",
      "aliases": ["Ejemplo S.L., Madrid", "la Ejemplo", "la demandada", "Ejemplo sl", "la sociedad vendedora"],
      "role": "demandada / vendedora",
      "kind": "persona-juridica"
    },
    {
      "name": "Blanco",
      "aliases": ["D. Luis Blanco", "Sr. Blanco", "el actor", "el comprador"],
      "role": "actor / comprador",
      "kind": "persona-fisica"
    }
  ]
}
```

## Reglas de Normalización

1. **Semilla primero**: `--parties=A,B,...` inicializa el registro antes de la extracción; los alias se acumulan a medida que se leen los documentos.
2. **Personas jurídicas**: mantén la forma societaria y elige UNA forma canónica — `Ejemplo S.L.` / `Ejemplo S.A.` / `Ejemplo SL` se normalizan a la forma resultante de la nota simple registral si es conocida. Anota la forma elegida; no mezcles formas en los eventos.
3. **Personas físicas**: solo `Apellido` en la forma normalizada ("Blanco"); los nombres completos ("Luis Blanco") quedan como alias. Si dos personas comparten apellido, normaliza a "Blanco L." / "Blanco M." y señala la colisión en el report.
4. **Etiquetas procesales**: "actor/demandado", "demandante/demandado", "apelante/apelado", "recurrente/recurrido", "ejecutante/ejecutado", "opositor" (monitorio y cambiario) son alias de la parte que la designan en ese acto — resuélvelos al nombre normalizado y mantén la etiqueta como alias.
5. **Roles procesales españoles típicos**: actor, demandado, litisconsortes, tercero interviniente, testigo, perito (judicial o de parte), procurador, letrado de la Administración de Justicia (LAJ), curador, defensor judicial, Ministerio Fiscal, acusación particular, Administración demandada (contencioso).
6. **Terceros**: jueces/tribunales, peritos, testigos, notarios y registrarios NO son partes — regístralos en una lista separada `third_parties`; pueden aparecer en el texto del evento pero no en `parties`. **Excepción**: en lo contencioso-administrativo la Administración actuante ES parte (demandada) y las Administraciones públicas que intervienen se registran como partes normales.
7. **Parte desconocida**: si un documento introduce un nombre que no casa con nada, añade una entrada provisional con flag `provisional: true` y señalala para confirmación del usuario.
8. **Variantes de lengua**: normaliza a través de las lenguas ("la Ejemplo S.L.", "die Ejempel GmbH", "Ejemplo Ltd") al único nombre canónico — manteniendo la forma societaria española si el ente es español. Los documentos en lenguas cooficiales (DOGC/BOPV/DOGA) siguen la misma regla hacia la forma canónica.

## Uso en los Eventos

- Campo `parties`: nombres normalizados implicados en el evento.
- Cadenas `attribution`: nombres normalizados ("Ejemplo S.L. alega …; Blanco controvierte …").
- Texto del evento: nombres normalizados; la formulación original queda en el documento fuente, no en el evento.
