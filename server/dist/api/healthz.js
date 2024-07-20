"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.healthz = void 0;
const http_utils_1 = require("../utils/http-utils");
const healthz = async () => {
    return (0, http_utils_1.ok)({ ok: true });
};
exports.healthz = healthz;
