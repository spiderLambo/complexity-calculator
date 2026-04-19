const nerdamer = require("nerdamer/nerdamer.core.js");
require("nerdamer/Algebra.js");

class Complexite {
  constructor(val, n) {
    this.val = val;
    this.n = nerdamer.expand(n).toString();
    this.calcGrandO();
  }

  calcGrandO() {
    const s = nerdamer.expand(this.n.replace(/n\s*logn/g, "logn*n")).toString();
    console.log("calcGrandO s:", s, "this.n:", this.n);

    if (/factorial\([^)]*n[^)]*\)/.test(s)) {
      this.O = "O(n!)";
    } else {
      const expMatch = s.match(/(\d+)\^n/);
      if (expMatch) {
        this.O = `O(${expMatch[1]}^n)`;
      } else {
        const degsWithLog = [
          ...s.matchAll(/logn\*n\^(\d+)|n\^(\d+)\*logn/g),
        ].map((m) => parseInt(m[1] || m[2]));
        if (/logn\*n(?!\^)|n(?!\^)\*logn/.test(s)) degsWithLog.push(1);

        const degs = [...s.matchAll(/(?<!logn\*)n\^(\d+)(?!\*logn)/g)].map(
          (m) => parseInt(m[1]),
        );
        if (/(?<![a-z])n(?!\^)/.test(s)) degs.push(1);

        const maxLog = degsWithLog.length ? Math.max(...degsWithLog) : -1;
        const maxPoly = degs.length ? Math.max(...degs) : 0;
        if (maxLog > maxPoly) {
          if (maxLog >= 4) this.O = `O(n^${maxLog} log n)`;
          else if (maxLog === 3) this.O = "O(n³ log n)";
          else if (maxLog === 2) this.O = "O(n² log n)";
          else if (maxLog === 1) this.O = "O(n log n)";
        } else if (maxLog === maxPoly && maxLog > 0) {
          if (maxLog >= 4) this.O = `O(n^${maxLog} log n)`;
          else if (maxLog === 3) this.O = "O(n³ log n)";
          else if (maxLog === 2) this.O = "O(n² log n)";
          else if (maxLog === 1) this.O = "O(n log n)";
        } else {
          if (maxPoly >= 4) this.O = `O(n^${maxPoly})`;
          else if (maxPoly === 3) this.O = "O(n³)";
          else if (maxPoly === 2) this.O = "O(n²)";
          else if (maxPoly === 1) this.O = "O(n)";
          else if (/logn/.test(s)) this.O = "O(log n)";
          else this.O = "O(1)";
        }
      }
    }
  }

  max(x) {
    let r = this.add(x);
    if (r.O === this.O) return r;
    if (r.O === x.O) return x;
  }

  add(x) {
    let r = new Complexite("", this.n + "+" + x.n);
    return r;
  }

  sub(x) {
    let r = new Complexite("", this.n + "-(" + x.n + ")");
    return r;
  }

  mul(x) {
    let r = new Complexite("", "(" + this.n + ")*(" + x.n + ")");
    console.log("mul:", this.n, "*", x.n, "=", r.n, "O:", r.O);
    return r;
  }

  div(x) {
    let r = new Complexite("", "(" + this.n + ")/(" + x.n + ")");
    return r;
  }
}

module.exports = { Complexite };
