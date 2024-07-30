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
const crypto_1 = require("@ton/crypto");
const ton_1 = require("@ton/ton");
const buffer_1 = require("buffer");
const tweetnacl_1 = require("tweetnacl");
const wallets_data_1 = require("../wrappers/wallets-data");
const tonProofPrefix = 'ton-proof-item-v2/';
const tonConnectPrefix = 'ton-connect';
const allowedDomains = [
    'ton-connect.github.io',
    'localhost:5173'
];
const validAuthTime = 15 * 60; // 15 minutes
class TonProofService {
    generatePayload() {
        return buffer_1.Buffer.from((0, tweetnacl_1.randomBytes)(32)).toString('hex');
    }
    checkProof(payload, getWalletPublicKey) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const stateInit = (0, ton_1.loadStateInit)(ton_1.Cell.fromBase64(payload.proof.state_init).beginParse());
                let publicKey = (_a = (0, wallets_data_1.tryParsePublicKey)(stateInit)) !== null && _a !== void 0 ? _a : yield getWalletPublicKey(payload.address);
                if (!publicKey) {
                    return false;
                }
                const wantedPublicKey = buffer_1.Buffer.from(payload.public_key, 'hex');
                if (!publicKey.equals(wantedPublicKey)) {
                    return false;
                }
                const wantedAddress = ton_1.Address.parse(payload.address);
                const address = (0, ton_1.contractAddress)(wantedAddress.workChain, stateInit);
                if (!address.equals(wantedAddress)) {
                    return false;
                }
                if (!allowedDomains.includes(payload.proof.domain.value)) {
                    return false;
                }
                const now = Math.floor(Date.now() / 1000);
                const timestamp = typeof payload.proof.timestamp === 'string' ? parseInt(payload.proof.timestamp) : payload.proof.timestamp;
                if (now - validAuthTime > timestamp) {
                    return false;
                }
                const message = {
                    workchain: address.workChain,
                    address: address.hash,
                    domain: {
                        lengthBytes: payload.proof.domain.lengthBytes,
                        value: payload.proof.domain.value,
                    },
                    signature: buffer_1.Buffer.from(payload.proof.signature, 'base64'),
                    payload: payload.proof.payload,
                    stateInit: payload.proof.state_init,
                    timestamp: timestamp
                };
                const wc = buffer_1.Buffer.alloc(4);
                wc.writeUInt32BE(message.workchain, 0);
                const ts = buffer_1.Buffer.alloc(8);
                ts.writeBigUInt64LE(BigInt(message.timestamp), 0);
                const dl = buffer_1.Buffer.alloc(4);
                dl.writeUInt32LE(message.domain.lengthBytes, 0);
                const msg = buffer_1.Buffer.concat([
                    buffer_1.Buffer.from(tonProofPrefix),
                    wc,
                    message.address,
                    dl,
                    buffer_1.Buffer.from(message.domain.value),
                    ts,
                    buffer_1.Buffer.from(message.payload),
                ]);
                const msgHash = buffer_1.Buffer.from(yield (0, crypto_1.sha256)(msg));
                const fullMsg = buffer_1.Buffer.concat([
                    buffer_1.Buffer.from([0xff, 0xff]),
                    buffer_1.Buffer.from(tonConnectPrefix),
                    msgHash,
                ]);
                const result = buffer_1.Buffer.from(yield (0, crypto_1.sha256)(fullMsg));
                return tweetnacl_1.sign.detached.verify(result, message.signature, publicKey);
            }
            catch (e) {
                return false;
            }
        });
    }
}
exports.default = TonProofService;
