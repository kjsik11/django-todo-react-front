import { isString } from '@utils/validator/common';

const ERROR_VARIANTS = ['CE', 'AE', 'TE'] as const;
type ErrorCode = `${typeof ERROR_VARIANTS[number]}${number}`;

export interface CustomError {
  code: ErrorCode;
  name: string;
  message: string;
}

export function isCustomError(error: any): error is CustomError {
  const { code, name, message } = error;

  if (!isString(code, { minLength: 5, maxLength: 5 }) || !isString(name) || !isString(message)) {
    return false;
  }

  return true;
}

export function createError(
  errName: keyof typeof ERRORS,
  overrides?: Partial<Omit<CustomError, 'code'>>,
): CustomError {
  const err = ERRORS[errName];
  return {
    code: err.code,
    name: overrides?.name || err.name,
    message: overrides?.message || err.message,
  };
}

const ERRORS = {
  // Common Error
  INTERNAL_SERVER_ERROR: {
    code: 'CE000',
    name: 'Internal server error',
    message: 'Unhandled error occured.',
  },
  METHOD_NOT_EXISTS: {
    code: 'CE001',
    name: 'Bad request method',
    message: 'Check request host and/or method.',
  },
  VALIDATION_FAILED: {
    code: 'CE002',
    name: 'Validation failed',
    message: "Check your request's validity.",
  },

  // Authorization Error
  ALREADY_EXIST_USER: {
    code: 'AE000',
    name: 'Already exist user',
    message: 'check your userId.',
  },
  WRONG_ID: {
    code: 'AE001',
    name: 'Wrong id or password',
    message: 'check your input values',
  },

  //Token Error
  TOKEN_EXPIRED: {
    code: 'TE000',
    name: 'Token expired',
    message: 'check your token.',
  },
  INVALID_TOKEN: {
    code: 'TE001',
    name: 'Invalid expired',
    message: 'check your token.',
  },
  TOKEN_EMPTY: {
    code: 'TE002',
    name: 'Token empty',
    message: 'check your token.',
  },
} as const;

export default ERRORS;
