const currency = (n) => {
  if (n) return n.toLocaleString('ja-JP', {style: 'currency', currency: 'JPY'})
  n = 0;
  return n.toLocaleString('ja-JP', {style: 'currency', currency: 'JPY'});
};

export default currency;
