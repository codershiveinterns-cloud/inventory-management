import InventoryLog from "../models/InventoryLog.js";

const validChangeTypes = new Set(["increase", "decrease"]);

export const validateQuantity = (quantity) => {
  const numericQuantity = Number(quantity);

  if (!Number.isFinite(numericQuantity) || numericQuantity <= 0) {
    throw new Error("Quantity must be a positive number");
  }

  return numericQuantity;
};

export const validateChangeType = (type) => {
  if (!validChangeTypes.has(type)) {
    throw new Error("Type must be either increase or decrease");
  }

  return type;
};

export const getChangeDetailsFromDelta = (delta) => {
  if (!delta) {
    return null;
  }

  return {
    changeType: delta > 0 ? "increase" : "decrease",
    quantity: Math.abs(delta),
  };
};

export const createInventoryLog = async ({ shop, productId, changeType, quantity }) => {
  if (!quantity) {
    return null;
  }

  return InventoryLog.create({
    shop,
    productId,
    changeType,
    quantity,
    date: new Date(),
  });
};
