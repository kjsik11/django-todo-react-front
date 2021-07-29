import type { NextApiRequest, NextApiResponse } from 'next';
import { withErrorHandler } from '@utils/with-error-handler';
import { connectMongo, runMiddleware, throwError } from '@utils/common';
import Cors from 'cors';
import Joi from 'joi';
import { createError } from '@defines/errors';

const cors = Cors({
  methods: ['GET', 'POST'],
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await runMiddleware(req, res, cors);

  const { db } = await connectMongo();

  if (req.method === 'POST') {
    const userSchema = Joi.object({
      username: Joi.string().label('username').required(),
      name: Joi.string().label('name').required(),
      password: Joi.string().label('password').required(),
      birth: Joi.number().label('birth'),
    });

    await userSchema.validateAsync(req.body);

    const { username, name, password, birth } = req.body;

    if (await db.collection('auth').findOne({ username, deleted: null }))
      return res.status(400).json(createError('ALREADY_EXIST_USER'));

    await db.collection('auth').insertOne({
      username,
      password,
      name,
      birth: birth ?? null,
      created: new Date(),
      lastUpdated: new Date(),
      deleted: null,
    });

    return res.status(201).end();
  }

  return throwError(res, 1, 400);
};

export default withErrorHandler(handler);
