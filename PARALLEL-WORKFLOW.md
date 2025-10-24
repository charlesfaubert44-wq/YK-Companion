# Parallel Development Workflow

This document explains how to work on multiple features simultaneously in the YKBuddy project.

## Branch Strategy

We use **GitHub Flow** with focused feature branches for clean, easy integration.

### Current Branch Structure

```
master (baseline - commit 9c9b121)
├── feature/mobile-app-setup
├── feature/web-components
├── feature/supabase-integration
└── feature/web-pages-enhancement
```

## Feature Branches

### 1. feature/mobile-app-setup
**Focus**: Mobile application configuration and setup

**Files to work on:**
- `apps/mobile/app.json` - Expo configuration
- `apps/mobile/package.json` - Mobile dependencies
- `apps/mobile/babel.config.js` - Babel configuration
- `apps/mobile/eas.json` - EAS build settings
- `apps/mobile/tsconfig.json` - TypeScript config
- `apps/mobile/src/app/index.tsx` - Entry point
- `apps/mobile/src/app/(tabs)/*` - Tab navigation screens
- `apps/mobile/src/app/_layout.tsx` - Root layout
- `apps/mobile/src/theme/*` - Mobile theme

**Goals:**
- Complete Expo setup for iOS/Android builds
- Implement tab navigation structure
- Set up mobile-specific theming
- Configure EAS build pipeline

### 2. feature/web-components
**Focus**: Reusable React components for the web application

**Files to work on:**
- `apps/web/src/components/NorthernLogo.tsx` - Aurora orb logo
- `apps/web/src/components/Header.tsx` - Global header
- `apps/web/src/components/YKBuddy*.tsx` - Banner components
- `apps/web/src/components/pixel/*` - Pixel UI components
- `apps/web/src/components/auth/*` - Authentication components

**Goals:**
- Build out component library
- Add Storybook for component documentation
- Ensure components are responsive
- Add prop types and documentation
- Create component tests

### 3. feature/supabase-integration
**Focus**: Backend database and authentication

**Files to work on:**
- `apps/web/src/lib/supabase/client.ts` - Client config
- `apps/web/src/lib/supabase/server.ts` - Server config
- `apps/web/src/types/database.types.ts` - Type definitions
- `apps/web/src/contexts/AuthContext.tsx` - Auth state
- `apps/web/src/middleware.ts` - Auth middleware
- `apps/web/supabase-schema.sql` - Database schema

**Goals:**
- Complete Supabase project setup
- Implement user authentication flow
- Set up database tables and RLS policies
- Create API hooks for data fetching
- Add real-time subscriptions

### 4. feature/web-pages-enhancement
**Focus**: Main web pages and user pathways

**Files to work on:**
- `apps/web/src/app/page.tsx` - Homepage
- `apps/web/src/app/visiting/page.tsx` - Visiting pathway
- `apps/web/src/app/living/page.tsx` - Living pathway
- `apps/web/src/app/moving/page.tsx` - Moving pathway
- `apps/web/src/app/aurora/page.tsx` - Aurora page
- `apps/web/src/app/calculator/page.tsx` - Calculator
- `apps/web/src/app/quiz/page.tsx` - Quiz page
- `apps/web/src/app/seasonal/page.tsx` - Seasonal content

**Goals:**
- Build out content for each pathway
- Add interactive features and tools
- Implement SEO optimization
- Add analytics tracking
- Enhance mobile responsiveness

## Working with Feature Branches

### Switch to a Feature Branch

```bash
# Switch to the branch you want to work on
git checkout feature/mobile-app-setup

# Verify you're on the correct branch
git branch
```

### Making Changes

1. **Work only on files relevant to that feature**
2. **Commit frequently with descriptive messages**
3. **Keep commits focused and atomic**

```bash
# Make your changes to relevant files
# Stage and commit
git add apps/mobile/app.json
git commit -m "feat(mobile): Configure Expo app metadata"

# Continue working
git add apps/mobile/eas.json
git commit -m "feat(mobile): Add EAS build configuration for iOS/Android"
```

### Keeping Branches Updated

Regularly sync your feature branch with master to avoid conflicts:

```bash
# While on your feature branch
git checkout feature/mobile-app-setup

# Fetch latest changes
git fetch origin

# Rebase on master to keep history clean
git rebase master

# If conflicts occur, resolve them and continue
git add <resolved-files>
git rebase --continue
```

