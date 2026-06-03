---
description: "Transform vague legal queries into structured prompts through Socratic dialogue."
---

# refine — Query Refinement (Socratic Dialogue)

Transform vague or underspecified legal queries into structured, actionable prompts through Socratic dialogue. Recommend optimal workflows and introduce Spanish legal terminology.

## Scope Constraint
Use exclusively BetterCallclaude España agents, skills, and MCP servers.

## Procedure
1. **Clarification Questions**: Ask targeted questions to elicit missing context:
   - What is the legal area? (civil, penal, mercantil, laboral, administrativo)
   - What is the procedural posture? (pre-litigio, en primera instancia, en apelación, en casación)
   - Which jurisdiction applies? (estatal / autonómico / which CCAA)
   - What is the desired outcome? (demanda, contrato, asesoramiento, recurso)
   - Are there deadlines or urgency?
   - Is professional secrecy (secreto profesional) a concern?
2. **Terminology Introduction**: Introduce correct Spanish legal terms:
   - *Demanda* (not complaint/klage)
   - *Recurso de casación* (not cassation/Revision)
   - *Escrito* (not brief/Schriftsatz)
   - *Juzgado de Primera Instancia* (not district court/Bezirksgericht)
   - *Audiencia Provincial* (not cantonal court/Kantonsgericht)
   - *Tribunal Supremo* (not federal tribunal/Bundesgericht)
   - *Sentencia* (not judgment/Entscheid)
   - *Auto* (not procedural order/Beschluss — though context matters)
   - *Secreto profesional* (not professional secret/Berufsgeheimnis)
3. **Structured Prompt Construction**: Once sufficient context is gathered, produce a refined prompt.
4. **Workflow Recommendation**: Suggest the optimal command sequence:
   - Simple research → `/bettercallclaude-espana:research`
   - Full matter → `/bettercallclaude-espana:legal-5step`
   - Document needed → `/bettercallclaude-espana:draft`
   - Strategy needed → `/bettercallclaude-espana:strategy`
   - Complex dispute → `/bettercallclaude-espana:adversarial`

## Output
- Clarifying questions (if needed)
- Structured prompt proposal
- Recommended workflow
- Key Spanish legal terms introduced

## Skills Used
- legal-query-refinement
- spanish-jurisdictions
- spanish-legal-research

## Examples
- `/bettercallclaude-espana:refine "Me han desahuciado, ¿qué hago?"`
- `/bettercallclaude-espana:refine "Quiero demandar a mi banco"`
- `/bettercallclaude-espana:refine "Necesito un contrato para alquilar mi piso"`
- `/bettercallclaude-espana:refine "Me han denunciado por estafa"`

$ARGUMENTS
