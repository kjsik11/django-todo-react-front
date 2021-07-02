import type { NextApiRequest, NextApiResponse } from 'next';
import { withErrorHandler } from '@utils/with-error-handler';
import { connectMongo, runMiddleware, throwError } from '@utils/common';
import Cors from 'cors';

const cors = Cors({
  methods: ['GET', 'POST'],
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await runMiddleware(req, res, cors);

  const { db } = await connectMongo();

  if (req.method === 'GET') {
    const cursor = db.collection('todo').aggregate([
      {
        $match: {
          deleted: { $eq: null },
        },
      },
      {
        $sort: {
          created: -1,
        },
      },
    ]);

    const todoList = await cursor.toArray();

    return res.json({ todoList });
  }

  if (req.method === 'POST') {
    const { title } = req.body;

    if (!title) return throwError(res, 8, 404);

    const { insertedId } = await db.collection('todo').insertOne({
      title,
      done: false,
      created: new Date(),
      lastUpdated: new Date(),
      deleted: null,
    });

    return res.json({ insertedId });
  }

  return throwError(res, 1, 400);
};

export default withErrorHandler(handler);
