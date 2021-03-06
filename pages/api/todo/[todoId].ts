import { connectMongo, throwError, runMiddleware } from '@utils/common';
import { withErrorHandler } from '@utils/with-error-handler';
import Cors from 'cors';
import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

const cors = Cors({
  methods: ['PATCH', 'GET', 'DELETE'],
});

const handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void> = async (req, res) => {
  await runMiddleware(req, res, cors);

  const { todoId } = req.query;

  if (!todoId) return throwError(res, 8, 404);

  const { db } = await connectMongo();

  const todoItem = await db
    .collection('todo')
    .findOne({ _id: new ObjectId(String(todoId)), deleted: null });

  if (!todoItem) return throwError(res, 13, 404);

  if (req.method === 'GET') {
    return res.json({ todoItem });
  }

  if (req.method === 'PATCH') {
    const { upsertedId } = await db.collection('todo').updateOne(
      { _id: todoItem._id },
      {
        $set: {
          done: !todoItem.done,
          lastUpdated: new Date(),
        },
      },
    );

    return res.json({ upsertedId });
  }

  if (req.method === 'DELETE') {
    await db.collection('todo').updateOne(
      { _id: todoItem._id },
      {
        $set: {
          deleted: new Date(),
        },
      },
    );
    return res.status(204).end();
  }

  return throwError(res, 1, 400);
};

export default withErrorHandler(handler);
