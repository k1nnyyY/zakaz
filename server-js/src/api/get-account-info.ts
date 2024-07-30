// src/api/get-account-info.ts
import { Request, Response } from 'express';
import { ParsedQs } from 'qs'; // Импорт ParsedQs из библиотеки qs
import { ok, badRequest } from '../utils/http-utils';

interface UserId {
  address: string;
  chain: string;
  walletStateInit: string;
  publicKey: string;
}

interface RequestWithDb extends Request {
  db: any; // замените `any` на точный тип базы данных, если он известен
  query: ParsedQs & {
    userId?: UserId;
  };
}

export const getAccountInfo = async (req: RequestWithDb, res: Response): Promise<Response> => {
  try {
    const { userId } = req.query;
    console.log('Полученный userId:', userId);

    if (
      !userId || 
      typeof userId !== 'object' || 
      !userId.address || 
      !userId.chain || 
      !userId.walletStateInit || 
      !userId.publicKey
    ) {
      return res.status(400).json(badRequest({ error: 'Некорректные параметры userId' }));
    }

    const result = await req.db.get('SELECT * FROM users2 WHERE user_id = ?', [userId.address]);
    if (result) {
      return res.status(200).json(ok(result));
    } else {
      return res.status(400).json(badRequest({ error: 'Пользователь не найден' }));
    }
  } catch (error) {
    console.error('Ошибка получения информации об аккаунте:', error);
    if (error instanceof Error) {
      return res.status(400).json(badRequest({ error: 'Некорректный запрос', trace: error.message }));
    } else {
      return res.status(400).json(badRequest({ error: 'Некорректный запрос', trace: String(error) }));
    }
  }
};