### Switching Between Features

You can work on multiple features in parallel:

```bash
# Work on mobile for a while
git checkout feature/mobile-app-setup
# ... make changes ...
git commit -m "feat(mobile): Add tab navigation icons"

# Switch to web components
git checkout feature/web-components
# ... make changes ...
git commit -m "feat(components): Create responsive Header component"

# Switch back to mobile
git checkout feature/mobile-app-setup
# Continue where you left off
```

## Merging Strategy

### When a Feature is Complete

1. **Test thoroughly on the feature branch**
2. **Rebase on latest master**
3. **Create a Pull Request** (or merge directly if you prefer)
4. **Review changes**
5. **Merge to master**
6. **Delete the feature branch** (optional, or keep for reference)

```bash
# Option 1: Pull Request (recommended for teams)
git push origin feature/mobile-app-setup
# Then create PR on GitHub

# Option 2: Direct merge (for solo work)
git checkout master
git merge feature/mobile-app-setup --no-ff
git push origin master
```

### Merge Order Recommendation

For easiest integration, merge in this order:

1. **feature/web-components** - Establishes UI foundation
2. **feature/supabase-integration** - Adds backend capabilities
3. **feature/web-pages-enhancement** - Uses components + backend
4. **feature/mobile-app-setup** - Shares components/backend

This order minimizes conflicts and ensures dependencies are available.

## Best Practices

### ✅ Do's

- **Commit frequently** with clear messages
- **Keep feature branches focused** on their specific area
- **Sync with master regularly** to avoid large conflicts
- **Test on your branch** before merging
- **Use meaningful commit messages**: `feat:`, `fix:`, `docs:`, etc.
- **Push to remote regularly** to backup your work

### ❌ Don'ts

- **Don't work on unrelated files** in a feature branch
- **Don't let branches get too old** (sync often)
- **Don't merge without testing**
- **Don't commit broken code** to master
- **Don't force push** unless you're sure no one else is using the branch

## Quick Reference Commands

```bash
# List all branches
git branch -a

# Switch branches
git checkout feature/mobile-app-setup

# Create and switch to new branch
git checkout -b feature/new-feature

# See what's changed
git status
git diff

# Stage and commit
git add <files>
git commit -m "message"

# Sync with master
git fetch origin
git rebase master

# Push your branch
git push origin feature/mobile-app-setup

# Merge to master
git checkout master
git merge feature/mobile-app-setup --no-ff

# Delete a branch (after merging)
git branch -d feature/mobile-app-setup
```

## Working in VS Code

### Recommended Extensions

- **GitLens** - Enhanced git integration
- **Git Graph** - Visualize branch structure
- **GitHub Pull Requests** - Create PRs directly from VS Code

### VS Code Git Integration

- Use the Source Control panel (Ctrl+Shift+G)
- Click branch name in bottom left to switch branches
- Stage/unstage files with +/- icons
- View diffs by clicking files

## Workflow Example

Here's a typical parallel workflow:

```bash
# Monday: Start mobile work
git checkout feature/mobile-app-setup
# ... work on Expo configuration ...
git commit -m "feat(mobile): Complete Expo setup"

# Tuesday: Switch to web components
git checkout feature/web-components
# ... build Header component ...
git commit -m "feat(components): Add responsive Header"

# Wednesday: Back to mobile
git checkout feature/mobile-app-setup
# ... implement tab navigation ...
git commit -m "feat(mobile): Add tab navigation with icons"

# Thursday: Work on Supabase
git checkout feature/supabase-integration
# ... set up authentication ...
git commit -m "feat(supabase): Implement auth flow"

# Friday: Mobile is done, merge it!
git checkout feature/mobile-app-setup
git rebase master
git checkout master
git merge feature/mobile-app-setup --no-ff
git push origin master
```

## Current Status

**Baseline Commit**: `9c9b121`

**Active Branches:**
- ✅ `master` - Baseline established
- ⏳ `feature/mobile-app-setup` - Ready for work
- ⏳ `feature/web-components` - Ready for work
- ⏳ `feature/supabase-integration` - Ready for work
- ⏳ `feature/web-pages-enhancement` - Ready for work

**Next Steps:**
1. Choose which feature to work on first
2. Checkout that feature branch
3. Start making focused commits
4. Switch between branches as needed
5. Merge when features are complete

---

**Happy Parallel Developing!** 🚀

Questions? Check the git documentation or ask for help!
