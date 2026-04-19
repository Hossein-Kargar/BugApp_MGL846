# Projet BugApp

## Trace d'execution technique - TP4

Ce document sert d'annexe technique pour illustrer l'execution des tests lies au livrable 4, en particulier les tests de boite blanche sur l'unite critique `TicketUpdateView.perform_update()`.

## Unite critique ciblee

- Module cible : `tickets/views.py`
- Unite analysee : `TicketUpdateView.perform_update()`
- Fichier de test associe : `backend/tickets/tests/test_white_box.py`

## Commande d'execution

Commande utilisee pour l'analyse de couverture de l'unite critique :

```sh
pytest tickets/tests/test_white_box.py --cov=tickets.views --cov-report=term-missing
```

## Extrait de sortie observee

La sortie de couverture conservee dans `backend/coverage_terminal.txt` indique les resultats suivants :

```text
Name                                 Stmts   Miss  Cover   Missing
------------------------------------------------------------------
tickets/tests/test_white_box.py         71      0   100%
tickets/views.py                        96     30    69%
------------------------------------------------------------------
TOTAL                                  261     44    83%
```

## Interpretation

- Le fichier de test de boite blanche atteint une couverture de `100%` sur son propre code de test.
- Le module `tickets/views.py`, qui contient l'unite critique analysee, atteint une couverture de `69%` dans cette execution ciblee.
- La couverture totale observee sur l'ensemble rapporte pour le sous-ensemble `tickets` est de `83%`.

## Fichier source de la preuve

La sortie brute de couverture est conservee dans :

- `backend/coverage_terminal.txt`

## Remarque

Cette trace a ete preparee comme preuve technique d'execution pour accompagner les resultats presentes dans le livrable 4.
