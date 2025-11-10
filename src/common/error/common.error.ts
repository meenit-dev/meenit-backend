import { HttpStatus } from '@nestjs/common';
import { BaseError } from './base.error';

export class UnauthorizedError extends BaseError {
  statusCode = HttpStatus.UNAUTHORIZED;
}

export class ForbiddenError extends BaseError {
  statusCode = HttpStatus.FORBIDDEN;
}

export class NotFoundError extends BaseError {
  statusCode = HttpStatus.NOT_FOUND;
}

export class BadRequestError extends BaseError {
  statusCode = HttpStatus.BAD_REQUEST;
}

export class DuplicatedError extends BaseError {
  statusCode = HttpStatus.CONFLICT;
}

export class RequestMaxSizeError extends BaseError {
  statusCode = HttpStatus.PAYLOAD_TOO_LARGE;
}

export class InternalServerError extends BaseError {
  statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
}
