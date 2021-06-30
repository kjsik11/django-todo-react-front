import { NextApiRequest, NextApiResponse } from 'next';

const runMiddleware: (req: NextApiRequest, res: NextApiResponse, fn: any) => Promise<unknown> = (
  req,
  res,
  fn,
) => {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: unknown) => {
      if (result instanceof Error) {
        return reject(result);
      }

      return resolve(result);
    });
  });
};

export default runMiddleware;
