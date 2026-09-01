# World Unfolded — IMPLEMENTATION_PLAN.md

**Status:** Governs implementation order and phase boundaries, per `AGENT.md` Section 2. Does not change product scope (`PRD.md`) or technical structure (`ARCHITECTURE.md`).

**Document alignment confirmed:** `PRD.md` now uses "Countries visited" and "Destinations visited" throughout — the prior "cities visited" wording has been fully removed. `AGENT.md` has been checked and contains no corrupted fragment as delivered.

**Rule for every phase below:** Codex works on exactly one phase, stops, reports, and waits for Ivy's approval before starting the next. No phase may be combined with another.

---

## Phase 0: Project Audit and Setup

**Objective:** Establish a safe, verified starting point without building any product screens.

**Dependencies:** None — this is the first phase.

**Tasks:**
1. Check whether the project already exists in the current directory/repository.
2. Inspect Git status and existing files, if any.
3. Report current environment: OS, Node version, npm version.
4. If no project exists, create the Expo TypeScript project. If a project already exists, do not recreate it.
5. Confirm and report actual installed versions: npm, Expo SDK, React Native, React, Expo Router, TypeScript.
6. Install only foundation dependencies explicitly approved in `ARCHITECTURE.md` (Expo Router, TypeScript, Zustand, AsyncStorage, `expo-image` — not map libraries yet, which arrive in Phase 7).
7. Create the four governing documents (`PRD.md`, `ARCHITECTURE.md`, `AGENT.md`, `IMPLEMENTATION_PLAN.md`) in the repository if not already present.
8. Establish `.gitignore` (excluding `.env*` except `.env.example`) and `.env.example`.
9. Run the unmodified starter project to confirm it boots.
10. Run TypeScript, lint, Expo Doctor, and an Expo web build against the unmodified starter.
11. Create the initial Git checkpoint.

**Expected files/directories affected:** Project root scaffold, `.gitignore`, `.env.example`, the four governing documents, `package.json`.

**Explicit exclusions:** No product screens, no routes beyond the Expo default starter, no map libraries, no content models.

**Acceptance criteria:** Project exists and boots; all four governing documents present in the repo; starter project passes TypeScript, lint, Expo Doctor, and Expo web build with no errors.

**Required commands/checks:** `npx tsc --noEmit`, project lint command, `npx expo-doctor`, `npx expo export -p web` (or equivalent web build command confirmed at setup), `npx expo start` smoke check.

**Manual verification:** Confirm the starter app actually renders in Expo Go and in a browser.

**Stop condition:** After the initial Git checkpoint and passing checks — before any product code is written.

**Expected Git checkpoint:** "Phase 0: project audit and foundation setup."

---

## Phase 1: Architecture Foundation

**Objective:** Establish the approved technical skeleton — routing, folder structure, and token *structure* — without any expressive visual design.

**Dependencies:** Phase 0 complete and approved.

**Tasks:**
1. Create the approved folder structure from `ARCHITECTURE.md` Section 2.
2. Create the root layout (`app/_layout.tsx`) with the redirect to `/(tabs)/discover`.
3. Create the stable JavaScript tab layout (`app/(tabs)/_layout.tsx`).
4. Confirm the Discover root redirect works.
5. Create empty route files only for the approved screens (Discover, Explore, Map, Saved, Passport, Profile, Destination Details, Discovery Item Details, Image Credits) — placeholder content only, no expressive UI.
6. Configure strict TypeScript.
7. Configure path aliases matching the folder structure.
8. Establish semantic design token *structure* (color/typography/spacing/radius/elevation/motion/breakpoint slots) with no final expressive values.
9. Define shared state component interfaces (Zustand store shapes for Profile/Saved/Passport, not yet wired to persistence).
10. Configure the test runner, with exact compatibility (Jest/RNTL versions, navigation testing utility) verified against the installed Expo/Router version rather than assumed.
11. Write basic route smoke tests confirming each screen renders and the root redirect works.

**Expected files/directories affected:** `app/`, `src/types/`, `src/tokens/` (structure only), `src/state/` (interfaces only), test configuration files.

**Explicit exclusions:** No final colors, typography, or expressive component styling. No content models yet (Phase 2). No map implementation yet (Phase 7).

