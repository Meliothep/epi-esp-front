# DNDiscord Backend - Guide de Démarrage

## 🚀 Prérequis

- **.NET 8.0 SDK** (https://dotnet.microsoft.com/download)
- **Visual Studio Code** ou **Visual Studio**
- **Discord Developer Application** (voir configuration ci-dessous)

## 🔧 Configuration Discord OAuth

### 1. Va sur Discord Developer Portal
https://discord.com/developers/applications

### 2. Crée une nouvelle application
- Clique "New Application"
- Donne-lui un nom (ex: "DNDiscord")
- Accepte les conditions et crée

### 3. Récupère tes credentials
- Va dans "General Information"
- Copie le **Client ID**
- Clique sur "Reset Secret" et copie le **Client Secret**

### 4. Configure OAuth2
- Va dans "OAuth2" → "General"
- Ajoute une Redirect URI : `http://localhost:3000/auth/callback`
- Sauvegarde

### 5. Mets à jour `appsettings.Development.json`
```json
"Discord": {
  "ClientId": "VOTRE_CLIENT_ID",
  "ClientSecret": "VOTRE_CLIENT_SECRET",
  "RedirectUri": "http://localhost:3000/auth/callback"
}
```

## 🏃 Démarrer le backend

### Option 1 : Avec .NET CLI
```bash
cd C:\WorkspaceVsCode\DNDiscord\Backend
dotnet restore
dotnet run
```

### Option 2 : Avec Visual Studio Code
1. Ouvre le dossier Backend
2. Press F5 pour démarrer avec debugging
3. Visual Studio téléchargera automatiquement les packages

### Option 3 : Avec Visual Studio
1. Ouvre `DNDiscord.Backend.csproj`
2. Appuie sur F5

## ✅ Vérification

Le serveur devrait afficher :
```
╔════════════════════════════════════════╗
║  DNDiscord Backend - Running!          ║
║  API: http://localhost:5000            ║
║  Swagger: http://localhost:5000/swagger║
╚════════════════════════════════════════╝
```

Visite http://localhost:5000/swagger pour explorer les endpoints API.

## 📁 Structure du projet

```
Backend/
├── Controllers/
│   └── AuthController.cs      # OAuth Discord + endpoints
├── Services/
│   ├── DiscordAuthService.cs  # Intégration Discord OAuth
│   └── TokenService.cs        # Génération & validation JWT
├── Models/
│   └── AuthModels.cs          # Types de données
├── Properties/
│   └── launchSettings.json    # Configuration de lancement
├── Program.cs                 # Configuration d'application
├── appsettings.Development.json
└── DNDiscord.Backend.csproj
```

## 🔐 Architecture d'authentification

1. **Frontend** → Utilisateur clique "Se connecter avec Discord"
2. **Discord OAuth** → Redirection vers Discord pour autoriser
3. **Backend** → Reçoit le code, l'échange pour un access token Discord
4. **Backend** → Récupère les données utilisateur Discord
5. **Backend** → Crée/met à jour l'utilisateur et génère un JWT
6. **Frontend** → Reçoit le JWT et le stocke en localStorage
7. **Frontend** → Utilise le JWT pour les requêtes authentifiées

## 🧪 Endpoints disponibles

### POST /api/auth/discord/callback
Échange le code Discord contre un JWT

**Request:**
```json
{
  "code": "authorization_code_from_discord"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "123456789",
    "username": "Aventurier",
    "email": "aventurier@discord.local",
    "discordId": "123456789"
  }
}
```

### GET /api/auth/me
Récupère l'utilisateur actuel (nécessite JWT en header)

**Headers:**
```
Authorization: Bearer {token}
```

### POST /api/auth/logout
Déconnecte l'utilisateur

## 🚨 Troubleshooting

### Port 5000 déjà utilisé?
```bash
# Windows
netstat -ano | findstr :5000

# Tue le processus (remplace PID)
taskkill /PID {PID} /F

# Ou change le port dans launchSettings.json
```

### Packages non téléchargés?
```bash
dotnet restore --no-cache
```

### Erreur de JWT Secret?
Mets à jour la clé secrète dans `appsettings.Development.json` avec une vraie clé aléatoire.

---

**Questions?** Consulte la documentation SolidJS pour le frontend ou ASP.NET Core pour le backend!
