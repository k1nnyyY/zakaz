"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ok = ok;
exports.badRequest = badRequest;
exports.unauthorized = unauthorized;
const msw_1 = require("msw");
/**
 * Receives a body and returns an HTTP response with the given body and status code 200.
 */
function ok(body) {
    return msw_1.HttpResponse.json(body, { status: 200, statusText: 'OK' });
}
/**
 * Receives a body and returns an HTTP response with the given body and status code 400.
 */
function badRequest(body) {
    return msw_1.HttpResponse.json(body, {
        status: 400,
        statusText: 'Bad Request'
    });
}
/**
 * Receives a body and returns an HTTP response with the given body and status code 401.
 */
function unauthorized(body) {
    return msw_1.HttpResponse.json(body, {
        status: 401,
        statusText: 'Unauthorized'
    });
}
