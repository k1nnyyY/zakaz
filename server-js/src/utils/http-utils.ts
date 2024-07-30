import { Response } from 'express';

/**
 * Receives a body and returns an HTTP response with the given body and status code 200.
 */
export function ok(body: object) {
  return {
    status: 200,
    body
  };
}

/**
 * Receives a body and returns an HTTP response with the given body and status code 400.
 */
export function badRequest(body: object) {
  return {
    status: 400,
    body
  };
}

/**
 * Receives a body and returns an HTTP response with the given body and status code 401.
 */
export function unauthorized(body: object) {
  return {
    status: 401,
    body
  };
}
