import {ok} from "../utils/http-utils";

export const healthz = async () => {
  return ok({ok: true});
};
