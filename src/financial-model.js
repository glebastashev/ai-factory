export const FINANCIAL_DEFAULTS = Object.freeze({
  monthlySavings: 80000,
  extraDeals: 10,
  marginPerDeal: 12000,
  monthlyAiCost: 30000,
  setupCost: 340000
});

export const FINANCIAL_LIMITS = Object.freeze({
  monthlySavings: 1_000_000_000,
  extraDeals: 1_000_000,
  marginPerDeal: 1_000_000_000,
  monthlyAiCost: 1_000_000_000,
  setupCost: 1_000_000_000
});

// Whole rubles and whole completed deals keep the estimate easy to inspect.
// Bounds also keep every intermediate calculation finite and safely sized.
function normalizeInput(value, limit) {
  if (typeof value !== 'string' && typeof value !== 'number') return 0;
  const number = Number(value);
  if (!Number.isFinite(number)) return 0;
  return Math.min(limit, Math.max(0, Math.floor(number)));
}

export function calculateFinancialImpact(values = {}) {
  const inputs = Object.fromEntries(
    Object.entries(FINANCIAL_LIMITS).map(([key, limit]) => [key, normalizeInput(values?.[key], limit)])
  );
  const additionalMargin = inputs.extraDeals * inputs.marginPerDeal;
  const monthlyEffect = inputs.monthlySavings + additionalMargin - inputs.monthlyAiCost;
  // Multiply the integer launch cost first to avoid overstating an exact tenth
  // because of a floating-point error after dividing.
  const paybackMonths = monthlyEffect > 0
    ? Math.ceil((inputs.setupCost * 10) / monthlyEffect) / 10
    : null;

  return { inputs, additionalMargin, monthlyEffect, paybackMonths };
}
