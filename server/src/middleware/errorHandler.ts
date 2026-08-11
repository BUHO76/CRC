import type { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import { ApiError } from '../utils/ApiError';

interface MongoDuplicateKeyError {
  code: 11000;
}

function isDuplicateKeyError(err: unknown): err is MongoDuplicateKeyError {
  return typeof err === 'object' && err !== null && 'code' in err && err.code === 11000;
}

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof ZodError) {
    res.status(400).json({ code: 'VALIDATION_ERROR', error: 'Validation failed', issues: err.issues });
    return;
  }

  if (isDuplicateKeyError(err)) {
    res.status(409).json({ code: 'DUPLICATE', error: 'Duplicate value' });
    return;
  }

  if (err instanceof ApiError) {
    res.status(err.statusCode).json({ code: 'API_ERROR', error: err.message });
    return;
  }

  console.error(err);
  res.status(500).json({ code: 'INTERNAL_ERROR', error: 'Internal server error' });
};
