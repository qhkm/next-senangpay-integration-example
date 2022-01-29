import type { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const sandboxMerchantKey = process.env.MERCHANT_KEY; // merchant key
  const sandboxMerchantId = process.env.MERCHANT_ID; // merchant id

  // you can send this detail from FE
  const detail = 'detail1'; // transaction detail
  const amount = '12.00'; // must be in 2 decimals
  const order_id = '1643457029'; // order id
  const tobeHashed = sandboxMerchantKey + detail + amount + order_id;

  const hash = crypto
    .createHmac('sha256', sandboxMerchantKey as string)
    .update(tobeHashed)
    .digest('hex');

  const html = `
  <html>
    <head>
    <title>senangPay Sample Code</title>
    </head>
    <body onload="document.order.submit()">
        <form name="order" method="post" action="https://sandbox.senangpay.my/payment/${sandboxMerchantId}">
            <input type="hidden" name="detail" value="${detail}">
            <input type="hidden" name="amount" value="${amount}">
            <input type="hidden" name="order_id" value="${order_id}">
            <input type="hidden" name="name" value="testing">
            <input type="hidden" name="email" value="test@gmail.com">
            <input type="hidden" name="phone" value="01992223736">
            <input type="hidden" name="hash" value="${hash}">
        </form>
    </body>
    </html>`;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.write(html);
  res.end();
}
