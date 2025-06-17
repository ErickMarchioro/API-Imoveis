import { createSecretKey } from 'crypto';
export const segredo = "A_senha";

export const segredoDoJWT = createSecretKey(segredo, 'utf-8');