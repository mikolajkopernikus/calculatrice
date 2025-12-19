# Calculatrice Mobile PWA

Application de calculatrice pour Android (et iOS) avec les 4 opérations de base.

## 📱 Installation sur Android

### Méthode 1 : Via GitHub Pages (Recommandée)

1. **Créer un compte GitHub** (si vous n'en avez pas) : https://github.com/signup

2. **Créer un nouveau dépôt** :
   - Cliquez sur "New repository"
   - Nom : `calculatrice-mobile`
   - Cochez "Public"
   - Cliquez "Create repository"

3. **Uploader les fichiers** :
   - Cliquez sur "uploading an existing file"
   - Glissez tous les fichiers (sauf README.md)
   - Cliquez "Commit changes"

4. **Activer GitHub Pages** :
   - Allez dans Settings > Pages
   - Source : "Deploy from a branch"
   - Branch : "main" → Dossier : "/ (root)"
   - Cliquez "Save"
   - Attendez 2-3 minutes

5. **Sur votre mobile Android** :
   - Ouvrez Chrome
   - Allez sur : `https://VOTRE-NOM-UTILISATEUR.github.io/calculatrice-mobile`
   - Menu (3 points) → "Installer l'application" ou "Ajouter à l'écran d'accueil"

### Méthode 2 : Via serveur local et tunnel

1. **Installer Python** (si pas déjà installé)

2. **Dans le terminal** :
   ```bash
   cd calculatrice-mobile
   python -m http.server 8000
   ```

3. **Installer ngrok** : https://ngrok.com/download

4. **Créer un tunnel** :
   ```bash
   ngrok http 8000
   ```

5. **Sur votre Android** :
   - Ouvrez l'URL HTTPS fournie par ngrok
   - Installez l'application

### Méthode 3 : Via Netlify (Simple et rapide)

1. **Allez sur** : https://app.netlify.com/drop

2. **Glissez-déposez le dossier** `calculatrice-mobile`

3. **Copiez l'URL générée**

4. **Sur votre Android** :
   - Ouvrez l'URL dans Chrome
   - Installez l'application

## 🎯 Fonctionnalités

- ✅ Addition (+)
- ✅ Soustraction (-)
- ✅ Multiplication (×)
- ✅ Division (/)
- ✅ Nombres décimaux
- ✅ Effacement (C)
- ✅ Suppression caractère (⌫)
- ✅ Fonctionne hors ligne
- ✅ S'installe comme une vraie application

## 🛠️ Technologies

- HTML5
- CSS3
- JavaScript (Vanilla)
- PWA (Progressive Web App)
- Service Worker

## 📝 Notes

- Fonctionne sur Android et iOS
- Pas besoin de Play Store
- Aucun compte développeur requis
- Installation gratuite et immédiate
