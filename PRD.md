# World Unfolded — Product Requirements Document (PRD.md)

**Status:** Confirmed V1 scope, final revision. This document reflects finalized decisions and is the source of truth going forward.

**Workflow:** Ivy (product owner), ChatGPT (product direction & documentation support), Claude (product and technical review), Codex (implementation).

---

## 1. Product Vision

World Unfolded helps people understand what makes a destination worth exploring — beyond generic top-10 landmark lists — by revealing it through five discovery layers: Iconic, Hidden, Culture, Taste, and Nature. It is a discovery-first experience, not a booking platform or itinerary manager.

---

## 2. Problem Statement

Tourism information is scattered across search engines, social media, blogs, maps, and booking platforms. Famous landmarks are easy to find; understanding a destination's character, culture, food, and lesser-known places requires piecing together research from many disconnected sources.

---

## 3. Target Users

1. **Curious explorers** — enjoy learning about places without an immediate travel plan.
2. **Inspiration seekers** — deciding where they might want to travel.
3. **Active tourists** — on-site, need practical local information.

---

## 4. Value Proposition

One place that organizes a destination's iconic sites, hidden gems, culture, food, and nature into a single, visually rich, layered experience — so people come away understanding a place, not just its top attractions.

---

## 5. Product Principles

1. Discovery before transactions.
2. Culture before generic recommendations.
3. Visual storytelling without clutter.
4. Popular places and hidden discoveries presented together.
5. Useful information without overwhelming the user.
6. Accessibility from the beginning, following WCAG and Material 3 guidance.

---

## 6. Confirmed V1 Scope

### Discover
- Featured destination
- Editor's Picks *(replaces "Trending places" — V1 has no live popularity data, and the interface must not imply trends are being calculated)*
- Curated destination collections
- Personalized ranking: Discover content ordered using rules-based matching against the user's selected interests and preferred regions

### Explore
- Unified browse and filter — continent, country, interest, category, and region combined into one filter system
- Search destinations and discovery items

### Destination Details
- Visual destination introduction
- Destination overview and cultural story
- Five discovery layers (Iconic, Hidden, Culture, Taste, Nature), each containing discovery items
- Essential information, shown only where it meets the verification standard in Section 15
- Discovery item gallery
- Nearby destinations

### Discovery Item Details
*(Replaces "Attraction Details" — a discovery item may be a physical attraction, landmark, cultural practice or story, local dish or food experience, natural site, or hidden place; not every item is a place you physically visit.)*
- Images with attribution
- Description and cultural significance
- Location — optional, only present when the item is place-based
- Opening information — optional, shown only when it meets the verification standard in Section 15
- Accessibility information — optional, verified subset only
- Practical guidance — optional
- Save action

### Map
- Displays only discovery items with valid latitude and longitude values
- Category filters
- Discovery item previews
- Links to full discovery item details

### Saved
- One unified section for Saved and Want to Go — no separate Bucket List surface
- Filter/tag to distinguish "saved for reference" from "want to go" within the same list

### Passport (simplified — confirmed for V1)
- Mark a destination as visited
- View visited destinations
- View total number of countries visited and total number of destinations visited
- Display a simple destination stamp per visited destination
- Explicitly excluded: a second interactive map, complex travel history, social features

### Profile
- User interests
- Preferred regions
- Accessibility preferences
- Application settings
- Interests and preferred regions directly feed the Discover ranking logic

---

## 7. User Stories

**Curious explorer**
- As a curious explorer, I want to browse destinations by interest so that I can discover places aligned with what I care about, even without a trip planned.
- As a curious explorer, I want to see hidden and iconic discovery items together so that I get a fuller picture of a destination, not just its famous sites.

**Inspiration seeker**
- As an inspiration seeker, I want Discover to surface destinations matching my selected interests and preferred regions so that I don't have to browse everything to find what's relevant to me.
- As an inspiration seeker, I want to save destinations and discovery items I like so that I can return to them later when deciding where to go.

**Active tourist**
- As an active tourist, I want to see clearly verified, dated practical information where it exists, or a direct link to an official source, so that I never mistake illustrative content for something I can rely on while travelling. *(Revised: V1 does not promise live or continuously reliable information — see Section 15.)*
- As an active tourist, I want to view place-based discovery items on a map so that I can understand their location relative to each other.

