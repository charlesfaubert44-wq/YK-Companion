# Quick Start Guide

Get YKBuddy running on your local machine in 5 minutes.

## Prerequisites

Make sure you have installed:
- Node.js 18+ ([Download](https://nodejs.org/))
- npm 9+
- Git ([Download](https://git-scm.com/))

## Setup Steps

### 1. Clone and Install

```bash
# Clone the repository
git clone <repository-url>
cd YK-Companion

# Install all dependencies
npm install
```

### 2. Start Development Server

```bash
# Start the web app
npm run dev
```

### 3. Open in Browser

- **YKBuddy Web App**: [http://localhost:3000](http://localhost:3000)

That's it! You're ready to start developing.

## What's Next?

### Explore the Documentation

- **[README.md](./README.md)** - Project overview and features
- **[BRAND-IDENTITY.md](./BRAND-IDENTITY.md)** - Complete brand guidelines
- **[THREE-SEGMENT-STRATEGY.md](./docs/THREE-SEGMENT-STRATEGY.md)** - Product strategy

### Check Out the Project Structure

```
YK-Companion/
├── apps/
│   ├── web/                    # Next.js web application
│   │   ├── src/
│   │   │   ├── app/           # Pages (page.tsx, /visiting, /living, /moving)
│   │   │   └── components/    # React components (NorthernLogo, etc.)
│   │   └── tailwind.config.ts # Custom aurora color palette
│   └── mobile/                 # React Native (archived, not deployed)
└── docs/                       # Documentation
```

### Common Commands

```bash
# Development
npm run dev              # Start web app

# Building
npm run build            # Build for production

# Deployment
npx vercel              # Deploy to Vercel

# Code Quality
npm run lint             # Run linter
```

## Troubleshooting

### Port Already in Use

If port 3000 is already in use:

**Windows:**
```bash
# Find process using port 3000
netstat -ano | findstr :3000

# Kill the process (replace PID with the number from above)
taskkill /PID <PID> /F
```

**macOS/Linux:**
```bash
# Kill the process using port 3000
lsof -ti:3000 | xargs kill -9
```

### Module Not Found

```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Build Errors

```bash
# Clear Next.js cache
rm -rf apps/web/.next
npm run dev
```

## Start Building

### Make Your First Change

1. **Customize the homepage**
   - Edit [apps/web/src/app/page.tsx](apps/web/src/app/page.tsx)
   - Change colors in [apps/web/tailwind.config.ts](apps/web/tailwind.config.ts)

2. **Modify the logo**
   - Edit [apps/web/src/components/NorthernLogo.tsx](apps/web/src/components/NorthernLogo.tsx)

3. **Create new pages**
   - Add files in `apps/web/src/app/` (Next.js App Router)
   - Build out `/visiting`, `/living`, and `/moving` pages

### Learn the Stack

- **[Next.js 14 Docs](https://nextjs.org/docs)** - App Router and React Server Components
- **[Tailwind CSS](https://tailwindcss.com/docs)** - Utility-first CSS framework
- **[TypeScript Handbook](https://www.typescriptlang.org/docs/)** - Type safety

## Deployment

YKBuddy is deployed on Vercel:

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy to Vercel
npx vercel
```

Live site: [https://web-f149uve7f-charles-projects-5049ee53.vercel.app](https://web-f149uve7f-charles-projects-5049ee53.vercel.app)

---

Happy coding! 🎉
