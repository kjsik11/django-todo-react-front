import { createError } from '@defines/errors';
import jwt from 'jsonwebtoken';

const JWT_ALGORITHM = 'HS512';
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error('Missing JWT_SECRET');

interface SignTokenOption {
  expiresIn?: string | number;
}
export const signToken = (payload: object, options?: SignTokenOption) => {
  return jwt.sign(payload, JWT_SECRET, { algorithm: JWT_ALGORITHM, ...options });
};

interface VerifyTokenOption {
  ignoreExpired?: boolean;
}
export const verifyToken = <T extends object = any>(
  token: string,
  options?: VerifyTokenOption,
): T => {
  try {
    return jwt.verify(token, JWT_SECRET) as jwt.JwtPayload as T;
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      if (options?.ignoreExpired) {
        return jwt.decode(token) as jwt.JwtPayload as T;
      }

      throw createError('TOKEN_EXPIRED');
    }

    throw createError('INVALID_TOKEN', { name: err.name, message: err.message });
  }
};

export const renewToken = (token: string): string => {
  const payload = verifyToken(token, { ignoreExpired: true });
  return signToken(payload);
};
