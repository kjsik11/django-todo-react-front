import type { NextApiRequest, NextApiResponse } from 'next';
import { withErrorHandler } from '@utils/with-error-handler';
import { connectMongo, runMiddleware, throwError } from '@utils/common';
import Cors from 'cors';
import Joi from 'joi';
import { createError } from '@defines/errors';
import { verifySession } from '@utils/auth/verifySession';
import { signToken } from '@utils/auth/jsonwebtoken';
import { ACCESS_TOKEN_EXPIRES_IN } from '@defines/token';
import { serialize } from 'cookie';
import { COOKIE_KEY_ACCESS_TOKEN, defaultCookieOptions } from '@defines/cookie';

const cors = Cors({
  methods: ['GET', 'POST', 'DELETE'],
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await runMiddleware(req, res, cors);

  const { db } = await connectMongo();

  if (req.method === 'POST') {
    const userSchema = Joi.object({
      username: Joi.string().label('username').required(),
      password: Joi.string().label('password').required(),
    });

    await userSchema.validateAsync(req.body);

    const { username, password } = req.body;

    const user = await db.collection('auth').findOne({ username, password, deleted: null });

    if (!user) res.status(404).json(createError('WRONG_ID'));

    const accessToken = signToken({ userId: user._id }, { expiresIn: ACCESS_TOKEN_EXPIRES_IN });

    res.setHeader('Set-Cookie', [
      serialize(COOKIE_KEY_ACCESS_TOKEN, accessToken, {
        ...defaultCookieOptions,
        domain: req.headers.referer ?? undefined,
      }),
    ]);

    return res.status(200).json({ accessToken });
  }

  const { userId } = verifySession(req, res);

  if (req.method === 'GET') {
    const { _id, ...userInfo } = await db.collection('auth').findOne(
      { _id: userId, deleted: null },
      {
        projection: {
          name: 1,
          birth: 1,
        },
      },
    );

    return res.json({ userInfo });
  }

  if (req.method === 'DELETE') {
    res.setHeader('Set-Cookie', [serialize(COOKIE_KEY_ACCESS_TOKEN, '', defaultCookieOptions)]);

    return res.status(204).end();
  }

  return throwError(res, 1, 400);
};

export default withErrorHandler(handler);
