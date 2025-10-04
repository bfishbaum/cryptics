import { Source, type Cryptogram } from '../types/cryptogram';

export interface ShareableCryptogram {
  puzzle: string;
  solution: string;
  explanation?: string;
  source?: Source;
  difficulty?: number;
}

interface NormalizedCryptogramPayload {
  puzzle: string;
  solution: string;
  explanation?: string;
  source: Source;
  difficulty: number;
}

const DEFAULT_SOURCE = Source.USER_SUBMITTED;
const DEFAULT_DIFFICULTY = 3;

const encoder = new TextEncoder();
const decoder = new TextDecoder();

function toBase64Url(value: string): string {
  if (typeof globalThis.btoa !== 'function') {
    throw new Error('Base64 encoding is not supported in this environment');
  }

  const bytes = encoder.encode(value);
  let binary = '';
  bytes.forEach(byte => {
    binary += String.fromCharCode(byte);
  });

  const base64 = globalThis.btoa(binary);
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(value: string): string {
  if (typeof globalThis.atob !== 'function') {
    throw new Error('Base64 decoding is not supported in this environment');
  }

  const base64 = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
  const binary = globalThis.atob(padded);

  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }

  return decoder.decode(bytes);
}

function normalizePayload(data: ShareableCryptogram): NormalizedCryptogramPayload {
  const puzzle = data.puzzle?.trim();
  const solution = data.solution?.trim();

  if (!puzzle || !solution) {
    throw new Error('Puzzle and solution are required');
  }

  const explanation = data.explanation?.trim();
  const isValidSource = Object.values(Source).includes(data.source as Source);
  const source = isValidSource ? (data.source as Source) : DEFAULT_SOURCE;

  const rawDifficulty = Number(data.difficulty);
  const difficulty = Number.isFinite(rawDifficulty)
    ? Math.min(Math.max(Math.round(rawDifficulty), 1), 5)
    : DEFAULT_DIFFICULTY;

  return {
    puzzle,
    solution,
    explanation: explanation || undefined,
    source,
    difficulty,
  };
}

function generateSharedPuzzleId(payload: NormalizedCryptogramPayload): number {
  const seed = `${payload.puzzle}|${payload.solution}|${payload.explanation ?? ''}|${payload.source}|${payload.difficulty}`;
  let hash = 0;

  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  }

  if (hash === 0) {
    hash = 1;
  }

  return -Math.abs(hash);
}

export function encodeCryptogramToParams(cryptogram: ShareableCryptogram): URLSearchParams {
  const payload = normalizePayload(cryptogram);
  const serialized = JSON.stringify(payload);
  const encoded = toBase64Url(serialized);

  const params = new URLSearchParams();
  params.set('code', encoded);
  return params;
}

export function decodeCryptogramFromParams(params: URLSearchParams): Cryptogram | null {
  const encoded = params.get('code');
  if (!encoded) {
    return null;
  }

  try {
    const serialized = fromBase64Url(encoded);
    const parsed = JSON.parse(serialized);

    if (typeof parsed !== 'object' || parsed === null) {
      return null;
    }

    const payload = normalizePayload(parsed as ShareableCryptogram);
    const id = generateSharedPuzzleId(payload);

    return {
      id,
      puzzle: payload.puzzle,
      solution: payload.solution,
      explanation: payload.explanation,
      source: payload.source,
      difficulty: payload.difficulty,
      date_added: new Date(),
    };
  } catch (error) {
    console.error('Failed to decode shared cryptogram from params', error);
    return null;
  }
}
