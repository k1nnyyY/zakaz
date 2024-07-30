// src/api/create-jetton.ts
import { Request, Response } from 'express';
import { beginCell, storeStateInit, toNano } from '@ton/core';
import { Address } from '@ton/ton';
import { CHAIN } from '@tonconnect/sdk';
import { CreateJettonRequest } from '../dto/create-jetton-request-dto';
import { badRequest, ok, unauthorized } from '../utils/http-utils';
import { decodeAuthToken, verifyToken } from '../utils/jwt';

const VALID_UNTIL = 1000 * 60 * 5; // 5 minutes

/**
 * POST /api/create_jetton
 */
export const createJetton = async (req: Request, res: Response): Promise<Response> => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      console.error('Токен не передан');
      return res.status(401).json(unauthorized({ error: 'Unauthorized' }));
    }

    const isTokenValid = await verifyToken(token);
    if (!isTokenValid) {
      console.error('Токен недействителен');
      return res.status(401).json(unauthorized({ error: 'Unauthorized' }));
    }

    const payload = decodeAuthToken(token);
    if (!payload?.address || !payload?.network) {
      console.error('Недействительный токен:', payload);
      return res.status(401).json(unauthorized({ error: 'Invalid token' }));
    }

    const body = CreateJettonRequest.parse(req.body);

    // Dynamic import of @ton-community/assets-sdk
    const { JettonMinter, storeJettonMintMessage } = await import('@ton-community/assets-sdk');
    const { internalOnchainContentToCell } = await import('@ton-community/assets-sdk/dist/utils');

    const validUntil = Math.round((Date.now() + VALID_UNTIL) / 1000);
    const amount = toNano('0.06').toString();
    const walletForwardValue = toNano('0.05');

    const senderAddress = Address.parse(payload.address as string);
    const ownerAddress = Address.parse(payload.address as string);
    const receiverAddress = Address.parse(payload.address as string);

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
      return res.status(400).json(badRequest({ error: 'Invalid jetton master' }));
    }

    const jettonMasterAddress = jettonMaster.address.toString({
      urlSafe: true,
      bounceable: true,
      testOnly: payload.network === CHAIN.TESTNET,
    });

    const stateInitBase64 = beginCell()
      .store(storeStateInit(jettonMaster.init))
      .endCell()
      .toBoc()
      .toString('base64');

    const payloadBase64 = beginCell()
      .store(
        storeJettonMintMessage({
          queryId: BigInt(0),
          amount: BigInt(body.amount),
          from: jettonMaster.address,
          to: receiverAddress,
          responseAddress: senderAddress,
          forwardPayload: null,
          forwardTonAmount: BigInt(1),
          walletForwardValue: walletForwardValue,
        })
      )
      .endCell()
      .toBoc()
      .toString('base64');

    return res.status(200).json(ok({
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
  } catch (e) {
    if (e instanceof Error) {
      return res.status(400).json(badRequest({ error: 'Invalid request', trace: e.message }));
    }
    return res.status(400).json(badRequest({ error: 'Invalid request', trace: String(e) }));
  }
};
