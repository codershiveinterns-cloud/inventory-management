export const DUPLICATE_SKU_MESSAGE = "Product with this SKU already exists";

export const normalizeSku = (value) => {
  if (value === undefined || value === null) {
    return undefined;
  }

  const normalizedValue = String(value).trim().toUpperCase();

  return normalizedValue || undefined;
};
