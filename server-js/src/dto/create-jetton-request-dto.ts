import { z } from "zod";

const CreateJettonRequest = z.object({
  name: z.string(),
  description: z.string(),
  image_data: z.string(),
  symbol: z.string(),
  decimals: z.number(),
  amount: z.string(),
});

export {
  CreateJettonRequest,
};
