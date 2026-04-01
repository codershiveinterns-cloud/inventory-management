export function parseShopifyWebhookBody(req, res, next) {
  if (!Buffer.isBuffer(req.body)) {
    return next();
  }

  if (req.body.length === 0) {
    req.body = {};
    return next();
  }

  try {
    req.body = JSON.parse(req.body.toString("utf8"));
    return next();
  } catch (error) {
    console.error("Webhook JSON parse failed:", {
      path: req.originalUrl,
      message: error.message,
    });

    return res.status(400).send("Invalid webhook payload");
  }
}

export default parseShopifyWebhookBody;
