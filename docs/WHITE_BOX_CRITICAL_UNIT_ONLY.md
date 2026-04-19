# Analyse Boite Blanche (Unite critique)

**Responsable : Hossein**

## 1. Identification de l'unite

**Unite critique ciblee :** `backend/tickets/views.py`  
**Methode la plus complexe (diagnostic CodeScene) :** `TicketUpdateView.perform_update()`

### Justification (basee sur l'analyse technique)

- Forte densite de decisions conditionnelles (`if`, boucles, `try/except`)
- Chemins d'execution multiples avec cas nominal + cas d'erreur
- Logique metier sensible : notifications, mentions, assignation
- Risque de regression eleve si modification sans tests de chemin

### Resume de complexite

- Methode analysee : `TicketUpdateView.perform_update()`
- Complexite cyclomatique estimee : **11**
- Niveau de criticite : **Eleve**

## 2. Modelisation

### 2.1 Diagramme du flot de controle (Control Flow Graph)

Le graphe ci-dessous modelise le flot de controle principal de `perform_update()`.

![Control Flow Graph - perform_update (genere par IA)](docs/diagrams/cfg_perform_update.svg)

**Figure 1.** CFG genere par IA pour `TicketUpdateView.perform_update()`.

### 2.2 Chemins de base a tester

Chemins minimaux de base pour couvrir les branches critiques de la methode :

1. **Chemin nominal complet**
   - `assigned_to_id` present
   - nouvelles mentions presentes
   - utilisateurs existants
   - notifications envoyees

2. **Chemin sans assignation**
   - `assigned_to_id` absent
   - mentions existantes notifiees
   - pas de notification d'assignation

3. **Chemin sans nouvelles mentions**
   - `mentioned_user_ids` vide
   - traitement limite aux mentions deja liees au ticket

4. **Chemin d'erreur utilisateur mentionne inexistant**
   - `User.DoesNotExist` dans la boucle mentions
   - execution continue sans interruption

5. **Chemin d'erreur utilisateur assigne inexistant**
   - `User.DoesNotExist` lors de la notification d'assignation
   - sortie sans crash

6. **Chemin auto-notification evitee**
   - utilisateur courant == utilisateur cible
   - notification non envoyee (filtrage)

## 3. Synthese

- Unite critique identifiee : `TicketUpdateView.perform_update()` dans `View.py`
- Modele fourni : **Control Flow Graph (genere par IA)**
- Resultat attendu pour les tests boite blanche : couvrir les **6 chemins de base** ci-dessus
