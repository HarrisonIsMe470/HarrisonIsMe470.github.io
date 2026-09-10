/** Each cycle visits every track once, with no repeat across cycle boundaries. */
export function createShuffle(count, random = Math.random) {
  let remaining = [];
  let last = -1;
  return {
    next() {
      if (!count) return -1;
      if (!remaining.length) {
        remaining = Array.from({ length: count }, (_, index) => index);
        for (let i = remaining.length - 1; i > 0; i--) {
          const j = Math.floor(random() * (i + 1));
          [remaining[i], remaining[j]] = [remaining[j], remaining[i]];
        }
        if (count > 1 && remaining.at(-1) === last) {
          [remaining[0], remaining[count - 1]] = [remaining[count - 1], remaining[0]];
        }
      }
      last = remaining.pop();
      return last;
    },
    select(index) { last = index; remaining = remaining.filter(value => value !== index); },
  };
}
