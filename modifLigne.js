const vscode = require("vscode");

async function ajoutLigne(document, complex, i, com) {
  const edit = new vscode.WorkspaceEdit();
  const range = new vscode.Range(i, 0, i, document.lineAt(i).text.length);
  edit.replace(
    document.uri,
    range,
    document.lineAt(i).text + ` ${com} → ${complex}`,
  );
  await vscode.workspace.applyEdit(edit);
}

function supprLigne(document, i, com) {
  const edit = new vscode.WorkspaceEdit();

  let ligne = document.lineAt(i).text;

  const range = new vscode.Range(i, 0, i, ligne.length);

  let j = ligne.lastIndexOf(com);
  while (ligne.slice(j, ligne.length).includes("→")) {
    ligne = ligne.slice(0, j).trimEnd();
    j = ligne.lastIndexOf(com);
  }
  edit.replace(document.uri, range, ligne);

  vscode.workspace.applyEdit(edit);
}

module.exports = { ajoutLigne, supprLigne };
