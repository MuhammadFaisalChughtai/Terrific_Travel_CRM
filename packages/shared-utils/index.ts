export const formatCurrency = (amount: number): string => {
  let currencyCode = 'USD';
  let currencySymbol = '';

  // 1. Read from static define or Node.js environment variables (highest priority)
  let sysCode = '';
  let sysSymbol = '';
  if (typeof process !== 'undefined' && process.env) {
    sysCode = process.env.CURRENCY || process.env.VITE_CURRENCY || '';
    sysSymbol = process.env.CURRENCY_SYMBOL || process.env.VITE_CURRENCY_SYMBOL || '';
  }

  // 2. Read from Vite environment variables (compile-time/runtime config files)
  let viteCode = '';
  let viteSymbol = '';
  try {
    if (typeof import.meta !== 'undefined' && (import.meta as any).env) {
      viteCode = (import.meta as any).env.VITE_CURRENCY || (import.meta as any).env.CURRENCY || '';
      viteSymbol = (import.meta as any).env.VITE_CURRENCY_SYMBOL || (import.meta as any).env.CURRENCY_SYMBOL || '';
    }
  } catch (e) {
    // Ignore ReferenceError
  }

  // Determine final values: prefer system/define env over Vite configuration file defaults
  currencyCode = sysCode || viteCode || 'USD';
  currencySymbol = sysSymbol || viteSymbol || '';

  // Sanitize: clean and extract the 3-letter currency code
  if (currencyCode) {
    currencyCode = currencyCode.trim().substring(0, 3).toUpperCase();
  }

  // If custom symbol is provided, format as decimal and prepend symbol
  if (currencySymbol) {
    const formattedAmount = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
    return `${currencySymbol}${formattedAmount}`;
  }

  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
    }).format(amount);
  } catch (error) {
    // Fallback if the currency code is invalid or unsupported
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  }
};

export const formatDate = (date: string | Date): string => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatDateTime = (date: string | Date): string => {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};
