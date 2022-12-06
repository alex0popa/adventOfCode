const fiboL = (n: number) => {
  let a = 0, b = 1;

  while (--n) [a, b] = [b, a + b];

  return b;
};

console.log(fiboL(50))



type Memo = { [key: number]: number }

const fiboR = (n: number, memo: Memo = {}) => {
  if (n in memo) {
    const x = memo[n];
    
    delete memo[n];

    return x;
  };

  if (n <= 2) return 1;
  
  memo[n] = fiboR(n - 1, memo) + fiboR( n - 2, memo)
  
  return memo[n];
};

console.log(fiboR(7))
console.log(fiboR(8));
console.log(fiboR(50));