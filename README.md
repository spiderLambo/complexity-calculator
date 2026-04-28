# Complexity Calculator

Une extension VS Code qui calcule la complexité de votre code et l'affiche directement dans l'éditeur.

## Fonctionnalités

- Affiche la complexité asymptotique de chaque ligne directement dans l'éditeur
- Gère les blocs imbriqués (if/else/elif, for, while, do/while)
- Prend en compte les fonctions built-in Python (sorted, sort, min, max, sum, bisect, etc.) et C++ (sort, binary_search, lower_bound, etc.)
- Calcule automatiquement la complexité maximale de chaque bloc et de ses enfants
- Affiche la complexité globale du programme dans une notification
- Permet de supprimer les annotations avec la commande **Decommente**

## Installation

### Option 1 — Installer le fichier `.vsix` (recommandé)

1. Télécharger le fichier `complexity-calculator-0.0.2.vsix`
2. Dans VS Code : `Ctrl+Shift+P` > `Extensions: Install from VSIX`
3. Sélectionner le fichier `.vsix`

### Option 2 — Depuis le code source

1. Cloner le dépôt :
```bash
git clone https://github.com/spiderLambo/complexity-calculator.git
```

2. Installer les dépendances :
```bash
npm install
```

3. Ouvrir le dossier dans VS Code et lancer avec `F5`

## Utilisation

Deux commandes sont disponibles via `Ctrl+Shift+P` :

- **Complex** : calcule et affiche la complexité de chaque ligne
- **Decommente** : supprime les annotations de complexité

## Notation de complexité

L'extension affiche deux valeurs pour chaque bloc :

- La complexité de la ligne elle-même
- La complexité maximale de ses enfants

Par exemple :
```python
for i in range(n):          # → O(n) # → O(n²)
    for j in range(n):      # → O(n) # → O(n)
        print(i, j)         # → O(1)
```

Pour les blocs if/else, l'extension prend le maximum des deux branches :
```python
if condition:               # → O(1) # → O(n log n)
    L.sort()                # → O(n log n)
else:                       # → O(1) # → O(n)
    for i in L:             # → O(n) # → O(n)
        print(i)            # → O(1)
```

## Langages supportés

| Langage | Support |
|---------|---------|
| Python  | ✅      |
| C++     | ✅      |

## Limitations théoriques

D'après le **théorème de Rice**, toute propriété non triviale des programmes est indécidable. Il est donc théoriquement impossible de calculer la complexité exacte d'un programme de manière générale et automatique.

Cette extension effectue une **analyse statique approximative** — elle analyse la structure du code sans l'exécuter. Les résultats sont une estimation et peuvent ne pas refléter la complexité réelle dans tous les cas.

## Limitations connues

- La complexité est calculée de manière statique, pas dynamique
- Les appels de fonctions récursives ne sont pas détectés
- Les fonctions définies par l'utilisateur ne sont pas analysées

Made with ❤️ by Spider Lambo
