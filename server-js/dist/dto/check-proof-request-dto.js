"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckProofRequest = void 0;
const zod_1 = require("zod");
const ui_react_1 = require("@tonconnect/ui-react");
exports.CheckProofRequest = zod_1.z.object({
    address: zod_1.z.string(),
    network: zod_1.z.enum([ui_react_1.CHAIN.MAINNET, ui_react_1.CHAIN.TESTNET]),
    public_key: zod_1.z.string(),
    proof: zod_1.z.object({
        timestamp: zod_1.z.union([zod_1.z.number(), zod_1.z.string()]).transform((v) => typeof v === 'string' ? parseInt(v) : v),
        domain: zod_1.z.object({
            lengthBytes: zod_1.z.number(),
            value: zod_1.z.string(),
        }),
        payload: zod_1.z.string(),
        signature: zod_1.z.string(),
        state_init: zod_1.z.string(),
    }),
});
