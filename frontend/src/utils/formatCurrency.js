export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'NPR', // NPR fits Daraz-style, can be represented as Rs.
    minimumFractionDigits: 0,
  }).format(amount).replace('NPR', 'Rs.');
};

export default formatCurrency;
