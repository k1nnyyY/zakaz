"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePayload = void 0;
const ton_proof_service_1 = require("../services/ton-proof-service");
const http_utils_1 = require("../utils/http-utils");
const jwt_1 = require("../utils/jwt");
/**
 * Generates a payload for ton proof.
 *
 * POST /api/generate_payload
 */
const generatePayload = async () => {
    try {
        const service = new ton_proof_service_1.TonProofService();
        const payload = service.generatePayload();
        const payloadToken = await (0, jwt_1.createPayloadToken)({ payload: payload });
        return (0, http_utils_1.ok)({ payload: payloadToken });
    }
    catch (e) {
        return (0, http_utils_1.badRequest)({ error: 'Invalid request', trace: e });
    }
};
exports.generatePayload = generatePayload;
