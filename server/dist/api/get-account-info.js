"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAccountInfo = void 0;
const ton_api_service_1 = require("../services/ton-api-service");
const http_utils_1 = require("../utils/http-utils");
const jwt_1 = require("../utils/jwt");
/**
 * Returns account info.
 *
 * GET /api/get_account_info
 */
const getAccountInfo = async ({ request }) => {
    try {
        const token = request.headers.get('Authorization')?.replace('Bearer ', '');
        if (!token || !await (0, jwt_1.verifyToken)(token)) {
            return (0, http_utils_1.unauthorized)({ error: 'Unauthorized' });
        }
        const payload = (0, jwt_1.decodeAuthToken)(token);
        if (!payload?.address || !payload?.network) {
            return (0, http_utils_1.unauthorized)({ error: 'Invalid token' });
        }
        const client = ton_api_service_1.TonApiService.create(payload.network);
        return (0, http_utils_1.ok)(await client.getAccountInfo(payload.address));
    }
    catch (e) {
        return (0, http_utils_1.badRequest)({ error: 'Invalid request', trace: e });
    }
};
exports.getAccountInfo = getAccountInfo;
