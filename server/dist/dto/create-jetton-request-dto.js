"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateJettonRequest = void 0;
const zod_1 = __importDefault(require("zod"));
exports.CreateJettonRequest = zod_1.default.object({
    name: zod_1.default.string(),
    description: zod_1.default.string(),
    image_data: zod_1.default.string(),
    symbol: zod_1.default.string(),
    decimals: zod_1.default.number(),
    amount: zod_1.default.string(),
});
