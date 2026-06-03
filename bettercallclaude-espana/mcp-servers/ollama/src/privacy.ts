/**
 * Spain Legal Privacy Classifier
 *
 * Implements privacy detection patterns from the BetterCallClaude España
 * privacy-routing skill for Art. 24 LOPJ / Art. 542 CP compliance.
 *
 * Works entirely offline — no Ollama or network required.
 * PRIVILEGED patterns are checked before CONFIDENTIAL to prevent
 * "confidencial" overriding "secreto profesional".
 */

import type { PrivacyLevel, PatternMatch, ClassificationResult } from './types.js';

interface PatternDef {
  regex: RegExp;
  meaning: string;
  language: 'es' | 'en' | 'legal';
  level: PrivacyLevel;
}

// ---------------------------------------------------------------------------
// PRIVILEGED patterns (checked first)
// ---------------------------------------------------------------------------

const PRIVILEGED_PATTERNS: PatternDef[] = [
  // Spanish
  { regex: /secreto\s+profesional/i, meaning: 'Secreto profesional', language: 'es', level: 'PRIVILEGED' },
  { regex: /secreto\s+de\s+las\s+comunicaciones/i, meaning: 'Secreto de comunicaciones', language: 'es', level: 'PRIVILEGED' },
  { regex: /secreto\s+del\s+abogado/i, meaning: 'Secreto del abogado', language: 'es', level: 'PRIVILEGED' },
  { regex: /confidencialidad\s+abogado[-\s]?cliente/i, meaning: 'Confidencialidad abogado-cliente', language: 'es', level: 'PRIVILEGED' },
  { regex: /privilegio\s+de\s+la\s+defensa/i, meaning: 'Privilegio de la defensa', language: 'es', level: 'PRIVILEGED' },
  { regex: /deber\s+de\s+secreto/i, meaning: 'Deber de secreto', language: 'es', level: 'PRIVILEGED' },
  { regex: /obligaci[oó]n\s+de\s+secreto/i, meaning: 'Obligación de secreto', language: 'es', level: 'PRIVILEGED' },
  { regex: /secreto\s+del\s+mandato/i, meaning: 'Secreto del mandato', language: 'es', level: 'PRIVILEGED' },
  // English
  { regex: /attorney[-\s]client\s+privilege/i, meaning: 'Attorney-client privilege', language: 'en', level: 'PRIVILEGED' },
  { regex: /legal\s+professional\s+privilege/i, meaning: 'Legal professional privilege', language: 'en', level: 'PRIVILEGED' },
  { regex: /privileged\s+and\s+confidential/i, meaning: 'Privileged and confidential', language: 'en', level: 'PRIVILEGED' },
  { regex: /work[-\s]product\s+(doctrine|privilege)/i, meaning: 'Work product doctrine', language: 'en', level: 'PRIVILEGED' },
  // Legal references
  { regex: /art\.?\s*24\s+lopj/i, meaning: 'Art. 24 LOPJ', language: 'legal', level: 'PRIVILEGED' },
  { regex: /art\.?\s*542\s+cp/i, meaning: 'Art. 542 CP', language: 'legal', level: 'PRIVILEGED' },
  { regex: /art\.?\s*21\s+estatuto/i, meaning: 'Art. 21 Estatuto Abogacía', language: 'legal', level: 'PRIVILEGED' },
];

// ---------------------------------------------------------------------------
// CONFIDENTIAL patterns
// ---------------------------------------------------------------------------

const CONFIDENTIAL_PATTERNS: PatternDef[] = [
  // Spanish
  { regex: /confidencial/i, meaning: 'Confidencial', language: 'es', level: 'CONFIDENTIAL' },
  { regex: /reservado/i, meaning: 'Reservado', language: 'es', level: 'CONFIDENTIAL' },
  { regex: /privado/i, meaning: 'Privado', language: 'es', level: 'CONFIDENTIAL' },
  { regex: /uso\s+interno/i, meaning: 'Uso interno', language: 'es', level: 'CONFIDENTIAL' },
  { regex: /no\s+divulgar/i, meaning: 'No divulgar', language: 'es', level: 'CONFIDENTIAL' },
  // English
  { regex: /confidential/i, meaning: 'Confidential', language: 'en', level: 'CONFIDENTIAL' },
  { regex: /internal\s+use/i, meaning: 'Internal use', language: 'en', level: 'CONFIDENTIAL' },
  { regex: /not\s+for\s+distribution/i, meaning: 'Not for distribution', language: 'en', level: 'CONFIDENTIAL' },
];

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Classify text by Spanish legal privacy level.
 *
 * Checks PRIVILEGED patterns first so that "secreto profesional" is not
 * downgraded to CONFIDENTIAL by a "confidencial" match. Duplicate matches
 * on the same text region are deduplicated.
 */
export function classifyPrivacy(text: string): ClassificationResult {
  const matches: PatternMatch[] = [];

  // PRIVILEGED first
  for (const def of PRIVILEGED_PATTERNS) {
    const m = def.regex.exec(text);
    if (m) {
      matches.push({
        pattern: def.regex.source,
        meaning: def.meaning,
        language: def.language,
        level: def.level,
        matchedText: m[0],
      });
    }
  }

  // CONFIDENTIAL second
  for (const def of CONFIDENTIAL_PATTERNS) {
    const m = def.regex.exec(text);
    if (m) {
      // Skip if the matched text is already covered by a PRIVILEGED match
      const alreadyCovered = matches.some(
        (pm) =>
          pm.level === 'PRIVILEGED' &&
          pm.matchedText.toLowerCase().includes(m[0].toLowerCase()),
      );
      if (!alreadyCovered) {
        matches.push({
          pattern: def.regex.source,
          meaning: def.meaning,
          language: def.language,
          level: def.level,
          matchedText: m[0],
        });
      }
    }
  }

  // Determine overall level (highest wins)
  let level: PrivacyLevel = 'PUBLIC';
  if (matches.some((m) => m.level === 'PRIVILEGED')) {
    level = 'PRIVILEGED';
  } else if (matches.some((m) => m.level === 'CONFIDENTIAL')) {
    level = 'CONFIDENTIAL';
  }

  const summary = buildSummary(level, matches);

  return { level, matches, summary };
}

function buildSummary(level: PrivacyLevel, matches: PatternMatch[]): string {
  if (level === 'PUBLIC') {
    return 'No privacy-sensitive patterns detected. Content may be processed via cloud API.';
  }

  const langs = [...new Set(matches.map((m) => m.language))].join(', ');
  const patterns = matches.map((m) => m.meaning).join('; ');

  if (level === 'PRIVILEGED') {
    return (
      `PRIVILEGED content detected (${langs}): ${patterns}. ` +
      'This content is protected by Art. 24 LOPJ / Art. 542 CP (secreto profesional). ' +
      'Local processing ONLY — do not send to cloud APIs.'
    );
  }

  return (
    `CONFIDENTIAL content detected (${langs}): ${patterns}. ` +
    'Anonymize client-identifying information before any external processing. ' +
    'Prefer local processing when available.'
  );
}
