const vscode = require("vscode");
const { ajoutLigne } = require("./modifLigne");
const { Complexite } = require("./complexite");

class ComplexiteCpp extends Complexite {
  constructor(val) {
    const n = ComplexiteCpp.calcComplex(val);
    super(val, n);
  }

  static calcComplex(val) {
    if (val.trim() == "") return "0";

    if (val.includes("sort(") || val.includes("stable_sort(")) return "nlogn";
    if (
      val.includes("for ") ||
      val.includes("while ") ||
      val.includes("find(") ||
      val.includes("count(") ||
      val.includes("min_element(") ||
      val.includes("max_element(") ||
      val.includes("reverse(") ||
      val.includes("accumulate(") ||
      val.includes("copy(") ||
      val.includes("fill(")
    )
      return "n";
    if (
      val.includes("binary_search(") ||
      val.includes("lower_bound(") ||
      val.includes("upper_bound(")
    )
      return "logn";

    return "1";
  }
}

function construitArbre(document) {
  let texte = "";
  for (let i = 0; i < document.lineCount; i++) {
    let ligne = document.lineAt(i).text;
    // supprime les commentaires //
    const idxComment = ligne.indexOf("//");
    if (idxComment !== -1) {
      ligne = ligne.slice(0, idxComment);
    }
    texte += ligne + "\n";
  }

  let i = 0;
  let numLigne = 0;

  function parseBloc() {
    const bloc = [];
    let instruction = "";
    let ligneCourante = numLigne;

    while (i < texte.length) {
      const c = texte[i];

      if (c === "\n") {
        numLigne++;
        const ligneActuelle = instruction.trim();
        if (ligneActuelle.startsWith("#include")) {
          instruction = "";
          ligneCourante = numLigne;
        }
        instruction += "\n";
        i++;
        continue;
      }

      if (c === "{") {
        i++;
        const ligneText = instruction.trim();
        instruction = "";
        ligneCourante = numLigne;
        const enfants = parseBloc();
        if (
          ligneText !== "" &&
          !ligneText.startsWith("//") &&
          !ligneText.startsWith("#include")
        ) {
          bloc.push({
            ligne: ligneCourante,
            complex: { [ligneText]: enfants },
          });
        }
        ligneCourante = numLigne;
        continue;
      }

      if (c === "}") {
        i++;
        if (instruction.trim() !== "" && !instruction.trim().startsWith("//")) {
          bloc.push({ ligne: ligneCourante, complex: instruction.trim() });
        }
        instruction = "";

        let suite = "";
        while (i < texte.length && texte[i] !== ";" && texte[i] !== "{") {
          if (texte[i] === "\n") numLigne++;
          suite += texte[i];
          i++;
        }
        suite = suite.trim();

        if (suite.startsWith("while")) {
          i++;
          const doWhile = "do " + suite;
          return [{ ligne: ligneCourante, complex: doWhile, enfants: bloc }];
        }

        return bloc;
      }

      if (c === ";") {
        const ouvertes = (instruction.match(/\(/g) || []).length;
        const fermees = (instruction.match(/\)/g) || []).length;
        if (ouvertes > fermees) {
          instruction += c;
          i++;
          continue;
        }

        i++;
        const ligneText = instruction.trim();
        instruction = "";
        if (ligneText !== "" && !ligneText.startsWith("//")) {
          bloc.push({ ligne: ligneCourante + 1, complex: ligneText });
        }
        ligneCourante = numLigne;
        continue;
      }

      instruction += c;
      i++;
    }

    return bloc;
  }

  return parseBloc();
}

function calcComplex(L, i = 0) {
  if (i >= L.length) return;

  if (typeof L[i].complex === "object") {
    const cle = Object.keys(L[i].complex)[0];
    const enfants = L[i].complex[cle];
    L[i] = {
      ligne: L[i].ligne,
      complex: { complexite: new ComplexiteCpp(cle), enfants: enfants },
    };
    calcComplex(enfants);
  } else {
    L[i] = {
      ligne: L[i].ligne,
      complex: new ComplexiteCpp(L[i].complex),
    };
  }

  calcComplex(L, i + 1);
}

function maxComplexite(L) {
  if (L === undefined || L.length === 0) return new ComplexiteCpp("", "1");

  let max = new ComplexiteCpp("", "0");
  for (let i = 0; i < L.length; i++) {
    let c;
    if (L[i].complex instanceof ComplexiteCpp) {
      c = L[i].complex;
    } else {
      const cle = L[i].complex.complexite;
      const maxEnfants = maxComplexite(L[i].complex.enfants);

      if (cle.val.startsWith("if ") || cle.val.startsWith("else ")) {
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

  if (L[i].complex instanceof ComplexiteCpp) {
    ajoutLigne(document, L[i].complex.O, L[i].ligne, "//");
  } else {
    const cle = L[i].complex.complexite;
    const enfants = L[i].complex.enfants;
    let maxEnfants = maxComplexite(enfants);

    if (cle.val.startsWith("if ") || cle.val.startsWith("else if ")) {
      let j = i + 1;
      while (
        j < L.length &&
        L[j].complex.complexite &&
        (L[j].complex.complexite.val.startsWith("else") ||
          L[j].complex.complexite.val.startsWith("else if "))
      ) {
        maxEnfants = maxEnfants.max(maxComplexite(L[j].complex.enfants));
        j++;
      }
      ajoutLigne(document, `${cle.O} // → ${maxEnfants.O}`, L[i].ligne, "//");
    } else if (cle.val.startsWith("else")) {
      ajoutLigne(document, `${cle.O} // → ${maxEnfants.O}`, L[i].ligne, "//");
    } else {
      ajoutLigne(
        document,
        `${cle.O} // → ${cle.mul(maxEnfants).O}`,
        L[i].ligne,
        "//",
      );
    }

    ecrit(document, enfants);
  }

  ecrit(document, L, i + 1);
}

function calcComplexiteCpp(document) {
  let L = construitArbre(document);
  console.log(L);

  calcComplex(L);
  console.log(L);

  const total = maxComplexite(L);
  ecrit(document, L);
  vscode.window.showInformationMessage(
    `Complexité globale du programme : ${total.O}`,
  );
}

module.exports = { calcComplexiteCpp, construitArbre };
