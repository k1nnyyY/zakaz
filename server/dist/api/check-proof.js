"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkProof = void 0;
const check_proof_request_dto_js_1 = require("../dto/check-proof-request-dto.js");
const ton_api_service_js_1 = require("../services/ton-api-service.js");
const ton_proof_service_js_1 = require("../services/ton-proof-service.js");
const http_utils_js_1 = require("../utils/http-utils.js");
const jwt_js_1 = require("../utils/jwt.js");
/**
 * Checks the proof and returns an access token.
 *
 * POST /api/check_proof
 */
const checkProof = async ({ request }) => {
    try {
        const body = check_proof_request_dto_js_1.CheckProofRequest.parse(await request.json());
        const client = ton_api_service_js_1.TonApiService.create(body.network);
        const service = new ton_proof_service_js_1.TonProofService();
        const isValid = await service.checkProof(body, (address) => client.getWalletPublicKey(address));
        if (!isValid) {
            return (0, http_utils_js_1.badRequest)({ error: 'Invalid proof' });
        }
        const payloadToken = body.proof.payload;
        if (!await (0, jwt_js_1.verifyToken)(payloadToken)) {
            return (0, http_utils_js_1.badRequest)({ error: 'Invalid token' });
        }
        const token = await (0, jwt_js_1.createAuthToken)({ address: body.address, network: body.network });
        return (0, http_utils_js_1.ok)({ token: token });
    }
    catch (e) {
        return (0, http_utils_js_1.badRequest)({ error: 'Invalid request', trace: e });
    }
};
exports.checkProof = checkProof;
