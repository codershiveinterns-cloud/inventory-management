import InventoryHistory from "../models/InventoryHistory.js";

export const getHistoryActionFromChange = (change) => {
  if (change > 0) {
    return "added";
  }

  if (change < 0) {
    return "sold";
  }

  return "updated";
};

export const createInventoryHistoryEntry = async ({
  productId,
  change,
  action,
}) => {
  if (!change) {
    return null;
  }

  return InventoryHistory.create({
    productId,
    change,
    action,
    date: new Date(),
  });
};
