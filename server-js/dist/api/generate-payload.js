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
exports.generatePayload = void 0;
const ton_proof_service_1 = __importDefault(require("../services/ton-proof-service"));
const http_utils_1 = require("../utils/http-utils");
const jwt_1 = require("../utils/jwt");
/**
 * Generates a payload for ton proof.
 *
 * POST /api/generate_payload
 */
const generatePayload = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const service = new ton_proof_service_1.default();
        const payload = service.generatePayload();
        const payloadToken = yield (0, jwt_1.createPayloadToken)({ payload: payload });
        res.status(200).json((0, http_utils_1.ok)({ payload: payloadToken }));
    }
    catch (e) {
        if (e instanceof Error) {
            res.status(400).json((0, http_utils_1.badRequest)({ error: 'Invalid request', trace: e.message }));
        }
        else {
            res.status(400).json((0, http_utils_1.badRequest)({ error: 'Invalid request', trace: String(e) }));
        }
        next(e);
    }
});
exports.generatePayload = generatePayload;
