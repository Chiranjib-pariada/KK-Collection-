/**
 * Currency and date formatting utilities for KK COLLECTION
 */

export const formatINR = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (dateStr: string): string => {
  try {
    const d = new Date(dateStr);
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(d);
  } catch {
    return dateStr;
  }
};

export const formatDateTime = (dateStr: string): string => {
  try {
    const d = new Date(dateStr);
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(d);
  } catch {
    return dateStr;
  }
};

export const generateOrderNumber = (): string => {
  const random = Math.floor(100000 + Math.random() * 900000);
  return `KK-${random}`;
};

export const isValidIndianPincode = (pincode: string): boolean => {
  return /^[1-9][0-9]{5}$/.test(pincode.trim());
};
