"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
    return (payload) => __awaiter(this, void 0, void 0, function* () {
        const encoder = new TextEncoder();
        const key = encoder.encode(JWT_SECRET_KEY);
        return new jose_1.SignJWT(payload)
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setExpirationTime(expirationTime)
            .sign(key);
    });
}
// Время жизни токенов
exports.createAuthToken = buildCreateToken('1Y'); // 1 год
exports.createPayloadToken = buildCreateToken('15m'); // 15 минут
/**
 * Verify the given token.
 */
function verifyToken(token) {
    return __awaiter(this, void 0, void 0, function* () {
        const encoder = new TextEncoder();
        const key = encoder.encode(JWT_SECRET_KEY);
        try {
            const { payload } = yield (0, jose_1.jwtVerify)(token, key);
            return payload;
        }
        catch (e) {
            return null;
        }
    });
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
