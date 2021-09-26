const round = (number: number, decimals: number): number => {
  const h = +('1'.padEnd(decimals + 1, '0'));
  return Math.round(number * h) / h;
};

export default { round };
