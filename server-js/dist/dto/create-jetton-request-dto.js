"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateJettonRequest = void 0;
const zod_1 = require("zod");
const CreateJettonRequest = zod_1.z.object({
    name: zod_1.z.string(),
    description: zod_1.z.string(),
    image_data: zod_1.z.string(),
    symbol: zod_1.z.string(),
    decimals: zod_1.z.number(),
    amount: zod_1.z.string(),
});
exports.CreateJettonRequest = CreateJettonRequest;
