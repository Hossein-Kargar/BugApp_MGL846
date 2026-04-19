# Projet BugApp

## Journal chronologique des activites de test

Periode couverte : mars-avril 2026

Source principale : historique Git du projet et repartition des taches de l'equipe.

### Legende

- `A` = Analyse / preparation
- `I` = Implementation
- `E` = Execution
- `S` = Stabilisation / correction
- `D` = Documentation / synthese
- `.` = Aucune trace retenue pour la date

## Mars 2026

| Activite | 06 | 12 | 15 | 16 | 17 | 18 | 26 | 27 | 29 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| CI/CD et preparation Playwright | A | I | . | . | . | . | . | . | . |
| Smoke tests frontend Playwright | . | A | . | . | . | . | S | I/E | . |
| Configuration pytest / pytest-cov | . | . | . | A/I | . | . | . | . | . |
| Tests smoke backend USERS | . | . | . | I/E | . | . | . | . | . |
| Tests smoke backend TICKETS | . | . | . | . | I/E | . | . | . | . |
| Tests smoke backend COMMENTS | . | . | . | . | I/E | . | . | . | . |
| Tests smoke backend globaux | . | . | . | . | . | I/E | . | . | . |
| Nettoyage pycache / artefacts Python | . | . | A | . | . | . | . | . | S |
| Tests boite noire AUTH / USERS | . | . | . | . | . | . | . | . | . |
| Tests boite blanche unite critique | . | . | . | . | . | . | . | . | . |
| Documentation white-box / diagrammes | . | . | . | . | . | . | . | . | . |

## Avril 2026

| Activite | 18 | 19 |
| --- | --- | --- |
| Validation pipeline GitHub Actions | S | . |
| Tests boite blanche unite critique | . | A/I/E |
| Documentation white-box / diagrammes | . | D |
| Mise a jour README / instructions de test | . | D |
| Assemblage des preuves techniques TP4 | . | D |
| Tests boite noire AUTH / USERS | . | . |

## Justification des activites

- CI/CD et preparation Playwright : commits du 12 mars 2026 lies au workflow E2E, a la configuration Playwright et aux ajustements CI.
- Smoke tests frontend Playwright : activites observees le 12 mars puis stabilisation et finalisation les 26 et 27 mars 2026.
- Configuration pytest / pytest-cov : initialisation et ajustements le 16 mars 2026.
- Tests smoke backend USERS, TICKETS, COMMENTS et globaux : ajout progressif entre le 16 et le 18 mars 2026.
- Nettoyage des artefacts Python : nettoyage initial le 15 mars puis consolidation le 29 mars 2026.
- Validation pipeline GitHub Actions : stabilisation observee le 18 avril 2026.
- Tests boite blanche et documentation associee : ajout et integration le 19 avril 2026.

## Remarque

Les dates exactes des tests boite noire AUTH / USERS doivent etre validees avec la personne responsable, car elles n'apparaissent pas explicitement dans les commits analyses sur la periode observee.
