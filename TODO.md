# Better Ecommerce Admin TODO

Last updated: 2026-06-18

## Project

- Path: `/home/reannu123/Projects/Scratch/better-ecommerce-admin`
- Status: complete
- Stage: revival
- Branch: `main`
- Portfolio role: Dockerized ecommerce admin dashboard and internal business
  system

## Current Milestone

Revival complete. The project has repeatable development and production-like
verification, and the revival branch was merged through GitHub PR #3.

This milestone is about proving the existing app can be run and understood. It
does not include changing authentication or image providers.

## Definition Of Done

- [x] `docker compose up --build` starts the app and database from the
      documented setup.
- [x] A user can sign in, create or select a store, and exercise the main admin
      workflow.
- [x] `docker compose -f compose.prod.yaml up --build` starts the
      production-like stack and applies migrations.
- [x] README, `.env.example`, screenshots, limitations, and verification
      commands match the repository.
- [x] The revival branch is merged to the default branch and the working tree
      is clean.

## Now

- [x] No active revival tasks remain. Future work belongs under Later or the
      flagship phase.

## Next

- [ ] Reconsider deployment or a case study only after the three-project
      portfolio baseline is complete.

## Later

### Deployment And Portfolio

- [ ] Choose a deployment target and publish a live demo or recorded
      walkthrough.
- [ ] Write a short case study focused on ecommerce operations and repeatable
      Docker delivery.
- [ ] Verify PayMongo webhook signatures before presenting checkout as
      production-ready.
- [ ] Decide whether Better Ecommerce Admin remains the flagship after all
      three revivals are complete.

### Authentication And Image Provider Migration

Trigger: evaluate only after all three revival milestones are complete and this
project is confirmed as the flagship.

- [ ] Inventory every Clerk integration point and the stored user-ID contract.
- [ ] Define authentication requirements, then compare OAuth/OIDC-capable
      solutions.
- [ ] Inventory Cloudinary upload, rendering, deletion, and environment
      dependencies.
- [ ] Compare image-storage options using deployment fit, cost, deletion
      support, transformations, and migration effort.
- [ ] Write a migration plan that preserves existing ownership and image data.
- [ ] Implement the migrations only if they materially improve deployability,
      cost, ownership, or portfolio value.

Acceptance criteria if the migration is approved:

- Users can sign in and sign out through the selected authentication system.
- Protected routes and store ownership remain enforced.
- Images can be uploaded, displayed, replaced, and deleted.
- Existing records are migrated or a documented reset strategy is accepted.
- Clerk and Cloudinary dependencies and environment variables are removed.
- Documentation and verification steps are updated.

## Blocked

- No confirmed external blocker. Clerk and database variables are configured
  locally; the authenticated development smoke test passed on 2026-06-18.
- Cloudinary image-upload and PayMongo checkout verification remain optional
  because those credentials are not required for the revival stopping point.

## Done

- [x] Made the application runnable on the revival branch.
- [x] Added `.env.example`.
- [x] Added project screenshots.
- [x] Documented development and production-like Docker workflows.
- [x] Added multi-stage Docker targets and Compose configurations.
- [x] Added Prisma migrations and optional demo seed data.
- [x] Allowed local product and billboard workflows without Cloudinary.
- [x] Verified `npm run lint` on 2026-06-15.
- [x] Verified both Compose files with `docker compose config --quiet` on
      2026-06-15.
- [x] Verified development Docker smoke test by user confirmation on
      2026-06-18: app loads, Clerk sign-in works, store selection works, and
      the dashboard shows data.
- [x] Verified production-like Docker smoke test by user confirmation on
      2026-06-18: production build works, migrations run, and demo seeding
      works against the production-like database.
- [x] Merged GitHub PR #3 on 2026-06-18:
      https://github.com/reannu123/better-ecommerce-admin/pull/3
