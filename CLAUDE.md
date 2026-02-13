# Claude Code Instructions

This file contains instructions for Claude Code when working on the ComBuilders ES project.

## Project Overview

This is a React + TypeScript + Vite project for the ComBuilders España community website. It uses:
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Router**: React Router (HashRouter)
- **UI Library**: shadcn/ui with Radix UI components
- **Styling**: Tailwind CSS
- **Deployment**: GitHub Pages (gh-pages branch)

## Commit Message Conventions

**IMPORTANT**: All commits must follow the conventional commits format:

```
tipo(alcance): descripción
```

### Tipos de commit válidos:
- `feat`: Nueva funcionalidad
- `fix`: Corrección de bugs
- `docs`: Cambios en documentación
- `style`: Cambios de formato (espacios, punto y coma, etc)
- `refactor`: Refactorización de código
- `test`: Añadir o modificar tests
- `chore`: Tareas de mantenimiento
- `perf`: Mejoras de rendimiento
- `ci`: Cambios en CI/CD
- `build`: Cambios en el sistema de build
- `revert`: Revertir commits anteriores

**Referencias**: [Más información sobre tipos de commit](https://gist.github.com/kolynzb/2e6a57511e300940773dc2e2fa8c0567#commit-types)

### Ejemplos:
```bash
feat(idiomas): agrega soporte para francés
fix(navegación): corrige enlace roto en el menú
docs(readme): actualiza instrucciones de instalación
style(iniciativas): mejora espaciado en tarjetas
refactor(componentes): simplifica lógica del selector de idioma
```

### Co-authored commits:
Todos los commits deben incluir:
```
Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
```

## Deployment

**Automatic Deployment**:
- Pushing to `master` branch automatically triggers deployment to GitHub Pages
- GitHub Action builds the project and deploys to `gh-pages` branch
- Workflow file: `.github/workflows/deploy.yml`
- Can also be triggered manually via GitHub Actions tab

**No manual deployment needed** - just push to master.

## Development Workflow

### Local Setup
```bash
npm install          # Install dependencies
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
```

### Branch Naming Convention
```bash
git checkout -b tu-gh-handler/descripcion-del-cambio
```

## Project Structure

```
src/
├── components/     # React components
│   └── ui/        # shadcn/ui components
├── contexts/      # React contexts (LanguageContext)
├── data/          # Static data (FAQ, initiatives)
├── hooks/         # Custom React hooks
├── lib/           # Utility libraries
├── pages/         # Page components
└── services/      # Services (members API)
```

## Multi-language Support

The project supports multiple languages through `LanguageContext`:
- Language files: `src/contexts/LanguageContext.tsx`
- Data translations: `src/data/faq.json`, `src/data/initiatives.json`
- When adding UI text, always add translations for all supported languages

## Adding New Routes

1. Create page component in `src/pages/`
2. Import and add route in `src/App.tsx`
3. Add route **before** the catch-all `*` route

Example:
```tsx
<Route path="/new-page" element={<NewPage />} />
```

## Coding Conventions

1. **TypeScript**: Use proper typing, avoid `any`
2. **Components**: Functional components with hooks
3. **Styling**: Use Tailwind CSS classes
4. **File naming**: PascalCase for components, camelCase for utilities
5. **Imports**: Use `@/` alias for src imports

## Important Notes

- **HashRouter**: The project uses HashRouter, so URLs will have `#/` prefix
- **GitHub Pages**: Site is deployed from `gh-pages` branch
- **Images**: Place in `public/images/` directory
- **Contributing**: See CONTRIBUTING.md for detailed contribution guidelines

## When Making Changes

1. Read existing code before suggesting modifications
2. Follow established patterns in the codebase
3. Maintain multi-language support for UI changes
4. Test locally before committing
5. Use conventional commit messages
6. Keep changes focused and atomic
