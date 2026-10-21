import { describe, it, expect } from 'vitest';
import {
  formatINR,
  formatCompactINR,
  parseINRInput,
} from '../utils/currency';

describe('Currency Utility (formatINR & parseINRInput)', () => {
  it('formats positive integers in Indian Rupee style with symbol', () => {
    const formatted = formatINR(1500000);
    expect(formatted).toContain('₹');
    expect(formatted).toContain('15,00,000');
  });

  it('formats zero cleanly without HTML entities like &#x30;', () => {
    const formatted = formatINR(0);
    expect(formatted).toBe('₹0');
    expect(formatted).not.toContain('&');
    expect(formatted).not.toContain('#');
  });

  it('handles string numbers gracefully', () => {
    const formatted = formatINR('50000');
    expect(formatted).toContain('50,000');
  });

  it('handles negative numbers correctly', () => {
    const formatted = formatINR(-25000);
    expect(formatted).toContain('-');
    expect(formatted).toContain('25,000');
  });

  it('handles null, undefined, and NaN by returning ₹0', () => {
    expect(formatINR(null)).toBe('₹0');
    expect(formatINR(undefined)).toBe('₹0');
    expect(formatINR('invalid-number')).toBe('₹0');
  });

  it('parses formatted INR currency strings back into integer values', () => {
    expect(parseINRInput('₹15,00,000')).toBe(1500000);
    expect(parseINRInput('₹50,000')).toBe(50000);
    expect(parseINRInput('₹0')).toBe(0);
    expect(parseINRInput('invalid')).toBe(0);
    expect(parseINRInput('₹&#x30;')).toBe(0);
  });

  it('formats compact INR for large numbers in Thousands, Lakhs, and Crores', () => {
    expect(formatCompactINR(500)).toBe('₹500');
    expect(formatCompactINR(0)).toBe('₹0');
    expect(formatCompactINR(50000)).toBe('₹50 K');
    expect(formatCompactINR(1500000)).toBe('₹15 Lakh');
    expect(formatCompactINR(25000000)).toBe('₹2.50 Cr');
  });

  it('handles negative numbers in compact formatting', () => {
    const compactNeg = formatCompactINR(-50000);
    expect(compactNeg).toBe('-₹50 K');
  });
});
