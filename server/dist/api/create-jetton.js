"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createJetton = void 0;
const assets_sdk_1 = require("@ton-community/assets-sdk");
const utils_1 = require("@ton-community/assets-sdk/dist/utils");
const core_1 = require("@ton/core");
const ton_1 = require("@ton/ton");
const sdk_1 = require("@tonconnect/sdk");
const create_jetton_request_dto_1 = require("../dto/create-jetton-request-dto");
const http_utils_1 = require("../utils/http-utils");
const jwt_1 = require("../utils/jwt");
const VALID_UNTIL = 1000 * 60 * 5; // 5 minutes
/**
 * Checks the proof and returns an access token.
 *
 * POST /api/create_jetton
 */
const createJetton = async ({ request }) => {
    try {
        const token = request.headers.get('Authorization')?.replace('Bearer ', '');
        if (!token || !await (0, jwt_1.verifyToken)(token)) {
            return (0, http_utils_1.unauthorized)({ error: 'Unauthorized' });
        }
        const payload = (0, jwt_1.decodeAuthToken)(token);
        if (!payload?.address || !payload?.network) {
            return (0, http_utils_1.unauthorized)({ error: 'Invalid token' });
        }
        const body = create_jetton_request_dto_1.CreateJettonRequest.parse(await request.json());
        // specify the time until the message is valid
        const validUntil = Math.round((Date.now() + VALID_UNTIL) / 1000);
        // amount of TON to send with the message
        const amount = (0, core_1.toNano)('0.06').toString();
        // forward value for the message to the wallet
        const walletForwardValue = (0, core_1.toNano)('0.05');
        // who send the jetton create message
        const senderAddress = ton_1.Address.parse(payload.address);
        // who will be the owner of the jetton
        const ownerAddress = ton_1.Address.parse(payload.address);
        // who will receive the jetton
        const receiverAddress = ton_1.Address.parse(payload.address);
        // create a jetton master
        const jettonMaster = assets_sdk_1.JettonMinter.createFromConfig({
            admin: ownerAddress,
            content: (0, utils_1.internalOnchainContentToCell)({
                name: body.name,
                description: body.description,
                image_data: Buffer.from(body.image_data, 'ascii').toString('base64'),
                symbol: body.symbol,
                decimals: body.decimals,
            }),
        });
        if (!jettonMaster.init) {
            return (0, http_utils_1.badRequest)({ error: 'Invalid jetton master' });
        }
        // prepare jetton master address
        const jettonMasterAddress = jettonMaster.address.toString({
            urlSafe: true,
            bounceable: true,
            testOnly: payload.network === sdk_1.CHAIN.TESTNET
        });
        // prepare stateInit for the jetton deploy message
        const stateInitBase64 = (0, core_1.beginCell)()
            .store((0, core_1.storeStateInit)(jettonMaster.init))
            .endCell().toBoc().toString('base64');
        // prepare payload for the jetton mint message
        const payloadBase64 = (0, core_1.beginCell)().store((0, assets_sdk_1.storeJettonMintMessage)({
            queryId: 0n,
            amount: BigInt(body.amount),
            from: jettonMaster.address,
            to: receiverAddress,
            responseAddress: senderAddress,
            forwardPayload: null,
            forwardTonAmount: 1n,
            walletForwardValue: walletForwardValue,
        })).endCell().toBoc().toString('base64');
        return (0, http_utils_1.ok)({
            validUntil: validUntil,
            from: senderAddress.toRawString(),
            messages: [
                {
                    address: jettonMasterAddress,
                    amount: amount,
                    stateInit: stateInitBase64,
                    payload: payloadBase64
                }
            ]
        });
    }
    catch (e) {
        if (e instanceof Error) {
            return (0, http_utils_1.badRequest)({ error: 'Invalid request', trace: e.message });
        }
        return (0, http_utils_1.badRequest)({ error: 'Invalid request', trace: e });
    }
};
exports.createJetton = createJetton;
