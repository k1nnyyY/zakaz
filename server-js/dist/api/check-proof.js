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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkProof = void 0;
const ton_api_service_1 = __importDefault(require("../services/ton-api-service"));
const ton_proof_service_1 = __importDefault(require("../services/ton-proof-service"));
const http_utils_1 = require("../utils/http-utils");
const check_proof_request_dto_1 = require("../dto/check-proof-request-dto");
const jwt_1 = require("../utils/jwt");
/**
 * Checks the proof and returns an access token.
 *
 * POST /api/check_proof
 */
const checkProof = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = check_proof_request_dto_1.CheckProofRequest.parse(req.body);
        const client = ton_api_service_1.default.create(body.network);
        const service = new ton_proof_service_1.default();
        const isValid = yield service.checkProof(body, (address) => client.getWalletPublicKey(address));
        if (!isValid) {
            res.status(400).json((0, http_utils_1.badRequest)({ error: 'Invalid proof' }));
            return;
        }
        const payloadToken = body.proof.payload;
        if (!(yield (0, jwt_1.verifyToken)(payloadToken))) {
            res.status(400).json((0, http_utils_1.badRequest)({ error: 'Invalid token' }));
            return;
        }
        const token = yield (0, jwt_1.createAuthToken)({ address: body.address, network: body.network });
        res.status(200).json((0, http_utils_1.ok)({ token: token }));
    }
    catch (e) {
        if (e instanceof Error) {
            res.status(400).json((0, http_utils_1.badRequest)({ error: 'Invalid request', trace: e.message }));
        }
        else {
            res.status(400).json((0, http_utils_1.badRequest)({ error: 'Invalid request', trace: String(e) }));
        }
    }
});
exports.checkProof = checkProof;
