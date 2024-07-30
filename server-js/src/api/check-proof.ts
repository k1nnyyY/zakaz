import { Request, Response } from 'express';
import TonApiService from '../services/ton-api-service';
import TonProofService from '../services/ton-proof-service';
import { badRequest, ok } from '../utils/http-utils';
import { CheckProofRequest } from '../dto/check-proof-request-dto';
import { verifyToken, createAuthToken } from '../utils/jwt';

/**
 * Checks the proof and returns an access token.
 *
 * POST /api/check_proof
 */
export const checkProof = async (req: Request, res: Response): Promise<void> => {
  try {
    const body = CheckProofRequest.parse(req.body);

    const client = TonApiService.create(body.network);
    const service = new TonProofService();

    const isValid = await service.checkProof(body, (address) => client.getWalletPublicKey(address));
    if (!isValid) {
      res.status(400).json(badRequest({ error: 'Invalid proof' }));
      return;
    }

    const payloadToken = body.proof.payload;
    if (!await verifyToken(payloadToken)) {
      res.status(400).json(badRequest({ error: 'Invalid token' }));
      return;
    }

    const token = await createAuthToken({ address: body.address, network: body.network });

    res.status(200).json(ok({ token: token }));
  } catch (e) {
    if (e instanceof Error) {
      res.status(400).json(badRequest({ error: 'Invalid request', trace: e.message }));
    } else {
      res.status(400).json(badRequest({ error: 'Invalid request', trace: String(e) }));
    }
  }
};
