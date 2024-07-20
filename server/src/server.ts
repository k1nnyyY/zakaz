import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

import { checkProof } from "./api/check-proof";
import { createJetton } from "./api/create-jetton";
import { generatePayload } from "./api/generate-payload";
import { getAccountInfo } from "./api/get-account-info";
import { healthz } from "./api/healthz";

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post("/api/check_proof", checkProof);
app.post("/api/create_jetton", createJetton);
app.post("/api/generate_payload", generatePayload);
app.get("/api/get_account_info", getAccountInfo);
app.get("/api/healthz", healthz);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
