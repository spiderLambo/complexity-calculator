# Complexity Calculator

Une extension VS Code qui calcule la complexité de votre code et l'affiche directement dans l'éditeur.

## Fonctionnalités

- Affiche la complexité asymptotique de chaque ligne directement dans l'éditeur
- Gère les blocs imbriqués (if/else, for, while)
- Prend en compte les fonctions built-in Python (sorted, sort)
- Affiche la complexité globale du programme

## Prérequis

Cette extension nécessite le paquet `nerdamer` installé dans votre projet :

```bash
npm install nerdamer
```

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
| C++     | 🚧 Bientôt disponible |

## Limitations théoriques

D'après le **théorème de Rice**, toute propriété non triviale des programmes est indécidable. Il est donc théoriquement impossible de calculer la complexité exacte d'un programme de manière générale et automatique.

Cette extension effectue une **analyse statique approximative** — elle analyse la structure du code sans l'exécuter. Les résultats sont une estimation et peuvent ne pas refléter la complexité réelle dans tous les cas.

## Limitations connues

- Seul Python est supporté pour le moment
- La complexité est calculée de manière statique, pas dynamique
- Les appels de fonctions récursives ne sont pas détectés
- Les fonctions définies par l'utilisateur ne sont pas analysées

## Licence

Ce projet est sous licence MIT — vous êtes libre de l'utiliser, le modifier et le redistribuer librement.

Made with ❤️ by Spider Lambo