**Acceptance criteria:** All approved routes exist and render (as placeholders); root redirects to Discover; tab bar navigates correctly between all five tabs; TypeScript strict mode passes with no errors; smoke tests pass.

**Required commands/checks:** TypeScript, lint, route smoke tests, Expo web build.

**Manual verification:** Manually navigate all five tabs and confirm back behavior on any placeholder detail route.

**Stop condition:** After smoke tests pass and the git checkpoint is created — before the visual direction gate.

**Expected Git checkpoint:** "Phase 1: architecture foundation and routing skeleton."

---

## ⛔ Visual Direction Approval Gate (mandatory, non-coding)

**This is not a phase Codex executes — it is a stop.** Before any expressive screen work begins, Ivy and ChatGPT must approve:

1. Brand palette.
2. Typography.
3. Photography treatment.
4. Layout character.
5. Destination card treatment.
6. Five discovery layer presentation.
7. Map visual treatment.
8. Passport stamp direction.
9. Motion direction.
10. Responsive web treatment.

**Codex must not bypass this gate using generic travel-app styling as a placeholder that quietly becomes final.** If Phase 3 begins before this gate is explicitly approved, that is a process violation to report, not proceed past.

---

## Phase 2: Content and Data Foundation

**Objective:** Build the typed content model and validate it against exactly one pilot destination before authoring the full dataset.

**Dependencies:** Phase 1 complete and approved. This phase does not depend on the visual direction gate — content modeling is not expressive UI work.

**Tasks:**
1. Implement controlled vocabularies (`Region`, `InterestTag`, `DiscoveryLayer`, `DiscoveryItemType`, `LocalityType`) per `ARCHITECTURE.md` Section 4.
2. Implement the full TypeScript models (`Destination`, `DiscoveryItem`, `ImageAsset`, `PracticalInformation`, the discriminated `VerificationRecord`, `UserProfile`, `SavedItem`, `VisitedRecord`, `PassportStamp`, `CuratedCollection`).
3. Implement the coordinate validator (`isValidCoordinate`).
4. Implement the practical-information verification discriminated union with its required-field constraints per variant.
5. Implement the `ImageAsset` model with full attribution fields.
6. Build `contentIndex.ts` aggregating all content.
7. Build the content-validation script covering the full checklist in `ARCHITECTURE.md` Section 12/14.
8. Author **one historical pilot destination — Cape Town** — under the then-approved pilot requirements. This pilot is superseded and removed from the active V1 content set in Corrective Phase 5.5.

**Expected files/directories affected:** `src/types/`, `src/content/vocabularies/`, `src/content/destinations/cape-town.ts`, `src/content/discoveryItems/cape-town/*`, `src/content/images/`, `src/content/contentIndex.ts`, `src/test/contentValidation.ts`.

**Explicit exclusions:** No other destinations were authored in this historical pilot phase. No screens consume this content yet (Phase 4).

**Acceptance criteria:** Content validation passed against the historical Cape Town pilot data; all controlled vocabularies were enforced at compile time; every image in the pilot had complete attribution; every practical-information entry satisfied its discriminated variant; no coordinates were present without passing `isValidCoordinate`.

**Required commands/checks:** TypeScript, content-validation script, unit tests for `isValidCoordinate` and the verification union.

**Manual verification:** Ivy reviewed the historical Cape Town pilot content for accuracy, tone, and cultural respectfulness before the pattern was approved. The destination itself is not part of the corrected V1 set.

**Stop condition:** After the historical pilot passed validation and Ivy reviewed its actual content. Corrective Phase 5.5 now applies the proven model to the corrected V1 set.

**Expected Git checkpoint:** "Phase 2: content models, validation, and Cape Town pilot content." (Historical checkpoint; Cape Town is removed from active V1 scope in Corrective Phase 5.5.)

---

## Phase 3: Design System and Application Shell

**Objective:** Apply the approved visual direction to the token system and build accessible shared components.

**Dependencies:** Phase 2 complete, **and** the Visual Direction Approval Gate passed. This phase cannot start on the strength of Phase 1/2 alone.

