const vscode = require("vscode");
const { ajoutLigne } = require("./modifLigne");
const { Complexite } = require("./complexite");

class ComplexitePy extends Complexite {
  constructor(val) {
    const n = ComplexitePy.calcComplex(val);
    super(val, n);
  }

  static calcComplex(val) {
    if (val.trim() == "") return "0";

    if (val.includes(".sort(") || val.includes("sorted(")) return "nlogn";

    if (
      val.includes("for ") ||
      val.includes("while ") ||
      val.includes("min(") ||
      val.includes("max(") ||
      val.includes("sum(") ||
      val.includes("any(") ||
      val.includes("all(") ||
      val.includes("map(") ||
      val.includes("filter(") ||
      val.includes("zip(") ||
      val.includes("enumerate(") ||
      val.includes("reversed(") ||
      val.includes(".count(") ||
      val.includes(".index(") ||
      val.includes(".reverse(") ||
      val.includes(".remove(") ||
      val.includes(".insert(") ||
      val.includes(".pop(") ||
      (val.includes("in ") && val.includes(":"))
    )
      return "n";

    if (
      val.includes("bisect(") ||
      val.includes("bisect_left(") ||
      val.includes("bisect_right(")
    )
      return "logn";

    return "1";
  }
}

function construitArbre(document) {
  let i = 0;

  function parseBloC(niveauParent) {
    const bloc = [];

    while (i < document.lineCount) {
      const ligne = document.lineAt(i).text;

      const indentation = ligne.length - ligne.trimStart().length;

      if (indentation < niveauParent) break;

      if (indentation === niveauParent) {
        let numligne = i;
        i++;
        const ligneText = ligne.trim();
        if (ligneText == "" || ligneText[0] == "#") continue;
        if (i < document.lineCount) {
          const next = document.lineAt(i).text;
          const nextIndent = next.length - next.trimStart().length;
          if (nextIndent > niveauParent) {
            const enfants = parseBloC(nextIndent);
            bloc.push({ ligne: numligne, complex: { [ligneText]: enfants } });
            continue;
          }
        }
        bloc.push({ ligne: numligne, complex: ligneText });
      } else {
        break;
      }
    }
    return bloc;
  }

  return parseBloC(0);
}

function calcComplex(L, i = 0) {
  if (i >= L.length) return;

  if (typeof L[i].complex === "object") {
    const cle = Object.keys(L[i].complex)[0];
    const enfants = L[i].complex[cle];
    L[i] = {
      ligne: L[i].ligne,
      complex: { complexite: new ComplexitePy(cle), enfants: enfants },
    };
    calcComplex(enfants);
  } else {
    L[i] = {
      ligne: L[i].ligne,
      complex: new ComplexitePy(L[i].complex),
    };
  }

  calcComplex(L, i + 1);
}

function maxComplexite(L) {
  if (L === undefined || L.length === 0) return new ComplexitePy("", "1");

  let max = new ComplexitePy("", "0");
  for (let i = 0; i < L.length; i++) {
    let c;
    if (L[i].complex instanceof ComplexitePy) {
      c = L[i].complex;
    } else {
      const cle = L[i].complex.complexite;
      const maxEnfants = maxComplexite(L[i].complex.enfants);

      if (
        cle.val.startsWith("if ") ||
        cle.val.startsWith("elif ") ||
        cle.val.startsWith("else")
      ) {
        c = cle.max(maxEnfants);
      } else {
        c = cle.max(cle.mul(maxEnfants));
      }
    }
    max = max.max(c);
  }
  return max;
}

function ecrit(document, L, i = 0) {
  if (L === undefined || i >= L.length) return;

  if (L[i].complex instanceof ComplexitePy) {
    ajoutLigne(document, L[i].complex.O, L[i].ligne, "#");
  } else {
    const cle = L[i].complex.complexite;
    const enfants = L[i].complex.enfants;
    let maxEnfants = maxComplexite(enfants);

    if (cle.val.startsWith("if ") || cle.val.startsWith("elif ")) {
      let j = i + 1;
      while (
        j < L.length &&
        L[j].complex.complexite &&
        (L[j].complex.complexite.val.startsWith("else") ||
          L[j].complex.complexite.val.startsWith("elif "))
      ) {
        maxEnfants = maxEnfants.max(maxComplexite(L[j].complex.enfants));
        j++;
      }
      ajoutLigne(document, `${cle.O} # → ${maxEnfants.O}`, L[i].ligne, "#");
    } else if (cle.val.startsWith("else") || cle.val.startsWith("elif ")) {
      ajoutLigne(document, `${cle.O} # → ${maxEnfants.O}`, L[i].ligne, "#");
    } else {
      console.log("enfants de", cle.val, ":", JSON.stringify(enfants));
      ajoutLigne(
        document,
        `${cle.O} # → ${cle.mul(maxEnfants).O}`,
        L[i].ligne,
        "#",
      );
    }

    ecrit(document, enfants);
  }
  ecrit(document, L, i + 1);
}

function calcComplexitePy(document) {
  let L = construitArbre(document);
  calcComplex(L);
  console.log(L);

  const total = maxComplexite(L);
  ecrit(document, L);
  vscode.window.showInformationMessage(
    `Complexité globale du programme : ${total.O}`,
  );
}

module.exports = { calcComplexitePy };
