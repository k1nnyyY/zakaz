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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const sqlite3_1 = __importDefault(require("sqlite3"));
const sqlite_1 = require("sqlite");
const check_proof_1 = require("./api/check-proof");
const create_jetton_1 = require("./api/create-jetton");
const generate_payload_1 = require("./api/generate-payload");
const get_account_info_1 = require("./api/get-account-info");
const healthz_1 = require("./api/healthz");
const app = (0, express_1.default)();
const corsOptions = {
    origin: '*',
    credentials: true,
};
app.use((0, cors_1.default)(corsOptions));
app.use(body_parser_1.default.json());
const initializeDb = () => __awaiter(void 0, void 0, void 0, function* () {
    return (0, sqlite_1.open)({
        filename: './database.db',
        driver: sqlite3_1.default.Database
    });
});
app.use((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const db = yield initializeDb();
    req.db = db;
    next();
}));
app.post('/api/check_proof', check_proof_1.checkProof);
app.post('/api/create_jetton', create_jetton_1.createJetton);
app.post('/api/generate_payload', generate_payload_1.generatePayload);
app.get('/api/get_account_info', (req, res) => (0, get_account_info_1.getAccountInfo)(req, res));
app.get('/api/healthz', healthz_1.healthz);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
