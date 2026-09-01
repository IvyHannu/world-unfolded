# World Unfolded — AGENT.md

**Purpose:** This file governs how Codex works inside this repository. It does not define product scope (`PRD.md`) or technical structure (`ARCHITECTURE.md`) — it defines behavior, discipline, and verification.

---

## 1. Project Identity

- **Product name:** World Unfolded.
- **Product type:** A mobile-first tourist destination discovery app.
- **Core promise:** Reveal destinations through five discovery layers — Iconic, Hidden, Culture, Taste, and Nature.
- **This is explicitly not:** a booking platform, an itinerary planner, a transport app, a social network, or an AI recommendation product. Any implementation that drifts toward these is out of scope regardless of how small it seems.

---

## 2. Source of Truth

Codex must read these files **completely** before implementing anything:

1. `PRD.md`
2. `ARCHITECTURE.md`
3. `AGENT.md` (this file)
4. `IMPLEMENTATION_PLAN.md`, once it exists

**Responsibility boundaries:**

- `PRD.md` controls product scope, target users, functional requirements, and acceptance criteria.
- `ARCHITECTURE.md` controls technical structure and engineering decisions.
- `AGENT.md` controls agent behavior and repository working rules.
- `IMPLEMENTATION_PLAN.md` controls implementation order and phase boundaries.

**If these documents conflict, Codex must stop and report the exact conflict rather than silently choosing one.** A known example already identified: `ARCHITECTURE.md` corrects the Passport counters to "Countries visited" and "Destinations visited"; if `PRD.md` still contains the older "cities visited" wording at the time of implementation, this is a live conflict and must be reported, not silently resolved in either direction. **The corrected wording ("Countries visited" / "Destinations visited") governs implementation — "cities visited" must never be used in code, UI copy, or data models, regardless of what `PRD.md` currently says, until the conflict is formally resolved by Ivy.**

---

## 3. Before Implementation

Before any implementation work, Codex must audit the project and report:

1. Existing files and folder structure.
2. Package manager in use.
3. Expo SDK version.
4. React Native and React versions.
5. Expo Router version.
6. TypeScript configuration.
7. Installed dependencies.
8. Current routes.
9. Current Git status.
10. Whether dependencies are installed.
11. Whether lint, TypeScript, tests, and builds currently pass.

**If the project does not exist yet, Codex must report that clearly and create it only once the implementation plan authorizes setup** — not proactively, and not as an assumed first step.

---

## 4. Scope Control

Codex must not add, under any framing or justification:

1. Authentication.
2. Backend services.
3. Databases.
4. Payments.
5. Flights, hotels, or transport booking.
6. Itinerary planning.
7. Live navigation.
8. AI or machine-learning recommendations.
9. Reviews.
10. Social feeds or messaging.
11. Dark mode.
12. Custom user collections.
13. A second Passport map.
14. Any feature not listed in the locked `PRD.md`.

**Codex must also not remove approved features to simplify implementation without explicit approval.** Scope discipline runs in both directions — no unauthorized additions, and no unauthorized cuts.

---

## 5. Phase Discipline

Codex must:

1. Work on only the currently authorized phase.
2. Inspect existing code before editing it.
3. Describe the intended change briefly before implementing it.
4. Keep changes focused on the phase's stated scope.
5. Run the required verification for that phase.
6. Report files changed and results.
7. Stop after the phase's acceptance criteria pass.

**Codex must not build several phases at once, and must not continue automatically into the next phase without explicit authorization.**

---

## 6. Dependency Rules

Codex must:

1. Verify the current Expo SDK from the generated project before assuming compatibility.
2. Install Expo-managed packages using `npx expo install` where applicable, so versions stay aligned with the installed SDK.
3. Confirm compatibility before adding any third-party dependency.
4. Prefer the libraries already approved in `ARCHITECTURE.md` over introducing alternatives.
5. Avoid installing duplicate libraries that solve the same problem.
6. Run Expo Doctor after any meaningful dependency change.
7. Never invent package versions — if a version cannot be confirmed, say so and verify it rather than guessing.
8. Explain any proposed deviation from the approved architecture and wait for approval before proceeding.

---

## 7. Approved Technical Direction

Restated from `ARCHITECTURE.md` — these are not open decisions:

1. Expo Router.
2. TypeScript strict mode.
3. Stable JavaScript `Tabs` (not experimental native tabs).
4. Zustand, scoped to Profile, Saved, and Passport state only.
5. AsyncStorage for local persistence.
6. TypeScript modules for static destination content (not JSON).
7. Controlled vocabularies for region, interests, discovery layers, item types, and locality type.
8. `react-native-maps` for native — confirmed to work in Expo Go for development; no development client or Google Maps API key required until a standalone binary is produced.
9. React Leaflet with an approved, configurable tile provider for web.
10. `expo-image` for remote images.
11. Jest and React Native Testing Library, with exact compatibility verified during setup rather than assumed.
12. No backend and no authentication.

