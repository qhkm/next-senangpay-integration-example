// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import type { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';

// this endpoints need to be register to senang pay callback
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const sandboxMerchantKey = process.env.MERCHANT_KEY as string; // merchant key
  const sandboxMerchantId = process.env.MERCHANT_ID; // merchant id
  if (!sandboxMerchantId || !sandboxMerchantKey) {
    res.status(400).json({ msg: 'key is missing' });
  }
  const { status_id, order_id, transaction_id, msg, hash } = req.query;

  const toBeHashed =
    sandboxMerchantKey + status_id + order_id + transaction_id + msg;

  // handle failed transaction
  const generatedHash = crypto
    .createHmac('sha256', sandboxMerchantKey as string)
    .update(toBeHashed)
    .digest('hex');

  // verify hash is the same one
  if (generatedHash === hash) {
    res.status(200).json({ ...req.query });
  } else {
    res.status(200).json({
      success: false,
      msg: 'something wrong with the hash',
    });
  }
}
