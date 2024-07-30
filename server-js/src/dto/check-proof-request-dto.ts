import { z } from 'zod';
import { CHAIN } from "@tonconnect/ui-react";

export const CheckProofRequest = z.object({
  address: z.string(),
  network: z.enum([CHAIN.MAINNET, CHAIN.TESTNET]),
  public_key: z.string(),
  proof: z.object({
    timestamp: z.union([z.number(), z.string()]).transform((v) => typeof v === 'string' ? parseInt(v) : v),
    domain: z.object({
      lengthBytes: z.number(),
      value: z.string(),
    }),
    payload: z.string(),
    signature: z.string(),
    state_init: z.string(),
  }),
});
