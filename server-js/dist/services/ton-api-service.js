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
Object.defineProperty(exports, "__esModule", { value: true });
const ton_1 = require("@ton/ton");
const buffer_1 = require("buffer");
const ui_react_1 = require("@tonconnect/ui-react");
class TonApiService {
    static create(client) {
        // Добавим этот код для автоматического определения сети
        if (typeof client === 'string' && client.startsWith('test')) {
            client = ui_react_1.CHAIN.TESTNET;
        }
        else if (typeof client === 'string' && client.startsWith('main')) {
            client = ui_react_1.CHAIN.MAINNET;
        }
        if (client === ui_react_1.CHAIN.MAINNET) {
            client = new ton_1.TonClient4({
                endpoint: 'https://mainnet-v4.tonhubapi.com'
            });
        }
        else if (client === ui_react_1.CHAIN.TESTNET) {
            client = new ton_1.TonClient4({
                endpoint: 'https://testnet-v4.tonhubapi.com'
            });
        }
        return new TonApiService(client);
    }
    constructor(client) {
        this.client = client;
    }
    getWalletPublicKey(address) {
        return __awaiter(this, void 0, void 0, function* () {
            const masterAt = yield this.client.getLastBlock();
            const result = yield this.client.runMethod(masterAt.last.seqno, ton_1.Address.parse(address), 'get_public_key', []);
            return buffer_1.Buffer.from(result.reader.readBigNumber().toString(16).padStart(64, '0'), 'hex');
        });
    }
    getAccountInfo(address) {
        return __awaiter(this, void 0, void 0, function* () {
            const masterAt = yield this.client.getLastBlock();
            return yield this.client.getAccount(masterAt.last.seqno, ton_1.Address.parse(address));
        });
    }
}
exports.default = TonApiService;
