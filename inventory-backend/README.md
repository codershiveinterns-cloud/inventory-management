# Inventory Management Backend

Production-ready backend for an Inventory Management System built with Node.js, Express, and MongoDB.

## Features

- Product CRUD APIs
- Inventory change tracking with logs
- Low-stock detection endpoint
- Shopify OAuth placeholder routes
- Webhook placeholder for inventory updates
- Sample seed data for quick setup

## Folder Structure

```text
inventory-backend/
  app.js
  server.js
  config/
    db.js
  controllers/
  data/
  middleware/
  models/
  routes/
  scripts/
  utils/
```

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create your environment file:

```bash
copy .env.example .env
```

3. Update `MONGO_URI` in `.env`.

4. Run the development server:

```bash
npm run dev
```

## Seed Sample Data

```bash
npm run seed
```

## API Endpoints

### Products

- `POST /api/products`
- `GET /api/products`
- `GET /api/products/low-stock`
- `GET /api/products/:id`
- `PUT /api/products/:id`
- `DELETE /api/products/:id`

### Inventory

- `POST /api/inventory/update`
- `GET /api/inventory/logs`

### Shopify Placeholders

- `GET /auth`
- `GET /auth/callback`

### Webhooks

- `POST /webhooks/inventory-update`

## Example Request Bodies

### Create Product

```json
{
  "title": "Bluetooth Scanner",
  "stock": 15,
  "price": 129.99,
  "currency": "EUR"
}
```

Optional product fields:

```json
{
  "sku": "BTS-1000",
  "lowStockThreshold": 5
}
```

### Update Product Stock by Exact Value

```json
{
  "stock": 10
}
```

### Update Product Stock by Change Amount

```json
{
  "change": -3
}
```

### Inventory Update

```json
{
  "productId": "PRODUCT_ID_HERE",
  "quantity": 5,
  "type": "decrease"
}
```

## Notes

- Stock changes are automatically saved in the `InventoryLog` collection with `changeType`, `quantity`, and `date`.
- Products are considered low stock when `stock < lowStockThreshold`.
- Shopify OAuth and webhook logic are scaffolded and ready for later implementation.
