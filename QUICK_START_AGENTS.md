# 🚀 Quick Start for Agents

## Your Role

Check which agent you are and follow the instructions below:

---

## 🎯 AGENT 1: Monetization Features
**Branch:** `dev-monetization`

### Setup
```bash
git checkout dev
git pull origin dev
git checkout -b dev-monetization/sponsor-management
```

### Your Tasks
1. Build Premium Spotlight sponsor management UI
2. Create pricing calculator component
3. Add analytics tracking for sponsor views/clicks

### Start Here
- File: `apps/web/src/app/admin/sponsors/page.tsx`
- Reference: `plan.md` Steps 9-10
- Estimated: 8-10 hours

---

## 📚 AGENT 2: Community Features
**Branch:** `dev-community`

### Setup
```bash
git checkout dev
git pull origin dev
git checkout -b dev-community/knowledge-base
```

### Your Tasks
1. Build Knowledge Base article system
2. Add categories, tags, and search
3. Create user submission workflow
4. Enhance user profiles

### Start Here
- File: `apps/web/src/app/knowledge/page.tsx`
- Reference: `plan.md` Steps 11-12
- Estimated: 10-12 hours

---

## ✨ AGENT 3: Content & SEO
**Branch:** `dev-content`

### Setup
```bash
git checkout dev
git pull origin dev
git checkout -b dev-content/page-layouts
```

### Your Tasks
1. Complete all page layout.tsx files
2. Add SEO meta tags and structured data
3. Polish content pages (About, Contact, etc.)
4. Create Open Graph images

### Start Here
- Files: Multiple `**/layout.tsx` files
- Reference: `plan.md` Phase 2 & 6
- Estimated: 8-10 hours

---

## 🧪 AGENT 4: Testing & Quality
**Branch:** `dev-testing`

### Setup
```bash
git checkout dev
git pull origin dev
git checkout -b dev-testing/component-coverage
```

### Your Tasks
1. Write component tests (aim for 70% coverage)
2. Add hook and API tests
3. Create E2E tests for critical paths
4. Fix any failing tests

### Start Here
- Files: `apps/web/src/components/__tests__/**`
- Reference: `plan.md` Phase 5
- Estimated: 12-15 hours

---

## ⚡ Quick Commands

### Before Starting
```bash
# Always pull latest first!
git checkout dev && git pull origin dev
```

### During Work
```bash
# Commit often
git add .
git commit -m "feat: your descriptive message"

# Test before pushing
npm run lint:fix
npm run format
npm test
```

### When Done with Task
```bash
# Push your work
git push origin [your-branch-name]

# Update AGENT_COORDINATION.md
# Mark your tasks as complete
```

---

## 🚨 Important Rules

1. **NEVER** merge to `main` - always merge to `dev`
2. **NEVER** modify files outside your workstream
3. **ALWAYS** pull from `dev` before starting new work
4. **ALWAYS** run tests before pushing
5. **COORDINATE** database migrations in Slack first

---

## 📞 Need Help?

- **File Conflicts?** Check `AGENT_COORDINATION.md` conflict log
- **Blockers?** Post in #dev-coordination channel
- **Questions?** @mention the lead
- **Merge Issues?** Follow the merge order in coordination doc

---

## 📊 Check Your Progress

Update your section in `AGENT_COORDINATION.md` after each task!

**Happy Coding! 🎉**

