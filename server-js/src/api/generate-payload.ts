import { Request, Response, NextFunction } from 'express';
import TonProofService from '../services/ton-proof-service';
import { badRequest, ok } from '../utils/http-utils';
import { createPayloadToken } from '../utils/jwt';

/**
 * Generates a payload for ton proof.
 *
 * POST /api/generate_payload
 */
export const generatePayload = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const service = new TonProofService();

    const payload = service.generatePayload();
    const payloadToken = await createPayloadToken({ payload: payload });

    res.status(200).json(ok({ payload: payloadToken }));
  } catch (e) {
    if (e instanceof Error) {
      res.status(400).json(badRequest({ error: 'Invalid request', trace: e.message }));
    } else {
      res.status(400).json(badRequest({ error: 'Invalid request', trace: String(e) }));
    }
    next(e);
  }
};
