"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createJetton = void 0;
const core_1 = require("@ton/core");
const ton_1 = require("@ton/ton");
const sdk_1 = require("@tonconnect/sdk");
const create_jetton_request_dto_1 = require("../dto/create-jetton-request-dto");
const http_utils_1 = require("../utils/http-utils");
const jwt_1 = require("../utils/jwt");
const VALID_UNTIL = 1000 * 60 * 5; // 5 minutes
/**
 * POST /api/create_jetton
 */
const createJetton = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.replace('Bearer ', '');
        if (!token) {
            console.error('Токен не передан');
            return res.status(401).json((0, http_utils_1.unauthorized)({ error: 'Unauthorized' }));
        }
        const isTokenValid = yield (0, jwt_1.verifyToken)(token);
        if (!isTokenValid) {
            console.error('Токен недействителен');
            return res.status(401).json((0, http_utils_1.unauthorized)({ error: 'Unauthorized' }));
        }
        const payload = (0, jwt_1.decodeAuthToken)(token);
        if (!(payload === null || payload === void 0 ? void 0 : payload.address) || !(payload === null || payload === void 0 ? void 0 : payload.network)) {
            console.error('Недействительный токен:', payload);
            return res.status(401).json((0, http_utils_1.unauthorized)({ error: 'Invalid token' }));
        }
        const body = create_jetton_request_dto_1.CreateJettonRequest.parse(req.body);
        // Dynamic import of @ton-community/assets-sdk
        const { JettonMinter, storeJettonMintMessage } = yield Promise.resolve().then(() => __importStar(require('@ton-community/assets-sdk')));
        const { internalOnchainContentToCell } = yield Promise.resolve().then(() => __importStar(require('@ton-community/assets-sdk/dist/utils')));
        const validUntil = Math.round((Date.now() + VALID_UNTIL) / 1000);
        const amount = (0, core_1.toNano)('0.06').toString();
        const walletForwardValue = (0, core_1.toNano)('0.05');
        const senderAddress = ton_1.Address.parse(payload.address);
        const ownerAddress = ton_1.Address.parse(payload.address);
        const receiverAddress = ton_1.Address.parse(payload.address);
        const jettonMaster = JettonMinter.createFromConfig({
            admin: ownerAddress,
            content: internalOnchainContentToCell({
                name: body.name,
                description: body.description,
                image_data: Buffer.from(body.image_data, 'ascii').toString('base64'),
                symbol: body.symbol,
                decimals: body.decimals,
            }),
        });
        if (!jettonMaster.init) {
            return res.status(400).json((0, http_utils_1.badRequest)({ error: 'Invalid jetton master' }));
        }
        const jettonMasterAddress = jettonMaster.address.toString({
            urlSafe: true,
            bounceable: true,
            testOnly: payload.network === sdk_1.CHAIN.TESTNET,
        });
        const stateInitBase64 = (0, core_1.beginCell)()
            .store((0, core_1.storeStateInit)(jettonMaster.init))
            .endCell()
            .toBoc()
            .toString('base64');
        const payloadBase64 = (0, core_1.beginCell)()
            .store(storeJettonMintMessage({
            queryId: BigInt(0),
            amount: BigInt(body.amount),
            from: jettonMaster.address,
            to: receiverAddress,
            responseAddress: senderAddress,
            forwardPayload: null,
            forwardTonAmount: BigInt(1),
            walletForwardValue: walletForwardValue,
        }))
            .endCell()
            .toBoc()
            .toString('base64');
        return res.status(200).json((0, http_utils_1.ok)({
            validUntil: validUntil,
            from: senderAddress.toRawString(),
            messages: [
                {
                    address: jettonMasterAddress,
                    amount: amount,
                    stateInit: stateInitBase64,
                    payload: payloadBase64,
                },
            ],
        }));
    }
    catch (e) {
        if (e instanceof Error) {
            return res.status(400).json((0, http_utils_1.badRequest)({ error: 'Invalid request', trace: e.message }));
        }
        return res.status(400).json((0, http_utils_1.badRequest)({ error: 'Invalid request', trace: String(e) }));
    }
});
exports.createJetton = createJetton;
