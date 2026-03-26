export const CURRENCY_CODE = 'EUR';
export const CURRENCY_SYMBOL = '\u20AC';

export function formatCurrency(value) {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: CURRENCY_CODE,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(Number(value ?? 0));
}
