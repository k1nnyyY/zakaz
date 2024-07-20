"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unauthorized = exports.badRequest = exports.ok = void 0;
var msw_1 = require("msw");
/**
 * Receives a body and returns an HTTP response with the given body and status code 200.
 */
function ok(body) {
    return msw_1.HttpResponse.json(body, { status: 200, statusText: 'OK' });
}
exports.ok = ok;
/**
 * Receives a body and returns an HTTP response with the given body and status code 400.
 */
function badRequest(body) {
    return msw_1.HttpResponse.json(body, {
        status: 400,
        statusText: 'Bad Request'
    });
}
exports.badRequest = badRequest;
/**
 * Receives a body and returns an HTTP response with the given body and status code 401.
 */
function unauthorized(body) {
    return msw_1.HttpResponse.json(body, {
        status: 401,
        statusText: 'Unauthorized'
    });
}
exports.unauthorized = unauthorized;
