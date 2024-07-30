import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';

import { checkProof } from './api/check-proof';
import { createJetton } from './api/create-jetton';
import { generatePayload } from './api/generate-payload';
import { getAccountInfo } from './api/get-account-info';
import { healthz } from './api/healthz';

const app = express();

const corsOptions = {
  origin: '*',
  credentials: true,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

const initializeDb = async (): Promise<Database> => {
  return open({
    filename: './database.db',
    driver: sqlite3.Database
  });
};

interface RequestWithDb extends Request {
  db: Database;
}

app.use(async (req: Request, res: Response, next: NextFunction) => {
  const db = await initializeDb();
  (req as RequestWithDb).db = db;
  next();
});

app.post('/api/check_proof', checkProof);
app.post('/api/create_jetton', createJetton);
app.post('/api/generate_payload', generatePayload);
app.get('/api/get_account_info', (req, res) => getAccountInfo(req as RequestWithDb, res));
app.get('/api/healthz', healthz);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
