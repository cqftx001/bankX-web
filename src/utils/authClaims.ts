export interface ParsedClaims {
  roles: string[];
  authorities: string[];
}

export function parseAuthClaims(claims: string): ParsedClaims {
  const raw = claims
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

  const roles = raw.filter((item) => item.startsWith('ROLE_'));
  const authorities = raw.filter((item) => item.includes(':'));

  return { roles, authorities };
}
