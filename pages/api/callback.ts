// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import type { NextApiRequest, NextApiResponse } from 'next';

// this endpoints need to be register to senang pay callback
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // parameter is supposedly to be the same with return URL
  console.log(req.query);
  res.status(200).send('OK');
}
