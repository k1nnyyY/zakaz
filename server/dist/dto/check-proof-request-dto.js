"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckProofRequest = void 0;
const ui_react_1 = require("@tonconnect/ui-react");
const zod_1 = __importDefault(require("zod"));
exports.CheckProofRequest = zod_1.default.object({
    address: zod_1.default.string(),
    network: zod_1.default.enum([ui_react_1.CHAIN.MAINNET, ui_react_1.CHAIN.TESTNET]),
    public_key: zod_1.default.string(),
    proof: zod_1.default.object({
        timestamp: zod_1.default.union([zod_1.default.number(), zod_1.default.string()]).transform((v) => typeof v === 'string' ? parseInt(v) : v),
        domain: zod_1.default.object({
            lengthBytes: zod_1.default.number(),
            value: zod_1.default.string(),
        }),
        payload: zod_1.default.string(),
        signature: zod_1.default.string(),
        state_init: zod_1.default.string(),
    }),
});
