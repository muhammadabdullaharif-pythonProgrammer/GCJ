# GCJ Production Upgrade TODO

## Phase 0 — Discovery & Checklist (no code changes)
- [ ] Inventory all backend apps/modules and list their existing models/admin/views/urls/templates
- [ ] Inventory frontend pages/components that render: dashboards, cards, collapsible groups, homepage, footer, contact
- [ ] Identify current hardcoded content sources (backend templates vs frontend constants)
- [ ] Identify expand/collapse implementation and all “+/-” buttons wiring

## Phase 1 — Settings & Admin Stabilization
- [ ] Fix production settings: DEBUG/ALLOWED_HOSTS/SECRET_KEY/env vars/static/media
- [ ] Remove MIGRATION_MODULES migration-disabling so makemigrations/migrate succeed
- [ ] Configure Jazzmin and admin app grouping/cards/collapse UX
- [ ] Ensure admin dashboard loads without template errors

## Phase 2 — Backend Bug Fixes (Auth first)
- [ ] Fix email verification token approach mismatch (signed token vs DB token fields)
- [ ] Validate register/login/verify/logout/refresh endpoints end-to-end
- [ ] Fix any URL routing/import mismatches uncovered during manual inspection

## Phase 3 — Make Content Fully Dynamic
- [ ] Add/repurpose DB models for: homepage hero/statistics/features/about/testimonials/notices/announcements/footer/contact/menus
- [ ] Add/repurpose DB models for academic + finance domains (courses/subjects/students/teachers/attendance/exams/results/assignments/fees/reports)
- [ ] Replace hardcoded template/frontend content with DB-driven admin-managed queries

## Phase 4 — Frontend UI Modernization
- [ ] Ensure all pages use Bootstrap 5 card/table layout consistently
- [ ] Fix expand/collapse logic so every group toggles reliably (no broken buttons)
- [ ] Replace frontend hardcoded lists with API-driven data
- [ ] Fix frontend validation + error states; remove JS console errors

## Phase 5 — Testing & Security Hardening
- [ ] Expand pytest coverage (models/serializers/views/integration)
- [ ] Add RBAC tests per role
- [ ] Add audit/activity logging tests
- [ ] Run: makemigrations, migrate, createsuperuser, runserver

## Phase 6 — Deliverables
- [ ] Updated folder structure
- [ ] Updated models/views/templates/admin/Jazzmin/settings/security
- [ ] Testing report + bug fix / missing features report
- [ ] Performance optimization report (indexes/constraints/query improvements)

