# GCJ Frontend TODO

## Admin dynamic settings UI
- [x] Step 1: Update `src/components/CollapsibleGroup.jsx` to show explicit `+` and `-` icons (and still animate).

- [x] Step 2: Create new shared component `src/components/AdminSettingsGroups.jsx` that renders:
  - [ ] grouped list
  - [ ] plus/minus expand/collapse per group
  - [ ] each item rendered as a card containing its form (create/edit) + delete.
- [x] Step 3: Replace demo/mock student CRUD in `src/pages/admin/Students.jsx` with dynamic CRUD using `api`.

- [ ] Step 4: Replace demo/mock teachers CRUD in `src/pages/admin/Teachers.jsx` with dynamic CRUD using `api`.

- [ ] Step 5: Replace demo/mock departments CRUD in `src/pages/admin/Departments.jsx` with dynamic CRUD using `api`.
- [ ] Step 6: Replace demo/mock admissions CRUD in `src/pages/admin/Admissions.jsx` with dynamic CRUD using `api`.
- [ ] Step 7: Replace demo/mock notices CRUD in `src/pages/admin/Notices.jsx` with dynamic CRUD using `api`.
- [ ] Step 8: Replace demo/mock gallery CRUD in `src/pages/admin/Gallery.jsx` with dynamic CRUD using `api`.
- [ ] Step 9: Replace demo/mock chatbot logs in `src/pages/admin/ChatbotLogs.jsx` with dynamic CRUD/viewing using `api`.
- [ ] Step 10: Replace demo analytics in `src/pages/admin/Analytics.jsx` with dynamic data using `api`.

## Backend/API compatibility
- [ ] Step 11: Add missing API wrappers to `src/utils/api.js` for all admin CRUD endpoints used by the UI.
- [ ] Step 12: If backend endpoints are missing, implement backend views/urls/models/serializers as needed (or ensure mock fallback still renders correctly).

## Authentication + routes
- [ ] Step 13: Ensure `/portal/login` and `/portal/register` work end-to-end.
- [ ] Step 14: Ensure admin pages are reachable under `/portal/admin/*`.

## Testing
- [ ] Step 15: Run `npm run lint` and `npm run build` for frontend.
- [ ] Step 16: Run backend tests (pytest) if available.
- [ ] Step 17: Manual test checklist:
  - [ ] login/register
  - [ ] admin menu works
  - [ ] groups expand/collapse with +/-
  - [ ] create/edit/delete cards update list
  - [ ] collapse state doesn’t break forms

