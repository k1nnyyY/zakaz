"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TonProofService = void 0;
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
const validAuthTime = 15 * 60; // 15 minute
class TonProofService {
    /**
     * Generate a random payload.
     */
    generatePayload() {
        return buffer_1.Buffer.from((0, tweetnacl_1.randomBytes)(32)).toString('hex');
    }
    /**
     * Reference implementation of the checkProof method:
     * https://github.com/ton-blockchain/ton-connect/blob/main/requests-responses.md#address-proof-signature-ton_proof
     */
    async checkProof(payload, getWalletPublicKey) {
        try {
            const stateInit = (0, ton_1.loadStateInit)(ton_1.Cell.fromBase64(payload.proof.state_init).beginParse());
            // 1. First, try to obtain public key via get_public_key get-method on smart contract deployed at Address.
            // 2. If the smart contract is not deployed yet, or the get-method is missing, you need:
            //  2.1. Parse TonAddressItemReply.walletStateInit and get public key from stateInit. You can compare the walletStateInit.code
            //  with the code of standard wallets contracts and parse the data according to the found wallet version.
            let publicKey = (0, wallets_data_1.tryParsePublicKey)(stateInit) ?? await getWalletPublicKey(payload.address);
            if (!publicKey) {
                return false;
            }
            // 2.2. Check that TonAddressItemReply.publicKey equals to obtained public key
            const wantedPublicKey = buffer_1.Buffer.from(payload.public_key, 'hex');
            if (!publicKey.equals(wantedPublicKey)) {
                return false;
            }
            // 2.3. Check that TonAddressItemReply.walletStateInit.hash() equals to TonAddressItemReply.address. .hash() means BoC hash.
            const wantedAddress = ton_1.Address.parse(payload.address);
            const address = (0, ton_1.contractAddress)(wantedAddress.workChain, stateInit);
            if (!address.equals(wantedAddress)) {
                return false;
            }
            if (!allowedDomains.includes(payload.proof.domain.value)) {
                return false;
            }
            const now = Math.floor(Date.now() / 1000);
            if (now - validAuthTime > payload.proof.timestamp) {
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
                timestamp: payload.proof.timestamp
            };
            const wc = buffer_1.Buffer.alloc(4);
            wc.writeUInt32BE(message.workchain, 0);
            const ts = buffer_1.Buffer.alloc(8);
            ts.writeBigUInt64LE(BigInt(message.timestamp), 0);
            const dl = buffer_1.Buffer.alloc(4);
            dl.writeUInt32LE(message.domain.lengthBytes, 0);
            // message = utf8_encode("ton-proof-item-v2/") ++
            //           Address ++
            //           AppDomain ++
            //           Timestamp ++
            //           Payload
            const msg = buffer_1.Buffer.concat([
                buffer_1.Buffer.from(tonProofPrefix),
                wc,
                message.address,
                dl,
                buffer_1.Buffer.from(message.domain.value),
                ts,
                buffer_1.Buffer.from(message.payload),
            ]);
            const msgHash = buffer_1.Buffer.from(await (0, crypto_1.sha256)(msg));
            // signature = Ed25519Sign(privkey, sha256(0xffff ++ utf8_encode("ton-connect") ++ sha256(message)))
            const fullMsg = buffer_1.Buffer.concat([
                buffer_1.Buffer.from([0xff, 0xff]),
                buffer_1.Buffer.from(tonConnectPrefix),
                msgHash,
            ]);
            const result = buffer_1.Buffer.from(await (0, crypto_1.sha256)(fullMsg));
            return tweetnacl_1.sign.detached.verify(result, message.signature, publicKey);
        }
        catch (e) {
            return false;
        }
    }
}
exports.TonProofService = TonProofService;
