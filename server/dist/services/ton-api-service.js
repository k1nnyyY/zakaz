"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TonApiService = void 0;
const ton_1 = require("@ton/ton");
const ui_react_1 = require("@tonconnect/ui-react");
const buffer_1 = require("buffer");
class TonApiService {
    static create(client) {
        if (client === ui_react_1.CHAIN.MAINNET) {
            client = new ton_1.TonClient4({
                endpoint: 'https://mainnet-v4.tonhubapi.com'
            });
        }
        if (client === ui_react_1.CHAIN.TESTNET) {
            client = new ton_1.TonClient4({
                endpoint: 'https://testnet-v4.tonhubapi.com'
            });
        }
        return new TonApiService(client);
    }
    constructor(client) {
        this.client = client;
    }
    /**
     * Get wallet public key by address.
     */
    async getWalletPublicKey(address) {
        const masterAt = await this.client.getLastBlock();
        const result = await this.client.runMethod(masterAt.last.seqno, ton_1.Address.parse(address), 'get_public_key', []);
        return buffer_1.Buffer.from(result.reader.readBigNumber().toString(16).padStart(64, '0'), 'hex');
    }
    /**
     * Get account info by address.
     */
    async getAccountInfo(address) {
        const masterAt = await this.client.getLastBlock();
        return await this.client.getAccount(masterAt.last.seqno, ton_1.Address.parse(address));
    }
}
exports.TonApiService = TonApiService;
