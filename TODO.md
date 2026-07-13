# TODO - Refactor Ringan Alas Purwo Wildlife Monitoring

## Milestone 1 — Rapikan lib mongodb
- [x] Copy `src/app/lib/mongodb.ts` ke `src/lib/mongodb.ts`
- [ ] Tambahkan komentar singkat pada `src/lib/mongodb.ts`
- [ ] Update semua import yang memakai `@/app/lib/mongodb` agar menjadi `@/lib/mongodb`
- [ ] Pastikan build/lint tidak error

## Milestone 2 — Validation layer
- [ ] Buat `src/validations/observation.schema.ts` (pindahkan `observationSchema`)
- [ ] Update import schema di file yang butuh

## Milestone 3 — Service layer observation
- [ ] Buat `src/services/observation.service.ts`
- [ ] Pindahkan business logic CRUD (query/parse/serialize/filter) dari actions ke service

## Milestone 4 — Thin actions
- [ ] Refactor `src/actions/observation.actions.ts` jadi thin (auth/session + revalidate/redirect)
- [ ] Pastikan flow CRUD dan UI tetap berjalan

## Milestone 5 (Opsional) — Service layer dashboard
- [ ] Buat `src/services/dashboard.service.ts`
- [ ] Update `src/app/dashboard/page.tsx` agar memakai service

## Milestone 6 — Future AI folders
- [ ] Tambahkan `src/future-ai/*` (placeholder README/folder)

## Checklist regresi fitur
- [ ] Register/Login
- [ ] Session Authentication
- [ ] Middleware Protection
- [ ] Dashboard
- [ ] CRUD Observation
- [ ] Upload Cloudinary
- [ ] Profile Page