---

## 8. Routing Rules

Codex must preserve:

1. Discover as the initial route (root redirects to `/(tabs)/discover`).
2. Four primary tabs: Discover, Saved, Passport, Profile.
3. Explore is a secondary browse/search route reached from Discover and relevant empty states; Map remains hidden until its approved implementation phase.
4. Destination, discovery item, and image-credit routes outside the tab group, so back navigation returns to the screen that opened them.
5. Correct back behavior based on the originating screen — not a fixed return-to-tab behavior.
6. Deep links functioning correctly for destination and discovery item routes.

---

## 9. Content Integrity

Codex must never invent or publish tourism facts as verified. Content must satisfy:

1. Exactly seven destinations.
2. Exactly one discovery item per layer per destination.
3. Thirty-five discovery items total.
4. The active destination set is exactly Bali, Marrakech, Santorini, Rome, Cappadocia, Kyoto, and Rio de Janeiro.
5. Unique IDs across destinations, discovery items, and images.
6. Valid references (destination references, image references, nearby-destination references).
7. Controlled vocabulary values only — no free-text substitutes for region, interests, layers, item type, or locality type.
8. At least one image per discovery item.
9. A valid hero image per destination.
10. Proper image attribution on every image (source, creator, license, represented subject, alt text).
11. Valid HTTPS official sources wherever a source URL is used.
12. Practical information that is either verified and dated, linked to an official source, or omitted entirely — never shown as unverified filler.
13. No placeholder opening hours or accessibility claims presented as if they were real, current information.

**Content validation must run and pass before any content-related phase is accepted as complete.**

---

## 10. Image Rules

Codex must:

1. Use only approved sources: Unsplash, Pexels, and Wikimedia Commons.
2. Preserve creator, source, license, represented subject, and alt-text metadata for every image.
3. Never use random, unattributed Google Images search results.
4. Never bundle or redistribute third-party images unless their license explicitly permits it.
5. Provide loading, error, and offline fallback states for every image.
6. Keep image credits accessible from within the interface.
7. Never replace approved real photography with AI-generated destination images.

---

## 11. Map Rules

Codex must:

1. Use `react-native-maps` on native.
2. Use React Leaflet on web.
3. Keep both platform implementations behind the shared map contract (`map.types.ts` / `MapSurface.native.tsx` / `MapSurface.web.tsx`, per `ARCHITECTURE.md`).
4. Validate coordinates before creating any marker.
5. Never create a marker for invalid or absent coordinates, regardless of discovery item type.
6. Keep OpenStreetMap attribution permanently visible — never hidden behind a card, toggle, or overlay.
7. Follow the selected tile provider's usage policy.
8. Keep the tile provider configurable, not hardcoded, so it can be swapped later without rewriting the map feature.
9. Provide loading, failure, offline, and List view fallbacks/alternatives.
10. Confirm actual Expo Go behavior from the installed SDK rather than assuming a development build is required — per the corrected architecture, native map development can begin directly in Expo Go.

---

## 12. Accessibility Rules

Codex must treat accessibility as an acceptance criterion, not optional polish. Required:

1. WCAG 2.2 AA conformance where applicable.
2. Minimum 48 by 48dp touch targets on all interactive elements.
3. Explicit roles, labels, hints, and disabled states on shared interactive components — never assumed as automatic defaults.
4. Logical screen reader order.
5. Platform-aware heading focus (the correct mechanism differs between native and web — see `ARCHITECTURE.md`).
6. Dynamic text support without layout clipping.
7. A functional Larger Text preference, using discrete predefined type-scale tokens rather than a runtime multiplier, to avoid uncontrolled double-scaling with OS-level text settings.
8. A functional reduced-motion preference, respecting both the OS setting and the in-app preference.
9. No information communicated by color alone.
10. Full keyboard operability on the Expo web build.
11. Visible focus indicators on web.
12. A List view alternative for the Map, for users who cannot operate the map.

**Codex must test these behaviors, not merely add accessibility props and assume correctness.**

---

## 13. Persistence Rules

Required:

1. No authentication of any kind.
2. Local persistence for Profile, Saved, Want to Go, and Passport data.
3. Versioned storage keys.
4. Hydration handling on app start.
5. Migration support for schema version changes.
6. Graceful recovery from corrupted or invalid stored data, falling back to defaults rather than crashing.
7. No duplicate Saved records for the same subject — one record per subject, status changes replace in place.
8. Passport counters (Countries visited, Destinations visited) derived at read time from visited records, never stored as separate competing values.
9. Persistence verified to survive a full app restart, not just an in-memory state check.

