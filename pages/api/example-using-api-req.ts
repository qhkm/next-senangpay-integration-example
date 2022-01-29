// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';
import qs from 'qs';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const sandboxMerchantKey = process.env.MERCHANT_KEY; // merchant key
  const sandboxMerchantId = process.env.MERCHANT_ID; // merchant id

  if (!sandboxMerchantId || !sandboxMerchantKey) {
    res.status(400).json({ msg: 'key is missing' });
  }

  // you can send this value from FE
  const detail = 'detail'; // payment detail
  const amount = '12.00'; // must be in 2 decimals
  const order_id = '1643457029'; // order id

  const tobeHashed = sandboxMerchantKey + detail + amount + order_id; // have to be in the correct order to work

  // generate hash
  const hash = crypto
    .createHmac('sha256', sandboxMerchantKey as string)
    .update(tobeHashed)
    .digest('hex');

  // we can passed this info from browser
  const userInfo = {
    name: 'examplename',
    email: 'example@test.com',
    phone: '123812390890',
  };

  const payload = {
    amount,
    detail,
    order_id,
    hash,
    ...userInfo,
  };

  // sandbox url
  const url = `https://sandbox.senangpay.my/payment/${sandboxMerchantId}`;

  try {
    const response = await axios({
      method: 'post',
      url: url,
      data: qs.stringify(payload),
      headers: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
    });

    const { data } = response;

    // handle failed transaction
    if (data?.status_id === '0' || data?.msg === 'Hash_value_is_incorrect') {
      // if the hash value is incorrent, senangpay will return
      res.status(400).json({
        success: false,
        status_id: data.status_id,
        message: data.msg,
      });
    }

    // handle successfull transaction
    if (response.headers['content-type'].includes('text/html')) {
      // senangpay will return the response in html format, so forward that to browser to be rendered
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.write(data);
      res.end();
    }
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false, message: 'Something is wrong' });
  }
}
