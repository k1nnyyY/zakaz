import {CheckProofRequest} from "../dto/check-proof-request-dto.js";
import {TonApiService} from "../services/ton-api-service.js";
import {TonProofService} from "../services/ton-proof-service.js";
import {badRequest, ok} from "../utils/http-utils.js";
import {createAuthToken, verifyToken} from "../utils/jwt.js";

/**
 * Checks the proof and returns an access token.
 *
 * POST /api/check_proof
 */
export const checkProof = async ({request}:any) => {
  try {
    const body = CheckProofRequest.parse(await request.json());

    const client = TonApiService.create(body.network);
    const service = new TonProofService();

    const isValid = await service.checkProof(body, (address) => client.getWalletPublicKey(address));
    if (!isValid) {
      return badRequest({error: 'Invalid proof'});
    }

    const payloadToken = body.proof.payload;
    if (!await verifyToken(payloadToken)) {
      return badRequest({error: 'Invalid token'});
    }

    const token = await createAuthToken({address: body.address, network: body.network});

    return ok({token: token});
  } catch (e) {
    return badRequest({error: 'Invalid request', trace: e});
  }
};