---

## 14. Design and Interface Protection

**The corrected final visual direction is approved.** World Unfolded uses a colorful, modern tourism direction that is mobile-first, immersive, image-led, premium, clean, and destination-led. Tropical Sky (`#D7F3F4`) is the main background, Sunset Coral (`#FFD7C2`) is the secondary warm background, Sunset Vermilion (`#C94F3D`) is the primary action and brand accent, Carbon Ink (`#20242C`) is the primary text color, Soft Mist (`#F7FEFC`) is the quiet card surface, and Ocean Blue (`#1677A8`) is the controlled accent blue.

Discovery-layer colors are restrained accents only, used through small chips, icons, labels, and highlights rather than large saturated blocks. Playfair Display remains the destination/editorial typeface and Inter remains the UI/body typeface.

Codex must preserve this approved semantic token structure and must not introduce competing brand palettes or expressive treatments outside the phase currently authorized.

Codex must specifically avoid, even as placeholder/interim styling:

- Generic, repeated card grids applied uniformly regardless of content type.
- Beige or ivory-dominant application surfaces.
- Dashboard-like or arcade-like compositions.
- Booking-app visual language or transactional calls to action.
- Unnecessary gradients.
- Excessive shadows.
- Decorative glass effects.
- Any interface that reads as a generic AI-generated travel app template.

World Unfolded should feel immersive, colorful, editorial, image-led, culturally respectful, spacious, intentionally designed, and unmistakably destination-led without becoming a generic travel or booking interface.

---

## 15. Code Quality

Codex must:

1. Keep route files thin — routing and screen composition only.
2. Keep business logic outside UI components (in `features/`, `personalization/`, `search/`, `persistence/` as defined in `ARCHITECTURE.md`).
3. Use strict TypeScript throughout.
4. Avoid `any`.
5. Use shared components and design tokens rather than one-off styling.
6. Avoid premature abstraction.
7. Avoid overengineering for a dataset of thirty-five static discovery items — no indexing engines, virtualization libraries, or unnecessary caching layers.
8. Remove unused code and imports.
9. Keep functions and files focused on a single responsibility.
10. Add comments only where they explain a nonobvious decision, not as narration of obvious code.

---

## 16. Git and File Safety

Codex must:

1. Inspect Git status before editing anything.
2. Preserve unrelated user changes — never overwrite work outside the current phase's scope.
3. Never use destructive Git commands (no force-push, no hard reset, no history rewriting).
4. Never delete or overwrite unrelated files.
5. Use focused commits or checkpoints after each approved phase.
6. Keep secrets and `.env` files out of Git.
7. Maintain `.env.example` for conditional configuration (e.g., the Google Maps API key needed only at standalone-binary time).
8. Report every file created, modified, moved, or removed.

---

## 17. Required Verification

Codex must run applicable checks after each phase:

1. TypeScript.
2. ESLint.
3. Unit tests.
4. Component tests.
5. Content validation.
6. Expo Doctor, after any dependency change.
7. Expo web build.
8. Native Expo start or an equivalent smoke test.
9. Manual route checks.
10. Manual map checks, when relevant to the phase.
11. Accessibility checks, when relevant to the phase.

**Codex must report the exact commands run and their exact results.**

**Codex must never say "done," "working," or "complete" when checks have failed or were not run at all.**

---

## 18. Error Handling

If Codex is blocked, it must:

1. Stop safely — do not attempt to work around the blocker silently.
2. Report the exact error.
3. Explain what was attempted.
4. Identify whether the issue is code, dependency, environment, permission, or a missing product/technical decision.
5. Suggest the smallest safe next action.

**Codex must not repeatedly retry the same failing action without changing its approach.**

---

## 19. Communication Style

Codex's reports should be concise and structured around:

1. What was inspected.
2. What changed.
3. What was verified.
4. What remains.
5. Any blocker requiring Ivy's decision.

**Avoid long streams of internal reasoning or repetitive progress messages.** Reports should read like a status update to a product owner, not a running commentary.

---

## 20. Definition of Done

A phase is complete only when **all** of the following are true:

1. Its implementation plan tasks are finished.
2. Its acceptance criteria (from `PRD.md`/`IMPLEMENTATION_PLAN.md`) pass.
3. Required verification checks (Section 17) pass.
4. No unrelated scope was added.
5. Accessibility requirements relevant to that phase were checked, not assumed.
6. Files changed are reported completely.
7. Known limitations are stated honestly, not omitted to make the phase look more finished than it is.
