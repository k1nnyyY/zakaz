"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const check_proof_1 = require("./api/check-proof");
const create_jetton_1 = require("./api/create-jetton");
const generate_payload_1 = require("./api/generate-payload");
const get_account_info_1 = require("./api/get-account-info");
const healthz_1 = require("./api/healthz");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
app.post("/api/check_proof", check_proof_1.checkProof);
app.post("/api/create_jetton", create_jetton_1.createJetton);
app.post("/api/generate_payload", generate_payload_1.generatePayload);
app.get("/api/get_account_info", get_account_info_1.getAccountInfo);
app.get("/api/healthz", healthz_1.healthz);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
