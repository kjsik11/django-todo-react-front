import type { NextApiRequest, NextApiResponse } from 'next';
import { withErrorHandler } from '@utils/with-error-handler';
import { connectMongo, throwError } from '@utils/common';
import Cors from 'cors';

const cors = Cors({
  methods: ['GET', 'HEAD'],
});

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
function runMiddleware(req: NextApiRequest, res: NextApiResponse, fn: any) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }

      return resolve(result);
    });
  });
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { db } = await connectMongo();

  await runMiddleware(req, res, cors);

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
      {
        $project: {
          _id: 1,
          title: 1,
          content: 1,
          compelete: 1,
        },
      },
    ]);

    const todoList = await cursor.toArray();

    console.log(todoList);

    return res.json({ todoList });
  }

  if (req.method === 'POST') {
    const { title, content } = req.body;

    if (!title || !content) return throwError(res, 8, 404);

    const { insertedId } = await db.collection('todo').insertOne({
      title,
      content,
      compelete: false,
      created: new Date(),
      lastUpdated: new Date(),
      deleted: null,
    });

    return res.status(201).end();
    // return res.json({ insertedId });
  }

  return throwError(res, 1, 400);
};

export default withErrorHandler(handler);
