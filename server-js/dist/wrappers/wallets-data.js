"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tryParsePublicKey = tryParsePublicKey;
const ton_1 = require("@ton/ton");
const buffer_1 = require("buffer");
const wallet_contract_v4_r1_1 = __importDefault(require("./wallet-contract-v4-r1"));
// Функция для проверки наличия метода create
function hasCreateMethod(contract) {
    return contract && typeof contract.create === 'function';
}
// Дополнительная диагностика
function checkContracts(contracts) {
    contracts.forEach((contract, index) => {
        if (!hasCreateMethod(contract.contract)) {
            console.warn(`Contract at index ${index} does not have a create method.`);
        }
    });
}
const knownWallets = [
    { contract: ton_1.WalletContractV1R1, loadData: loadWalletV1Data },
    { contract: ton_1.WalletContractV1R2, loadData: loadWalletV1Data },
    { contract: ton_1.WalletContractV1R3, loadData: loadWalletV1Data },
    { contract: ton_1.WalletContractV2R1, loadData: loadWalletV2Data },
    { contract: ton_1.WalletContractV2R2, loadData: loadWalletV2Data },
    { contract: ton_1.WalletContractV3R1, loadData: loadWalletV3Data },
    { contract: ton_1.WalletContractV3R2, loadData: loadWalletV3Data },
    { contract: wallet_contract_v4_r1_1.default, loadData: loadWalletV4Data },
    { contract: ton_1.WalletContractV4, loadData: loadWalletV4Data },
];
// Проверка контрактов перед маппингом
checkContracts(knownWallets);
const knownWalletsWithWallets = knownWallets.map(({ contract, loadData }) => ({
    contract: contract,
    loadData: loadData,
    wallet: hasCreateMethod(contract) ? contract.create({ workchain: 0, publicKey: buffer_1.Buffer.alloc(32) }) : null,
}));
function loadWalletV1Data(cs) {
    const seqno = cs.loadUint(32);
    const publicKey = cs.loadBuffer(32);
    return { seqno, publicKey };
}
function loadWalletV2Data(cs) {
    const seqno = cs.loadUint(32);
    const publicKey = cs.loadBuffer(32);
    return { seqno, publicKey };
}
function loadWalletV3Data(cs) {
    const seqno = cs.loadUint(32);
    const walletId = cs.loadUint(32);
    const publicKey = cs.loadBuffer(32);
    return { seqno, publicKey, walletId };
}
function loadWalletV4Data(cs) {
    const seqno = cs.loadUint(32);
    const walletId = cs.loadUint(32);
    const publicKey = cs.loadBuffer(32);
    const plugins = cs.loadMaybeRef();
    return { seqno, publicKey, walletId, plugins };
}
function tryParsePublicKey(stateInit) {
    if (!stateInit.code || !stateInit.data) {
        return null;
    }
    for (const { wallet, loadData } of knownWalletsWithWallets) {
        try {
            if (wallet && wallet.init && wallet.init.code.equals(stateInit.code)) {
                return loadData(stateInit.data.beginParse()).publicKey;
            }
        }
        catch (e) {
            // Handle the error silently
        }
    }
    return null;
}
