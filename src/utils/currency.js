/**
 * Utility functions for Indian Rupee (INR) currency formatting
 */

const inrFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

/**
 * Clean and parse arbitrary currency/string inputs, decoding any accidental HTML entities
 * like &#x30; (hex 0x30 = '0') or &#48; before numeric formatting.
 */
const sanitizeNumericInput = (val) => {
  if (val === undefined || val === null || val === '') return 0;
  if (typeof val === 'number') {
    return isNaN(val) ? 0 : val;
  }
  let str = String(val);
  // Decode hex HTML entities (e.g. &#x30;) and decimal entities (e.g. &#48;)
  str = str
    .replace(/&#x([0-9a-fA-F]+);/gi, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/&#([0-9]+);/g, (_, dec) => String.fromCharCode(parseInt(dec, 10)))
    .replace(/[^0-9.-]/g, '');

  const num = Number(str);
  return isNaN(num) ? 0 : num;
};

/**
 * Format any amount into standard Indian Rupee representation (e.g., ₹0, ₹1,000, ₹1,00,000, ₹1,00,00,000)
 * Uses Intl.NumberFormat('en-IN') and guarantees that no HTML entities are ever emitted.
 */
export const formatINR = (amount) => {
  const numeric = sanitizeNumericInput(amount);
  const rounded = Math.round(numeric);
  const formatted = inrFormatter.format(rounded);

  // Guarantee no entity leakage and ensure proper zero representation
  return formatted
    .replace(/&#x?30;/gi, '0')
    .replace(/&#x?([0-9a-fA-F]+);/gi, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
};

/**
 * Compact Indian currency formatting for high-level summaries (K, Lakh, Cr).
 */
export const formatCompactINR = (amount) => {
  const numeric = sanitizeNumericInput(amount);
  if (numeric === 0) return '₹0';

  const num = Math.abs(numeric);
  const sign = numeric < 0 ? '-' : '';

  if (num >= 10000000) {
    return `${sign}₹${(num / 10000000).toFixed(2).replace(/\.00$/, '')} Cr`;
  }
  if (num >= 100000) {
    return `${sign}₹${(num / 100000).toFixed(2).replace(/\.00$/, '')} Lakh`;
  }
  if (num >= 1000) {
    return `${sign}₹${(num / 1000).toFixed(1).replace(/\.0$/, '')} K`;
  }
  return `${sign}₹${num}`;
};

/**
 * Clean user input from forms into an integer INR number.
 */
export const parseINRInput = (value) => {
  const num = sanitizeNumericInput(value);
  return Math.round(num);
};
