import { Request, Response } from 'express';
import { ok } from '../utils/http-utils';

export const healthz = async (req: Request, res: Response): Promise<Response> => {
  return res.status(200).json(ok({ ok: true }));
};
