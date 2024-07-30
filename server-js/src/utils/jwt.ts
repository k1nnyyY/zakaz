import { JWTPayload, SignJWT, jwtVerify, decodeJwt } from 'jose';

/**
 * Secret key for the token.
 */
const JWT_SECRET_KEY = 'your_secret_key';

/**
 * Create a token with the given payload.
 */
function buildCreateToken(expirationTime: string) {
  return async (payload: JWTPayload) => {
    const encoder = new TextEncoder();
    const key = encoder.encode(JWT_SECRET_KEY);
    return new SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime(expirationTime)
      .sign(key);
  };
}

// Время жизни токенов
export const createAuthToken = buildCreateToken('1Y'); // 1 год
export const createPayloadToken = buildCreateToken('15m'); // 15 минут

/**
 * Verify the given token.
 */
export async function verifyToken(token: string) {
  const encoder = new TextEncoder();
  const key = encoder.encode(JWT_SECRET_KEY);
  try {
    const { payload } = await jwtVerify(token, key);
    return payload;
  } catch (e) {
    return null;
  }
}

/**
 * Decode the given token.
 */
function buildDecodeToken() {
  return (token: string) => {
    try {
      return decodeJwt(token);
    } catch (e) {
      return null;
    }
  };
}

export const decodeAuthToken = buildDecodeToken();
export const decodePayloadToken = buildDecodeToken();
