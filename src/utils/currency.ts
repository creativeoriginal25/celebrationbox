export const formatPrice = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const calculateSubtotal = (price: number, quantity: number): number => {
  return price * Math.max(1, quantity);
};