**Tasks:**
1. Apply final semantic color values (from the approved palette).
2. Apply final typography values.
3. Finalize spacing, radius, elevation, and motion token values.
4. Finalize the responsive breakpoint for the Expo web demo.
5. Build accessible shared components (`<Tappable>`, `<Card>`, `<Chip>`, `<EmptyState>`, `<ErrorState>`, etc.) per the accessibility rules in `ARCHITECTURE.md`/`AGENT.md`.
6. Build the tab bar's final visual treatment.
7. Build screen container components.
8. Build loading, empty, error, success, and offline shared components.
9. Implement keyboard and visible-focus treatment for the Expo web build.

**Expected files/directories affected:** `src/tokens/` (final values), `src/components/ui/`, `src/components/accessibility/`.

**Explicit exclusions:** No screen-specific expressive layout yet (Phase 4) — this phase is the shared component library only.

**Acceptance criteria:** All shared components render correctly with final tokens; touch targets meet 48×48dp; keyboard navigation and visible focus work on web; no component relies on assumed default semantics (explicit roles/labels per `ARCHITECTURE.md` Section 11).

**Required commands/checks:** TypeScript, lint, component tests, accessibility queries (`getByRole`, `getByLabelText`) on each shared component.

**Manual verification:** Manual keyboard-only pass through the shell on web; manual screen-reader spot check on at least one shared component.

**Stop condition:** After shared components pass their tests and a manual accessibility spot check.

**Expected Git checkpoint:** "Phase 3: approved design system and accessible shared components."

---

## Phase 4: Destination Discovery Core

**Objective:** Prove the golden path end-to-end using the historical Cape Town pilot content before correcting and scaling the active V1 dataset in Phase 5.5.

**Dependencies:** Phase 3 complete and approved.

