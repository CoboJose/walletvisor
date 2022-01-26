const round = (number: number, decimals: number): number => {
  const h = +('1'.padEnd(decimals + 1, '0'));
  return Math.round(number * h) / h;
};

const formatEurNumber = (n: number): string => {
  return Number(round(Math.abs(n), 2)).toLocaleString('de-DE', { style: 'currency', currency: 'EUR' });
};

export default { round, formatEurNumber };
