"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodePayloadToken = exports.decodeAuthToken = exports.createPayloadToken = exports.createAuthToken = void 0;
exports.verifyToken = verifyToken;
const jose_1 = require("jose");
/**
 * Secret key for the token.
 */
const JWT_SECRET_KEY = 'your_secret_key';
/**
 * Create a token with the given payload.
 */
function buildCreateToken(expirationTime) {
    return async (payload) => {
        const encoder = new TextEncoder();
        const key = encoder.encode(JWT_SECRET_KEY);
        return new jose_1.SignJWT(payload)
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setExpirationTime(expirationTime)
            .sign(key);
    };
}
exports.createAuthToken = buildCreateToken('1Y');
exports.createPayloadToken = buildCreateToken('15m');
/**
 * Verify the given token.
 */
async function verifyToken(token) {
    const encoder = new TextEncoder();
    const key = encoder.encode(JWT_SECRET_KEY);
    try {
        const { payload } = await (0, jose_1.jwtVerify)(token, key);
        return payload;
    }
    catch (e) {
        return null;
    }
}
/**
 * Decode the given token.
 */
function buildDecodeToken() {
    return (token) => {
        try {
            return (0, jose_1.decodeJwt)(token);
        }
        catch (e) {
            return null;
        }
    };
}
exports.decodeAuthToken = buildDecodeToken();
exports.decodePayloadToken = buildDecodeToken();
