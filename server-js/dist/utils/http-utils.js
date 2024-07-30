"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ok = ok;
exports.badRequest = badRequest;
exports.unauthorized = unauthorized;
/**
 * Receives a body and returns an HTTP response with the given body and status code 200.
 */
function ok(body) {
    return {
        status: 200,
        body
    };
}
/**
 * Receives a body and returns an HTTP response with the given body and status code 400.
 */
function badRequest(body) {
    return {
        status: 400,
        body
    };
}
/**
 * Receives a body and returns an HTTP response with the given body and status code 401.
 */
function unauthorized(body) {
    return {
        status: 401,
        body
    };
}
