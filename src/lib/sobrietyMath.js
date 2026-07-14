export function generateMathQuestion() {
  const type = Math.floor(Math.random() * 3);

  const a = Math.floor(Math.random() * 30) + 15;
  const b = Math.floor(Math.random() * 8) + 3;
  const c = Math.floor(Math.random() * 8) + 3;

  let equation, answer;

  if (type === 0) {
    answer = a + (b * c);
    equation = `${a} + (${b} × ${c})`;
  } else if (type === 1) {
    const product = b * c;
    if (product > a) {
      answer = product - a;
      equation = `(${b} × ${c}) − ${a}`;
    } else {
      answer = a - product;
      equation = `${a} − (${b} × ${c})`;
    }
  } else {
    const d = Math.floor(Math.random() * 12) + 3;
    answer = a + (b * c) - d;
    equation = `${a} + (${b} × ${c}) − ${d}`;
  }

  const options = new Set([answer]);
  while (options.size < 4) {
    const delta = Math.floor(Math.random() * 19) + 1;
    const sign = Math.random() < 0.5 ? -1 : 1;
    const candidate = answer + delta * sign;
    if (candidate >= 0 && candidate !== answer) {
      options.add(candidate);
    }
  }

  const shuffled = [...options].sort(() => Math.random() - 0.5);

  return {
    equation,
    answer,
    options: shuffled,
  };
}