**Tasks:**
1. Build Discover (Featured, Editor's Picks, Curated Collections, personalized section — personalization logic wired against a single destination is trivially testable but should still be implemented per the real scoring function).
2. Build Explore with the unified filter system.
3. Build search.
4. Build combined filters.
5. Build Destination Details, rendering the historical pilot's five discovery layers.
6. Build the five discovery layer presentation (per the approved visual direction).
7. Build Discovery Item Details.
8. Build image rendering with `expo-image`, loading/error states.
9. Build the Image Credits screen.
10. Wire the rules-based personalization scoring function for real (even with one destination, ordering logic must be genuinely implemented and testable, not hardcoded).
11. Build empty and error states for Explore/search (even with one destination, a no-results state must be reachable and correct).

**Expected files/directories affected:** `src/features/discover/`, `src/features/explore/`, `src/personalization/`, `src/search/`, corresponding `app/` route files.

**Explicit exclusions:** Only the historical pilot content was used. Saved/Passport/Profile were not built yet (Phase 5). Map was not built yet (Phase 7).

**Acceptance criteria:** The full golden path (Discover → Destination Details → five layers → Discovery Item Details → back) worked correctly using the historical pilot; search and filters returned correct results against the single-destination dataset; personalization scoring was implemented and unit tested, not stubbed.

**Required commands/checks:** TypeScript, lint, unit tests (search, personalization), component tests, Expo web build.

**Manual verification:** Manually walk the entire golden path on both a native device/simulator and the Expo web build.

**Stop condition:** After the golden path is manually confirmed working on both platforms with the pilot content.

**Expected Git checkpoint:** "Phase 4: destination discovery core proven on pilot content."

---

## Phase 5: Profile, Saved, and Passport

**Objective:** Implement all persisted state and its accessibility-relevant preferences.

**Dependencies:** Phase 4 complete and approved.

**Tasks:**
1. Build the three Zustand stores (`profileStore`, `savedStore`, `passportStore`).
2. Wire AsyncStorage persistence via the Zustand persist middleware.
3. Implement schema versioning and migration handling.
4. Implement the hydration gate on app start.
5. Implement corrupted-data recovery (fallback to defaults).
6. Build Profile's interests and preferred-regions selection UI, wired to real personalization scoring (tested initially with the historical single-destination pilot, but the logic must be genuine).
7. Implement the functional Larger Text preference (discrete type-scale tokens, not a runtime multiplier).
8. Implement the functional reduced-motion preference (respecting both OS and in-app settings).
9. Implement Saved and Want to Go status with the one-record-per-subject model.
10. Implement duplicate-prevention logic structurally (not just as a UI convention).
11. Implement "mark as visited."
12. Implement the derived "Countries visited" counter.
13. Implement the derived "Destinations visited" counter.
14. Implement static Passport stamp display.
15. Write and run full-restart persistence tests (close and relaunch, not just in-memory state checks).

**Expected files/directories affected:** `src/state/`, `src/persistence/`, `src/features/profile/`, `src/features/saved/`, `src/features/passport/`, corresponding `app/` route files.

**Explicit exclusions:** No "cities visited" wording appears anywhere in code, UI copy, or types — only Countries visited and Destinations visited.

**Acceptance criteria:** Profile, Saved, and Passport data all survive a full app restart; duplicate Saved records are structurally impossible; Passport counters are correct and derived, never stored redundantly; Larger Text and reduced motion visibly change app behavior.

**Required commands/checks:** TypeScript, lint, persistence unit tests (including corrupted-data simulation), full-restart manual test.

**Manual verification:** Manually set Profile preferences, save items, mark a destination visited, fully close the app, reopen it, and confirm everything persisted correctly.

**Stop condition:** After full-restart persistence tests pass manually and automatically.

**Expected Git checkpoint:** "Phase 5: Profile, Saved, and Passport with verified persistence."

---

## Corrective Phase 5.5: Destination Scope and Visual Direction

**Objective:** Replace the historical pilot/obsolete destination scope with the approved seven-destination V1 set and correct the app's active visual direction before any Phase 6 work.

**Dependencies:** Phase 5 complete and verified. The governing-document correction approving this phase must be complete before app or content implementation begins.

**Tasks:**
1. Remove Cape Town, Cross River, and Banff from active V1 content and all active UI references.
2. Establish exactly seven V1 destinations: Bali, Marrakech, Santorini, Rome, Cappadocia, Kyoto, and Rio de Janeiro.
3. Author exactly one discovery item in each of the five layers for every destination (five per destination; thirty-five total).
4. Preserve the broader `DiscoveryItem` model, optional place/practical fields, coordinate validation, verified practical-information rules, and complete image attribution.
5. Update content indexes, validation, search, personalization fixtures, Saved/Passport content joins, and UI copy for the corrected content set without weakening tests or persistence behavior.
6. Replace the active sandstone direction with the approved Tropical Sky, Sunset Coral, Sunset Vermilion, Carbon Ink, Soft Mist, and Ocean Blue semantic tokens.
7. Correct Discover, Explore, Destination Details, Discovery Item Details, Saved, Passport, and the application shell to feel mobile-first, immersive, image-led, premium, modern, colorful, and destination-led.
8. Use larger photography, rounded image cards, floating search where appropriate, restrained layer accents, soft depth, and quiet modern bottom navigation.
9. Preserve Larger Text, Reduced Motion, WCAG 2.2 AA contrast, 48dp targets, keyboard accessibility, screen-reader labels, logical focus order, and all approved Phase 5 persistence behavior.

**Active V1 destination set:**
1. Bali, Indonesia
2. Marrakech, Morocco
3. Santorini, Greece
4. Rome, Italy
5. Cappadocia, Türkiye
6. Kyoto, Japan
7. Rio de Janeiro, Brazil

**Explicit exclusions:** Map implementation; booking; itinerary planning; transport; reviews; social features; backend; authentication; AI recommendations; dark mode; custom collections; and all Phase 6 work.

**Acceptance criteria:** Exactly seven destinations and thirty-five discovery items validate; every destination has exactly one item in each layer; removed destinations have no active content or UI references; every image has compliant attribution; practical information satisfies the verified/linked/omitted rule; the corrected visual direction is applied without regressing navigation, search, filters, persistence, Larger Text, Reduced Motion, or accessibility requirements.

**Required commands/checks:** `npx tsc --noEmit`, `npm run lint`, `npm test`, `npm run content:validate`, `npx expo-doctor`, `npx expo export -p web`, and `git diff --check`.

**Manual verification:** Review all seven destinations and thirty-five items for factual accuracy, cultural respect, imagery, alt text, and visual quality; walk core routes on Expo Go and web; verify persistence and accessibility preferences remain intact.

**Stop condition:** After all automated checks and manual review pass, report and wait for explicit approval before committing or beginning any later phase.

**Expected Git checkpoint:** "Phase 5.5: corrected destination scope and colorful visual direction."

---

## Phase 6: Full Destination Content (superseded)

**Status:** Superseded by Corrective Phase 5.5. Do not execute this phase as previously written and do not treat it as authorization for additional destinations or content.

**Objective:** No active implementation objective. The corrected seven-destination, thirty-five-item content set is delivered and reviewed in Phase 5.5.

**Stop condition:** Remains inactive unless Ivy supplies a new, explicit Phase 6 definition and approval in updated governing documents.

---

## Phase 7: Cross-Platform Map

**Objective:** Implement the map feature across native and web behind the shared contract.

**Dependencies:** Corrective Phase 5.5 complete and approved; Phase 6 is superseded. The map needs the corrected coordinate data across all seven destinations to be meaningfully tested.

**Tasks:**
1. Implement `map.types.ts` (the shared props contract).
2. Implement `MapSurface.native.tsx` using `react-native-maps`.
3. Implement `MapSurface.web.tsx` using React Leaflet.
4. Configure the tile provider as swappable configuration, not hardcoded.
5. Ensure OpenStreetMap attribution remains permanently visible on web.
6. Wire coordinate validation so only valid, place-based discovery items produce markers.
7. Implement category filters on the map.
8. Implement marker preview cards.
9. Implement navigation from a marker preview to Discovery Item Details.
10. Implement loading and failure states for both platforms.
11. Implement the offline tile fallback.
12. Implement the accessible List view alternative.
13. Test natively in Expo Go (confirmed not to require a development client per the corrected architecture, unless setup reveals otherwise).
14. Test in an actual browser for the Expo web build.

**Expected files/directories affected:** `src/components/map/`, `src/features/map/`, corresponding `app/(tabs)/map.tsx`.

**Explicit exclusions:** No native map testing claims without actually running it in Expo Go; no web map testing claims without actually opening it in a browser.

**Acceptance criteria:** Markers appear only for valid-coordinate items across all seven destinations; attribution is always visible on web; the List view alternative works identically to the map's filtered content; both platforms handle offline/failure gracefully.

**Required commands/checks:** TypeScript, lint, coordinate-validation unit tests, manual native and web map testing (this cannot be fully automated — see `ARCHITECTURE.md` Section 14).

**Manual verification:** Physically test the native map in Expo Go on a device/simulator; physically test the web map in a browser, including simulating an offline state.

**Stop condition:** After both platform map implementations are manually confirmed working, including the List view fallback.

**Expected Git checkpoint:** "Phase 7: cross-platform map with List view alternative."

---

## Phase 8: Accessibility and Responsive Audit

**Objective:** A full, dedicated audit — not the first time accessibility is addressed, but the point where it's checked comprehensively across the finished app.

**Dependencies:** Phase 7 complete. (Accessibility itself has been implemented throughout every prior phase per `AGENT.md` Section 12 — this phase is the audit, not the first implementation.)

**Tasks:**
1. WCAG 2.2 AA review across all screens, where applicable.
2. Verify 48×48dp targets on every interactive element app-wide.
3. Verify screen reader labels across all screens.
4. Verify logical focus order across all screens.
5. Verify platform-aware heading focus on both native and web.
6. Verify dynamic text support without clipping, across all screens.
7. Verify layouts at maximum combined text scale (in-app Larger Text + max OS text size).
8. Verify reduced-motion behavior across all animated elements.
9. Verify no state is communicated by color alone, anywhere in the app.
10. Verify full keyboard operability on Expo web, across all screens.
11. Verify visible focus indicators on Expo web, across all screens.
12. Verify web responsiveness at the defined breakpoint.
13. Verify the Map List alternative remains fully accessible.
14. Verify contrast on every color/background pairing actually used (not just the token definitions).
15. Conduct a manual VoiceOver or TalkBack review where hardware/simulator access allows.

**Expected files/directories affected:** Likely small, targeted fixes across `src/components/`, `src/features/*` — this phase surfaces gaps rather than building new features.

**Explicit exclusions:** No new features. This phase produces fixes to existing implementation, not new screens.

**Acceptance criteria:** Every item above verified across the whole app, with any gaps found actually fixed, not just logged.

**Required commands/checks:** Accessibility-focused component tests, manual audit checklist completion.

**Manual verification:** The manual screen-reader and keyboard passes are the core of this phase — automated checks alone do not satisfy it.

**Stop condition:** After the full audit checklist is complete and any gaps found are fixed and re-verified.

**Expected Git checkpoint:** "Phase 8: accessibility and responsive audit complete."

---

## Phase 9: Full Product Verification and Polish

**Objective:** Verify the complete product against every PRD acceptance criterion before deployment.

**Dependencies:** Phase 8 complete.

**Tasks:**
1. Verify every PRD acceptance criterion individually.
2. Verify all routes.
3. Verify all state transitions.
4. Verify empty, loading, error, success, and offline states across every feature.
5. Verify persistence across restarts, again, on the finished app.
6. Verify personalization against the full seven-destination dataset.
7. Verify search and filters against the full dataset.
8. Confirm all seven destinations are present and correct.
9. Confirm all thirty-five discovery items are present and correct.
10. Confirm maps work on both native and web with the full dataset.
11. Confirm image credits are accessible and correct throughout.
12. Run content validation one final time against the complete dataset.
13. Run TypeScript.
14. Run ESLint.
15. Run all tests.
16. Run Expo Doctor.
17. Run an Expo web production build.
18. Run a native smoke test.
19. Remove any remaining unused code, dead files, or placeholder content.
20. Create the final Git checkpoint before deployment.

**Expected files/directories affected:** Potentially anywhere — this is a whole-product pass, not a feature phase.

**Explicit exclusions:** No new features introduced at this stage.

**Acceptance criteria:** Every PRD acceptance criterion passes; all checks in tasks 13–18 pass cleanly; no unused code or placeholder content remains.

**Required commands/checks:** All of the above, run and reported explicitly with exact results.

**Manual verification:** A full manual run-through of the entire app, from Discover through Passport, on both a native build and the Expo web build.

**Stop condition:** After every check and manual pass succeeds.

**Expected Git checkpoint:** "Phase 9: full product verification complete, ready for deployment."

---

## Phase 10: Deployment and Handoff

**Objective:** Deploy the Expo web demo and complete the documentation needed for a portfolio handoff.

**Dependencies:** Phase 9 complete.

**Tasks:**
1. Deploy the Expo web build.
2. **Open and test the actual live link** — do not report deployment success without doing this.
3. Verify deep links work on the live deployment (destination and discovery item routes).
4. Write repository documentation (README covering setup, structure, and key decisions).
5. Write setup instructions (how to run the project locally).
6. Write environment instructions (what `.env` values are needed and when, per the conditional Google Maps key requirement).
7. Document known limitations honestly (e.g., simulated payment-equivalent gaps are not applicable here, but content coverage limits, map provider constraints, and any deferred V2 items should be stated plainly).
8. Document image and content attribution comprehensively, in a form reviewable outside the app itself.
9. Write a final implementation summary.
10. Write a portfolio demo walkthrough (the golden path, framed for a recruiter audience).

**Expected files/directories affected:** `README.md`, deployment configuration, documentation files.

**Explicit exclusions:** No claim of "deployed" or "live" without having actually opened and tested the live link.

**Acceptance criteria:** The live link is open, tested, and functional; deep links work on the deployed version; documentation is complete and accurate.

**Required commands/checks:** Deployment command, manual live-link test.

**Manual verification:** Open the live link in a fresh browser session (not a cached local build) and walk the golden path exactly as a recruiter would.

**Stop condition:** After the live link is confirmed working and all documentation is complete.

**Expected Git checkpoint:** "Phase 10: deployed and documented for handoff."

---

## Cross-Phase Discipline (restated from `AGENT.md`)

- Route files stay thin throughout; business logic never migrates into UI components regardless of phase pressure.
- Content, state, persistence, and UI remain separated in every phase, not just in Phase 1's initial structure.
- No premature abstraction — thirty-five items and three persisted stores never justify enterprise-scale patterns.
- No placeholder tourism facts, at any phase, ever.
- Corrective Phase 5.5 does not begin until its documentation correction is approved; the superseded Phase 6 must not be executed without a new governing definition.
- Accessibility is built into every phase from Phase 1 onward; Phase 8 is a comprehensive audit, not the first time it's addressed.
- Tests accompany their relevant phase; they are not deferred to Phase 9 as a bulk exercise.
- No backend, authentication, AI recommendations, or dark mode at any phase, regardless of how small the addition might seem in context.
- No feature outside the locked `PRD.md` is added at any phase, for any reason.

Codex stops after every phase above and waits for Ivy's explicit approval before proceeding to the next.