**Any user**
- As a user, I want to mark a destination as visited so that I can track where I've been.
- As a user, I want to see my total countries visited and total destinations visited so that I have a simple, motivating summary of my travel history.
- As a user, I want my saved items, want-to-go list, and visited history to still be there after I close and reopen the app, without needing to create an account.

---

## 8. Functional Requirements

**Discover**
- FR1: The system shall rank Discover content using rules-based matching against the user's selected interests and preferred regions.
- FR2: If no interests or regions are set, Discover shall fall back to default editorial ordering (Featured, Editor's Picks, Curated collections) with no personalization applied.

**Explore**
- FR3: The system shall support filtering by continent, country, interest, category, and region within a single unified filter interface.
- FR4: The system shall support text search across destination and discovery item names.

**Destination Details**
- FR5: Each destination shall display all five discovery layers, each containing exactly two discovery items.
- FR6: Each destination shall display at least one nearby destination, where applicable.

**Discovery Item Details**
- FR7: Each discovery item shall display an image with its recorded attribution metadata.
- FR8: Opening hours or accessibility information shall be shown only if it (a) includes an authoritative source and a visible "last verified" date, or (b) links the user to the official source. If neither condition is met, the field shall be omitted entirely — it shall never be shown as unverified sample content.
- FR9: Fields not applicable to a discovery item's type (opening hours, coordinates, accessibility information) shall be optional and omitted from display when not present.

**Map**
- FR10: The map shall render markers only for discovery items with valid latitude and longitude values.
- FR11: Discovery items without valid coordinates shall not appear on the Map under any circumstance, and shall not produce an empty or broken marker.
- FR12: Selecting a marker shall show a preview with a link to full discovery item details.

**Saved**
- FR13: A user shall be able to save a destination or discovery item from its detail screen.
- FR14: Saved items shall be viewable in one unified list, filterable by "saved" vs. "want to go."

**Passport**
- FR15: A user shall be able to mark a destination as visited from its detail screen or from Saved.
- FR16: The Passport screen shall display total distinct countries visited and total destinations visited.
- FR17: Each visited destination shall display a simple, static stamp graphic — not a generated or dynamic image.

**Profile**
- FR18: A user shall be able to select and update interests and preferred regions at any time, and Discover ranking shall reflect the change on next load.

**Persistence**
- FR19: Profile preferences, Saved items, Want to Go status, and Passport records shall persist locally on the device across app restarts, without requiring account creation or authentication.

---

## 9. Screen Requirements

| Screen | Key elements |
|---|---|
| Discover | Featured destination, Editor's Picks, Curated collections, personalized section, entry point to Profile |
| Explore | Unified filter bar, search field, result grid/list |
| Destination Details | Hero visual, overview, five discovery layers, essential information (where verified), discovery item gallery, nearby destinations, save action |
| Discovery Item Details | Image(s) with attribution, description, optional location, optional verified/linked practical information, save action |
| Map | Full-screen map, markers for place-based discovery items only, category filter chips, marker preview card |
| Saved | Unified list, saved/want-to-go filter |
| Passport | Visited destination list, country and destination counters, stamp display, mark-as-visited entry point |
| Profile | Interests selection, preferred regions selection, accessibility preferences, settings |

---

## 10. Navigation and Information Architecture

**Primary navigation:** Discover · Explore · Map · Saved · Passport
**Profile & settings:** accessed via the Discover screen header.

Map remains a primary-level tab. Passport, simplified as scoped, remains a primary-level tab.

---

## 11. Primary User Journeys

**Golden path (discovery-first):**
Discover → Destination Details → five discovery layers → Discovery Item Details → Save → Explore by interest → Map → review in Saved.

**Inspiration-seeking path:**
Profile (set interests/regions) → Discover (personalized ranking) → Destination Details → Save for later.

**Active-tourist path:**
Explore or Map → Discovery Item Details → verified or linked practical information (where available) → Save or mark visited.

**Return-visit path:**
Saved → Destination Details → mark as visited → Passport (updated counters and stamp).

---

## 12. Content and Data Model Requirements

**Destination**
- id, name, country, continent, cultural overview, hero image reference, nearby destination references

**DiscoveryItem** *(replaces the Attraction-only model)*
- id
- destination id
- discovery layer (Iconic / Hidden / Culture / Taste / Nature)
- type: `attraction` | `landmark` | `cultural_practice` | `food_experience` | `natural_site` | `hidden_place`
- name
- description
- cultural significance (optional)
- location — latitude/longitude (optional; present only for place-based items)
- map_visible — derived automatically as true only when valid latitude and longitude are present
- opening_hours (optional; must satisfy the verification rule in Section 15 if present)
- accessibility_info (optional; verified subset only)
- practical_guidance (optional)
- image references
- verification_status: `verified` | `linked-to-source` | `not-applicable`

Each discovery item contains only the fields relevant to its type — a cultural practice or food experience is not required to carry coordinates or opening hours.

**Image**
- id, url/reference, source (Unsplash / Pexels / Wikimedia Commons), creator name, license or permitted-use terms, destination/discovery item represented

**User Profile**
- interests (list), preferred regions (list), accessibility preferences, saved items, visited destinations
- stored locally on-device; no account or authentication required in V1

**Saved Item**
- destination or discovery item id, type (saved / want-to-go), date added

**Visited Record**
- destination id, date marked visited, stamp reference

Each of the six confirmed destinations must contain exactly two discovery items per discovery layer (ten discovery items total per destination; sixty across V1).

---

## 13. Empty, Loading, Error, Offline, and Success States

| State | Requirement |
|---|---|
| Empty — Saved | Show a message inviting the user to save their first destination, with a link into Explore |
| Empty — Passport | Show a message that no destinations have been marked visited yet |
| Loading | Show a lightweight loading indicator for Discover, Explore results, and Destination Details while content loads |
| Error | Show a clear, non-technical error message with a retry action if content fails to load |
| Offline — local data | Profile, Saved, Want to Go, and Passport data are stored locally and must remain fully viewable while offline |
| Offline — remote content | Remote images and map tiles shall display a clear offline fallback (e.g., placeholder with a "reconnect to load" notice) when unavailable, rather than a broken or blank element |
| Success — Save action | Confirm visually that an item was saved (e.g., a brief state change on the save control) |
| Success — Mark visited | Confirm the destination now appears in Passport with an updated stamp and counter |

---

## 14. Accessibility Requirements

- Conform to **WCAG 2.2 AA** where applicable, across all screens.
- Material 3 touch targets of at least **48 by 48dp** for all interactive elements.
- Screen reader labels on all interactive elements and meaningful images.
- Logical, predictable focus order through each screen.
- Support for dynamic text sizing without breaking layout.
- Respect for reduced-motion preferences — animations and transitions shall be minimized or disabled when the user has this preference set.
- No information shall be communicated by color alone (e.g., saved vs. not saved, visited vs. not visited must also use icon or text difference).
- Full keyboard accessibility for the Expo web build, including visible focus indicators and logical tab order.
- Accessibility information on discovery items is limited to a small set of verified examples in V1, per the verification standard in Section 15.

---

## 15. Image Licensing and Attribution Requirements

- All images sourced from Unsplash, Pexels, or Wikimedia Commons only.
- Each image record must store: image source, creator name, license or permitted-use terms, and the destination/discovery item it represents.
- Attribution must be retrievable from within the app (e.g., an image credit view) for every displayed image.
- No image may be used outside the terms of its recorded license.

**Time-sensitive practical information (opening hours, accessibility details, and similar fields) must satisfy one of the following before being shown:**
1. Include an authoritative source and a visible "last verified" date, or
2. Link the user directly to the official source for current information, or
3. Be omitted entirely when it cannot be verified or sourced.

Unverified, illustrative, or placeholder practical information must never be presented as normal product content, and active tourists must never be encouraged to rely on information that does not meet this standard.

---

## 16. Technical Constraints

- Mobile-first build: React Native, Expo, TypeScript.
- Expo web build provided solely as a shareable recruiter/portfolio demo — not the primary designed interface, and not held to full feature parity if constraints arise.
- **Authentication:** none required in V1. There is no account creation or sign-in.
- **Persistence:** Profile preferences, Saved items, Want to Go status, and Passport records persist locally on the device. The specific storage library is an architecture-level decision, to be determined in `ARCHITECTURE.md`.
- **Offline behavior:** locally stored Profile, Saved, and Passport data remain available offline; remote images and map tiles display a clear offline fallback when unavailable.
- Solo, AI-assisted implementation under the confirmed workflow: Ivy directs product decisions, ChatGPT supports product direction and documentation, Claude reviews product and technical decisions, Codex implements.
- No backend AI/ML personalization — Discover ranking is rules-based matching only, computed from stored profile fields.

---

## 17. Acceptance Criteria

- All six confirmed destinations are present, each with exactly two discovery items per discovery layer (ten discovery items each; sixty total).
- Search returns correct results across destination and discovery item names, and filtering by continent, country, interest, category, and region works correctly in the unified filter.
- Discover ranking visibly and correctly changes when a user updates interests or preferred regions; falls back to default editorial ordering when no preferences are set.
- Profile, Saved, Want to Go, and Passport data persist correctly after fully closing and reopening the app, with no account or sign-in required.
- Empty, loading, error, success, and offline states are implemented and behave correctly for Discover, Explore, Saved, and Passport as specified in Section 13.
- Every interactive element has a correct screen reader label, and focus order is logical and predictable across each screen.
- All interactive elements meet the minimum 48 by 48dp touch target size.
- All core flows are fully operable by keyboard alone on the Expo web build, with visible focus indicators.
- The Map displays only discovery items with valid coordinates; discovery items without coordinates never appear on the Map and never produce a broken or empty marker.
- Every displayed image has retrievable attribution metadata matching Section 15.
- Every opening-hours or accessibility field shown meets the verification standard in Section 15 (sourced and dated, or linked to an official source); no unverified practical information is displayed as normal content.
- Marking a destination visited updates the Passport counters and displays a stamp, with no second map or social feature present.
- Core navigation (Discover, Explore, Map, Saved, Passport) is fully functional and matches Section 10.

---

## 18. V1 Exclusions

Flights and hotel booking · transport booking · payments · full itinerary planning · live navigation · AI-based recommendations (Discover personalization is rules-based only) · public reviews · social feeds · direct messaging · a second interactive map within Passport · complex travel history · social features within Passport · custom user-created collections beyond the unified Saved list · account creation or authentication · unverified practical information presented as normal content.

---

## 19. Success Criteria

- Complete, working discovery flow end-to-end across all six destinations (search → destination → five layers → discovery item → save).
- Functioning map showing only valid, coordinate-bearing discovery items, with correct category filtering.
- Rules-based personalization visibly and correctly affecting Discover ordering.
- Local persistence working correctly across app restarts with no authentication required.
- Accessibility requirements (Section 14) implemented and verifiable, not only described.
- Consistent design system across content-heavy screens.
- Deployed, working build with a live, shareable link (Expo web).

Deliberately excluded from success criteria: user counts, engagement metrics, or any invented usage numbers.

---

## 20. Confirmed Destination Set

1. **Cross River, Nigeria** — Obudu Mountain Resort, waterfalls, forests, wildlife, cultural heritage, local food, lesser-known natural attractions.
2. **Cape Town, South Africa** — dramatic mountains, coastline, culture, food, iconic landmarks, nearby natural experiences.
3. **Cappadocia, Türkiye** — landscapes, cave architecture, underground cities, cultural history, food, balloon scenery.
4. **Kyoto, Japan** — temples, gardens, traditional districts, seasonal landscapes, food culture, quieter local discoveries.
5. **Rio de Janeiro, Brazil** — mountains, beaches, landmarks, neighbourhood culture, food, nature, lesser-known viewpoints.
6. **Banff, Canada** — mountain scenery, turquoise lakes, wildlife, trails, local culture, quieter natural attractions.

Each destination contains exactly two discovery items per discovery layer (Iconic, Hidden, Culture, Taste, Nature) — sixty discovery items across V1, sufficient content depth for a working portfolio MVP without implying complete global tourism coverage.
