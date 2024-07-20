"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tryParsePublicKey = void 0;
var ton_1 = require("@ton/ton");
var buffer_1 = require("buffer");
var wallet_contract_v4_r1_1 = require("./wallet-contract-v4-r1");
var knownWallets = [
    { contract: ton_1.WalletContractV1R1, loadData: loadWalletV1Data },
    { contract: ton_1.WalletContractV1R2, loadData: loadWalletV1Data },
    { contract: ton_1.WalletContractV1R3, loadData: loadWalletV1Data },
    { contract: ton_1.WalletContractV2R1, loadData: loadWalletV2Data },
    { contract: ton_1.WalletContractV2R2, loadData: loadWalletV2Data },
    { contract: ton_1.WalletContractV3R1, loadData: loadWalletV3Data },
    { contract: ton_1.WalletContractV3R2, loadData: loadWalletV3Data },
    { contract: wallet_contract_v4_r1_1.WalletContractV4R1, loadData: loadWalletV4Data },
    { contract: ton_1.WalletContractV4, loadData: loadWalletV4Data },
].map(function (_a) {
    var contract = _a.contract, loadData = _a.loadData;
    return ({
        contract: contract,
        loadData: loadData,
        wallet: contract.create({ workchain: 0, publicKey: buffer_1.Buffer.alloc(32) }),
    });
});
function loadWalletV1Data(cs) {
    var seqno = cs.loadUint(32);
    var publicKey = cs.loadBuffer(32);
    return { seqno: seqno, publicKey: publicKey };
}
function loadWalletV2Data(cs) {
    var seqno = cs.loadUint(32);
    var publicKey = cs.loadBuffer(32);
    return { seqno: seqno, publicKey: publicKey };
}
function loadWalletV3Data(cs) {
    var seqno = cs.loadUint(32);
    var walletId = cs.loadUint(32);
    var publicKey = cs.loadBuffer(32);
    return { seqno: seqno, publicKey: publicKey, walletId: walletId };
}
function loadWalletV4Data(cs) {
    var seqno = cs.loadUint(32);
    var walletId = cs.loadUint(32);
    var publicKey = cs.loadBuffer(32);
    var plugins = cs.loadMaybeRef();
    return { seqno: seqno, publicKey: publicKey, walletId: walletId, plugins: plugins };
}
function tryParsePublicKey(stateInit) {
    if (!stateInit.code || !stateInit.data) {
        return null;
    }
    for (var _i = 0, knownWallets_1 = knownWallets; _i < knownWallets_1.length; _i++) {
        var _a = knownWallets_1[_i], wallet = _a.wallet, loadData = _a.loadData;
        try {
            if (wallet.init.code.equals(stateInit.code)) {
                return loadData(stateInit.data.beginParse()).publicKey;
            }
        }
        catch (e) {
        }
    }
    return null;
}
exports.tryParsePublicKey = tryParsePublicKey;
