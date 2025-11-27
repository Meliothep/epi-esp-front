# DNDiscord Frontend

Frontend SolidJS pour l'application DNDiscord - Plateforme de jeu de rôle intégrée à Discord.

## 🚀 Structure du projet

```
src/
├── App.tsx                  # Routeur principal et setup des Providers
├── index.tsx               # Point d'entrée de l'application
├── index.css               # Styles globaux (Tailwind CSS)
├── components/
│   └── ProtectedRoute.tsx  # Composant pour protéger les routes
├── pages/
│   ├── LoginPage.tsx       # Page de login
│   ├── DashboardPage.tsx   # Page tableau de bord
│   ├── CharacterCreationPage.tsx  # Création de personnage
│   └── GameBoardPage.tsx   # Plateau de jeu 3D
└── stores/
    ├── userStore.ts        # Store utilisateur (avec Context API)
    └── characterStore.ts   # Store personnages (avec Context API)
```

## 📦 Installation

### Prérequis

- Node.js 18+
- npm ou yarn

### Setup

```bash
npm install
```

## 🔧 Scripts disponibles

### Développement

```bash
npm run dev
```

Démarre le serveur de développement sur `http://localhost:3000`

### Build

```bash
npm run build
```

Compile l'application pour la production dans le dossier `dist/`

### Preview

```bash
npm run preview
```

Prévisualise le build de production localement

## 📚 Architecture

### Stores

#### `userStore.ts`

Gère l'état utilisateur global :

- `user` - Utilisateur actuellement authentifié
- `login()` - Connecter un utilisateur
- `logout()` - Déconnecter l'utilisateur
- `isLoading` - État de chargement

**Utilisation :**

```typescript
import { useUser } from '@/stores/userStore';

function MyComponent() {
  const { user, login, logout } = useUser();
  
  return <div>{user()?.username}</div>;
}
```

#### `characterStore.ts`

Gère les personnages de l'utilisateur :

- `characters` - Liste des personnages
- `addCharacter()` - Ajouter un personnage
- `removeCharacter()` - Supprimer un personnage
- `updateCharacter()` - Mettre à jour un personnage
- `currentCharacter` - Personnage actuellement sélectionné

**Utilisation :**

```typescript
import { useCharacter } from '@/stores/characterStore';

function CharacterList() {
  const { characters, addCharacter } = useCharacter();
  
  return (
    <div>
      {characters().map(char => <div>{char.name}</div>)}
    </div>
  );
}
```

### Routes protégées

Le composant `ProtectedRoute` redirige vers `/login` si l'utilisateur n'est pas authentifié :

```typescript
<Route
  path="/dashboard"
  component={() => (
    <ProtectedRoute>
      <DashboardPage />
    </ProtectedRoute>
  )}
/>
```

## 🛠️ Stack technologique

- **SolidJS** - Framework réactif
- **Solid Router** - Gestion du routage
- **TypeScript** - Typage statique
- **Tailwind CSS** - Framework CSS utility-first
- **Vite** - Build tool et dev server

## 📝 Prochaines étapes

- [ ] Intégration Discord OAuth
- [ ] Connexion au backend (API Gateway Ocelot)
- [ ] Intégration WebSocket pour la synchronisation
- [ ] Implémentation de la grille 3D avec BabylonJS
- [ ] Création d'interface utilisateur complète

## 📄 License

MIT
