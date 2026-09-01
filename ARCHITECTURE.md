# World Unfolded — ARCHITECTURE.md (V1, revised)

**Status:** Derived from the locked `PRD.md`. This document does not change product scope, the seven destinations, the five discovery layers, primary navigation, or platform. This revision incorporates the approved Phase 5.5 destination, content-count, and visual-direction corrections.

**PRD alignment:** Passport uses **Countries visited** and **Destinations visited** because the destination model supports different locality types. The governing documents and implementation use that wording consistently.

**Audience:** Codex will implement directly from this document. Where an exact dependency version or platform behavior cannot be verified here, it is explicitly flagged for confirmation during project setup rather than invented.

---

## 1. Project Foundation

- **Expo setup:** Managed Expo workflow, initialized with the latest stable Expo SDK available at project setup time. *(Flag for verification: confirm exact Expo SDK version and its documented compatibility with `react-native-maps` and `expo-image` at setup time.)*
- **Router:** Expo Router (file-based routing), TypeScript template.
- **TypeScript:** `strict: true`, extending Expo's base `tsconfig`. No `any` in shared types; local component state may use inferred types.
- **Package manager:** npm, for maximum compatibility with Expo/Metro tooling.
- **Linting/formatting:** ESLint using the official Expo ESLint config as a base, plus Prettier. Exact package versions confirmed against the installed Expo SDK at setup.
- **Environment/configuration:** No backend and no authentication means minimal environment surface for day-to-day V1 development. `react-native-maps` runs inside Expo Go with no additional native configuration for development (Section 9) — **no Google Maps API key is required as an immediate V1 environment variable.** A Google Maps API key only becomes necessary if and when a standalone Android/iOS binary is produced, per the installed Expo SDK's current documentation at that time; that requirement and its exact configuration must be verified during the setup step that precedes producing a standalone build, not assumed now. `.env.example` should note this as a future/conditional requirement rather than listing it as required for initial development.

---

## 2. Folder Structure

```
world-unfolded/
├── app/                          # Expo Router routes (see Section 3)
│   ├── _layout.tsx                # Root layout; redirects "/" to the Discover tab
│   ├── (tabs)/
│   │   ├── _layout.tsx            # Tab navigator layout (stable JS Tabs, not experimental native tabs)
│   │   ├── discover.tsx
│   │   ├── saved.tsx
│   │   ├── passport.tsx
│   │   └── profile.tsx
│   ├── destination/[id].tsx       # Outside the tab group — see Section 3
│   ├── item/[id].tsx              # Outside the tab group
│   ├── explore.tsx                # Secondary browse/search route outside the tab group
│   └── image-credits/[imageId].tsx # Outside the tab group
├── src/
│   ├── components/
│   │   ├── ui/                    # Buttons, Cards, Chips, Tags, EmptyState, ErrorState, Tappable, etc.
│   │   ├── map/                   # Map surface — see Section 9 for exact structure
│   │   └── accessibility/         # Focus, touch-target, and text-scale helpers
│   ├── features/
│   │   ├── discover/
│   │   ├── explore/
│   │   ├── map/
│   │   ├── saved/
│   │   ├── passport/
│   │   └── profile/
│   ├── content/
│   │   ├── destinations/
│   │   ├── discoveryItems/
│   │   ├── images/
│   │   └── vocabularies/          # Controlled vocabularies — see Section 4
│   ├── types/                     # Shared TypeScript models (Section 4)
│   ├── state/
│   │   ├── profileStore.ts
│   │   ├── savedStore.ts
│   │   └── passportStore.ts
│   ├── persistence/
│   ├── personalization/
│   ├── search/
│   ├── tokens/
│   ├── accessibility/
│   ├── utils/
│   └── test/
├── __tests__/
├── assets/
├── app.config.ts
├── .env.example
└── package.json
```

Directory responsibilities are unchanged from the prior revision except: `src/content/vocabularies/` is new (Section 4), and `app/(tabs)/_layout.tsx` and root `app/_layout.tsx` are now explicit (Section 3).

---

## 3. Routing Architecture

**Tab group:** `app/(tabs)/_layout.tsx` defines the primary navigation using Expo Router's stable JavaScript `Tabs` component (from `expo-router`) — not an experimental native tab implementation. This file was missing from the previous revision and is now explicit.

**Root redirect:** `app/_layout.tsx` (or a root `app/index.tsx`, whichever the confirmed Expo Router version's convention favors — verify at setup) redirects the root URL to `/(tabs)/discover`, so the app always opens on Discover rather than an undefined root.

**Secondary and detail routes remain outside the tab group** (`explore`, `destination/[id]`, `item/[id]`, `image-credits/[imageId]`), so that back navigation returns the user to whichever screen actually opened them rather than always returning to a fixed tab.

| Route | Purpose | Params |
|---|---|---|
| `/` | Redirects to `/(tabs)/discover` | — |
| `/(tabs)/discover` | Discover screen | — |
| `/(tabs)/saved` | Saved screen | — |
| `/(tabs)/passport` | Passport screen | — |
| `/(tabs)/profile` | Profile screen | — |
| `/explore` | Secondary Explore/search screen | optional query params for active filters |
| `/destination/[id]` | Destination Details | `id`: destination id |
| `/item/[id]` | Discovery Item Details | `id`: discovery item id |
| `/image-credits/[imageId]` | Image attribution view | `imageId`: image asset id |

---

## 4. Content Architecture

### Controlled vocabularies

Defined as `const` arrays with a derived union type each, so the same list is usable both as a compile-time type and as a runtime-checkable array in the content-validation script (Section 12):

```ts
export const REGIONS = [
  'southeast_asia', 'north_africa', 'southern_europe',
  'western_asia', 'east_asia', 'south_america',
] as const;
export type Region = typeof REGIONS[number];

export const INTEREST_TAGS = [
  'nature', 'wildlife', 'culture', 'food', 'architecture',
  'adventure', 'history', 'beaches', 'mountains', 'photography',
] as const;
export type InterestTag = typeof INTEREST_TAGS[number];

export const DISCOVERY_LAYERS = ['iconic', 'hidden', 'culture', 'taste', 'nature'] as const;
export type DiscoveryLayer = typeof DISCOVERY_LAYERS[number];

export const DISCOVERY_ITEM_TYPES = [
  'attraction', 'landmark', 'cultural_practice',
  'food_experience', 'natural_site', 'hidden_place',
] as const;
export type DiscoveryItemType = typeof DISCOVERY_ITEM_TYPES[number];

export const LOCALITY_TYPES = ['city', 'town', 'region', 'national_park', 'mixed_region'] as const;
export type LocalityType = typeof LOCALITY_TYPES[number];
```

Free-text strings are not used for any of the above — every value must come from its defined list, enforced at compile time and re-checked by the content-validation script (Section 12).

The active V1 destination registry contains exactly: Bali, Indonesia; Marrakech, Morocco; Santorini, Greece; Rome, Italy; Cappadocia, Türkiye; Kyoto, Japan; and Rio de Janeiro, Brazil.

### Typed models

```ts
interface Destination {
  id: string;
  name: string;
  country: string;
  continent: string;
  region: Region;
  localityType: LocalityType;        // e.g. Bali = 'mixed_region', Rome = 'city', Cappadocia = 'region'
  culturalOverview: string;
  heroImageId: string;
  nearbyDestinationIds: string[];
  interestTags: InterestTag[];
  layerTags: DiscoveryLayer[];        // which discovery layers this destination is strongest in
  editorialPriority: number;          // static baseline used by personalization scoring (Section 7)
}

interface Coordinates {
  latitude: number;
  longitude: number;
}

function isValidCoordinate(location?: Partial<Coordinates>): location is Coordinates {
  if (!location) return false;
  const { latitude, longitude } = location;
  return (
    typeof latitude === 'number' && Number.isFinite(latitude) && latitude >= -90 && latitude <= 90 &&
    typeof longitude === 'number' && Number.isFinite(longitude) && longitude >= -180 && longitude <= 180
  );
}
// map_visible is always derived via isValidCoordinate(item.location), never Boolean(item.location).
// Coordinate presence is never gated by DiscoveryItemType — a food_experience or cultural_practice
// representing an actual physical place may validly carry coordinates and appear on the Map.

type VerifiedInfo = {
  kind: 'verified';
  sourceName: string;
  sourceUrl: string;       // required, must be https
  lastVerifiedDate: string; // ISO date, required
};

type LinkedInfo = {
  kind: 'linked-to-source';
  sourceName: string;
  sourceUrl: string;       // required, must be https — 'linked-to-source' can never exist without a URL
};

type NotApplicableInfo = {
  kind: 'not-applicable';
};

type VerificationRecord = VerifiedInfo | LinkedInfo | NotApplicableInfo;

interface PracticalInformation {
  openingHours?: string;
  accessibilityNotes?: string;
  verification: VerificationRecord;
}

interface DiscoveryItem {
  id: string;
  destinationId: string;
  layer: DiscoveryLayer;
  type: DiscoveryItemType;
  name: string;
  description: string;
  culturalSignificance?: string;
  location?: Coordinates;             // optional — validated via isValidCoordinate before use, any type may carry it
  practicalInformation?: PracticalInformation;
  imageIds: string[];                 // must contain at least one id (Section 12)
  interestTags: InterestTag[];
}

interface ImageAsset {
  id: string;
  url: string;
  source: 'unsplash' | 'pexels' | 'wikimedia_commons';
  creatorName: string;
  licenseOrTerms: string;
  representedSubjectId: string;
  altText: string;
}

interface UserProfile {
  interests: InterestTag[];
  preferredRegions: Region[];
  layerInterests: DiscoveryLayer[];    // feeds the "discovery layer interest" scoring factor (Section 7)
  accessibilityPreferences: {
    reduceMotion: boolean;
    textScale: 'default' | 'large';   // discrete scale, not a runtime multiplier — see Section 11
  };
}

interface SavedItem {
  subjectId: string;
  subjectType: 'destination' | 'discoveryItem';
  status: 'saved' | 'wantToGo';       // one record per subject — see Section 8
  dateAdded: string;
}

interface VisitedRecord {
  destinationId: string;
  dateMarkedVisited: string;
  stampId: string;
}

interface PassportStamp {
  id: string;
  destinationId: string;
  imageAssetId: string;
}

interface CuratedCollection {
  id: string;
  title: string;
  destinationIds: string[];
}
```

### Storage, validation, querying, maintenance

Unchanged from the prior revision: TypeScript const modules (not JSON), chosen for compile-time type safety matching the actual AI-assisted-then-reviewed authoring workflow. Content lives under `src/content/destinations/` and `src/content/discoveryItems/`, aggregated by a `contentIndex.ts`. Controlled vocabularies live in `src/content/vocabularies/` and are imported by both content modules and the validation script. Validation coverage is expanded in Section 12.

---

## 5. State Management

Unchanged from the prior revision: Zustand for the three domains that must be global and persisted (Profile, Saved, Passport); everything else (search/filter, temporary UI state) stays local. See Section 8 for the corrected Saved model and Section 6 for corrected Passport derivation.

---

## 6. Local Persistence

Unchanged mechanics from the prior revision (AsyncStorage, Zustand persist middleware, versioned keys, hydration gate, corrupted-data fallback to defaults). One correction:

**Passport counters are derived at read time as:**
- **Countries visited** — count of distinct `Destination.country` values among visited destinations.
- **Destinations visited** — count of `VisitedRecord` entries (equivalently, distinct `destinationId` values).

"Cities visited" is removed entirely from this document, per the alignment note at the top of this file. Both derived values are computed from `VisitedRecord[]` joined against destination content — never stored as separate counters that could drift.

---

## 7. Rules-Based Personalization

**Scoring is a pure, deterministic function**, now correctly reflecting all inputs named in the PRD (interests, preferred regions, destination tags, discovery-layer interests, editorial priority):

```
score(destination, profile) =
    (matchedInterestTags.length * INTEREST_WEIGHT)
  + (matchedPreferredRegion ? REGION_WEIGHT : 0)
  + (matchedLayerInterests.length * LAYER_WEIGHT)
  + destination.editorialPriority
```

Where:
- `matchedInterestTags` = intersection of `destination.interestTags` and `profile.interests`
- `matchedPreferredRegion` = `profile.preferredRegions.includes(destination.region)`
- `matchedLayerInterests` = intersection of `destination.layerTags` and `profile.layerInterests`
- `destination.editorialPriority` is now a real, typed field on `Destination` (Section 4) — the earlier revision referenced this field without defining it.

**Tie-breaking:** equal scores resolved by `editorialPriority` (descending), then destination `id` (alphabetical) — fully deterministic.

**Default ordering when no preferences exist:** pure editorial ordering (Featured, Editor's Picks, Curated Collections), no scoring applied — matches PRD FR2.

**Testing:** `score()` remains a pure function, unit tested with fixtures covering no preferences, interest-only match, region-only match, layer-interest match, combined matches, and tie-break scenarios.

This remains a weighted-sum rule, fully explainable, and must never be described in-app as AI-driven.

---

## 8. Search and Filtering

Unchanged mechanics from the prior revision (in-memory filtering, normalization, combined predicate filters, shared empty state, negligible-scale performance). Filter options for region and interest now read directly from the controlled vocabularies in Section 4, so filter values can never drift from what content actually uses.

---

## 9. Cross-Platform Map Architecture

### Corrected Expo Go / development-build guidance

The prior revision incorrectly implied a development build is generally required for native map testing. Corrected:

1. **Native map development can begin directly in Expo Go.** `react-native-maps` is included in Expo Go and requires no additional native setup to start development and testing.
2. **A development build (`expo-dev-client`) is only required if a later dependency or configuration introduces custom native code that Expo Go does not include** — this is not expected to be the case for the map feature itself in V1, but must be reconfirmed if other native dependencies are added later.
3. **Google Maps configuration is required only when producing a standalone Android or iOS binary** (not during Expo Go development), following whatever the installed Expo SDK's current documentation specifies at that time.
4. **The exact deployment configuration must be verified during setup** — this document does not assume a specific Expo SDK version's exact binary-build requirements.

### Component structure

The map implementation avoids placing competing platform files under one ambiguous shared filename. Structure:

```
src/components/map/
├── index.ts             # Resolves and re-exports the platform-appropriate MapSurface
├── map.types.ts          # Shared MapSurfaceProps contract — both platform files implement this exactly
├── MapSurface.native.tsx # react-native-maps implementation (iOS/Android)
└── MapSurface.web.tsx    # react-leaflet implementation (web)
```

`map.types.ts` defines the single props contract (markers, active category filter, onMarkerPress, offline/loading state) that both `MapSurface.native.tsx` and `MapSurface.web.tsx` implement identically, so the rest of the app depends only on `MapSurfaceProps` and never on a specific map provider's API.

- **Native:** `react-native-maps`. No API key needed for Expo Go development (see above); Google Maps configuration applies only at standalone-binary time for Android, iOS uses Apple Maps with no key.
- **Web:** `react-leaflet` with OpenStreetMap tiles.
  - **Leaflet CSS:** `leaflet/dist/leaflet.css` must be imported so tiles, markers, and controls render correctly — imported directly within `MapSurface.web.tsx` (Metro's web bundler supports static CSS imports) rather than left to be forgotten at the app-root level.
  - **Container height:** Leaflet requires an explicitly sized container to render at all — `MapSurface.web.tsx` must set an explicit height (a design-token-derived fixed height or a `flex: 1` value inside a parent with a defined height), never an unconstrained/auto-height container.
  - **Attribution:** the OpenStreetMap attribution control rendered by `<TileLayer attribution="..." />` must remain permanently visible — it must not be hidden, collapsed, or placed behind a card, toggle, or overlay of any kind.
  - **Tile provider usage policy:** the public OpenStreetMap tile server has a usage policy (reasonable, low-volume, non-bulk use with an identifying request source) — acceptable for this low-traffic portfolio demonstration only if that policy is followed. The tile server URL and attribution string are passed as configuration into `MapSurface.web.tsx`, not hardcoded deep inside rendering logic, so the tile provider can be swapped later (e.g., to Mapbox) without rewriting the map feature.
- **Markers:** rendered only for discovery items where `isValidCoordinate(item.location)` is true (Section 4/7 below) — items without valid coordinates are filtered out before either platform component receives them, regardless of `DiscoveryItemType`.
- **Category filters / preview cards:** shared UI, rendered identically by both platform files via the shared props contract.
- **Navigation to item details:** marker preview "View details" calls `router.push('/item/[id]')` identically on both platforms.
- **Offline/loading fallback:** a shared `<MapOfflineFallback>` component, invoked identically from both platform files when tiles fail to load.

### Map visibility derivation (corrected)

`map_visible` is never derived as `Boolean(item.location)`. It is derived via the `isValidCoordinate()` validator (Section 4), which confirms latitude is finite and within [-90, 90], longitude is finite and within [-180, 180], and both values are present. This applies uniformly regardless of `DiscoveryItemType` — a `food_experience` or `cultural_practice` item representing an actual physical place is fully eligible for the Map if its coordinates validate; type is never used to gate map eligibility.

**Accessibility alternative:** the Map screen's List view toggle (Section 11) remains the approved accessible alternative, showing the same filtered, coordinate-validated discovery items as a plain list.

---

## 10. Image Architecture

Unchanged from the prior revision: `expo-image` rendering, placeholder/error fallback, built-in caching, fixed-aspect containers, attribution access via `/image-credits/[imageId]`, required `altText` on every `ImageAsset`, offline fallback behavior. Validation coverage is expanded in Section 12.

---

## 11. Accessibility Architecture

### Interactive component semantics (corrected)

The prior revision assumed React Native Web's `Pressable` automatically provides correct semantics and keyboard behavior everywhere. This is not assumed here. The shared `<Tappable>` component must **explicitly** define, not merely inherit by default:

- `accessibilityRole` (e.g., `"button"`, `"link"`) appropriate to its function.
- `accessibilityLabel` (required prop, not optional).
- Disabled state communicated both visually and via `accessibilityState={{ disabled }}`.
- Explicit focusability on web (correct `tabIndex`/native focusability rather than assuming default behavior is sufficient).
- Explicit keyboard activation handling (Enter/Space triggering the same `onPress` behavior on web) — verified during implementation against actual rendered behavior, not assumed correct by design intent alone.
- A visible focus style applied via the design tokens (Section 12), not left to browser/user-agent defaults.

### Screen heading focus (corrected — platform-aware, not universal)

The prior revision proposed calling `AccessibilityInfo.setAccessibilityFocus` universally on navigation. This is corrected: that API requires a native node handle (obtained via `findNodeHandle` on a ref) and its behavior differs across native platforms and is not reliably applicable to web in the same form. The actual mechanism must be confirmed per platform during implementation:
- **Native (iOS/Android):** use `AccessibilityInfo.setAccessibilityFocus` with a properly obtained node handle, verified to behave correctly on the target Expo SDK/RN version.
- **Web:** move DOM focus to the screen's heading element directly (e.g., a heading with `tabIndex={-1}` and a `.focus()` call on mount), which is the correct pattern for web rather than the native API.

This is documented as a platform-specific concern to resolve during implementation, not a single universal call assumed to work everywhere.

### Larger Text (corrected — bounded, non-compounding)

Rather than applying an in-app multiplier on top of the live OS font-scale value (risking uncontrolled double-scaling), the `textScale` preference (Section 4: `'default' | 'large'`) selects between **two predefined sets of typography token values** rather than multiplying against `PixelRatio.getFontScale()` at runtime. This avoids compounding with OS-level accessibility text settings in an unpredictable way. Layouts must be manually tested at the maximum combined scale — the app's `'large'` textScale setting together with the device's own maximum OS text-size accessibility setting — to confirm no clipping or overlap occurs.

### Reduced motion, contrast, non-color indicators, keyboard operation

Unchanged from the prior revision: `useReducedMotion()` reads both the OS setting and the Profile `reduceMotion` preference; contrast tokens are pre-checked against WCAG 2.2 AA at token-definition time; state is never communicated by color alone; keyboard operability and visible focus on web are addressed explicitly per the `<Tappable>` corrections above, not assumed as a React Native Web default.

**Map List view remains the approved accessible alternative** for users who cannot operate the map (unchanged).

---

## 12. Design System Architecture

The active visual direction is colorful, modern, mobile-first tourism: immersive, image-led, premium, clean, and destination-led. It must not read as beige, ivory, dashboard-like, arcade-like, or booking-oriented.

- Main background: Tropical Sky (`#D7F3F4`)
- Secondary warm background: Sunset Coral (`#FFD7C2`)
- Primary action and brand accent: Sunset Vermilion (`#C94F3D`)
- Primary text: Carbon Ink (`#20242C`)
- Quiet card surface: Soft Mist (`#F7FEFC`)
- Controlled accent blue: Ocean Blue (`#1677A8`)

Photography is the primary visual material. Layer colors remain restrained semantic accents for chips, labels, icons, and small highlights rather than large saturated surfaces. Playfair Display remains the destination/editorial typeface and Inter remains the UI/body typeface. The token system continues to cover color, typography, spacing, radius, elevation, motion, breakpoints, and component variants. V1 remains light-mode only.

---

## 13. Error, Loading, Empty, Success, and Offline States

### Loading states (corrected scope)

Bundled TypeScript content (destinations, discovery items, images metadata) loads synchronously as part of the JS bundle and **does not need a loading indicator** — it is not an asynchronous operation and should never be made to appear as one. `<LoadingIndicator>` is used only for:

1. **Persistence hydration** — the brief AsyncStorage read for Profile/Saved/Passport at app start.
2. **Remote images** — while a given image loads over the network.
3. **Map tiles** — while tiles load, on either platform.
4. **Any genuinely asynchronous navigation preparation**, if one is later found to exist — none is currently identified in V1's scope beyond the three above.

No loading state should be simulated or shown for static content that is already available synchronously.

### Other states (unchanged)

`<EmptyState>`, `<ErrorState>`, `<OfflineBanner>` behave as previously specified for empty Saved, empty Passport, no search results, remote image failures, and map/tile failures (with the Map screen's List view remaining fully usable regardless of tile availability).

---

## 14. Testing Strategy

| Type | Tool | Scope |
|---|---|---|
| Unit tests | Jest | Personalization scoring (including the corrected layer-interest factor), search/filter functions, persistence serialization/migration, coordinate validation, verification-record validation |
| Component tests | `@testing-library/react-native` | Shared UI components, `<Tappable>` semantics, key screen compositions |
| Navigation tests | *(Tool to be confirmed at setup)* | Core route transitions, including the root-to-Discover redirect. **The specific navigation testing utility and its compatibility with the installed Expo Router version must be verified during project setup rather than assumed here** — the prior revision named a testing approach without confirming this compatibility. |
| Persistence tests | Jest, AsyncStorage mocked | Hydration, schema migration, corrupted-data fallback, duplicate Saved-entry prevention (Section 8) |
| Personalization tests | Jest | Fixtures covering no-preferences, interest match, region match, layer-interest match, combined match, and tie-break scenarios |
| Search/filtering tests | Jest | Known queries against the actual thirty-five-item dataset |
| Accessibility tests | `@testing-library/react-native` accessibility queries, plus manual pass | Correct roles/labels/disabled states on `<Tappable>` and key components; manual screen-reader pass (VoiceOver/TalkBack) since full automated coverage isn't available for React Native |
| Native + Expo web smoke tests | Jest + React Native Web | Renders-without-crashing checks on both targets, including the root route correctly opening Discover |
| Manual map testing | Manual | Native map behavior verified manually in Expo Go (now correctly not requiring a dev client for initial development, per Section 9); web map verified manually in a browser |
| Content validation | Node/Jest script | Full expanded coverage — see below |

**Additional test coverage now explicitly required:**
1. Duplicate Saved entries — confirm the store structurally prevents more than one record per subject (Section 8).
2. Invalid/corrupted persistence data — confirm graceful fallback to defaults.
3. Passport country and destination counting — confirm correct distinct-count derivation (Section 6), not "cities."
4. Map coordinate validation — unit tests covering valid values, out-of-range values, non-finite values, and missing fields, including exact boundary values (±90, ±180).
5. Offline map List view — confirm it remains usable and renders correctly when tiles/map fail to load.
6. Larger Text and reduced motion behavior — confirm no layout clipping at maximum combined scale, and confirm animations are suppressed when either the OS or in-app reduced-motion preference is set.
7. Root route opening Discover — confirm `/` resolves to `/(tabs)/discover`.

### Content validation — expanded coverage

1. All destination, discovery item, and image IDs are unique within their respective type.
2. Every `DiscoveryItem.destinationId` references an existing destination.
3. Every referenced `imageId` (on destinations and discovery items) exists in the image registry.
4. Every `nearbyDestinationIds` entry references an existing, different destination.
5. Every destination has exactly one discovery item per discovery layer (checked per layer, not only as a total of five).
6. Every `region`, `interestTags`, `layerTags`, `type`, and `localityType` value comes from its defined controlled vocabulary (Section 4).
7. Every present `location` passes `isValidCoordinate()` — coordinate validity is checked without regard to `DiscoveryItemType`.
8. Every `ImageAsset` has complete attribution (`source`, `creatorName`, `licenseOrTerms`, `representedSubjectId`, `altText`).
9. Every `PracticalInformation.verification` record satisfies its discriminated variant's required fields (Section 4/6) — a `verified` record has `sourceName`, `sourceUrl`, and `lastVerifiedDate`; a `linked-to-source` record has `sourceName` and `sourceUrl`.
10. Every `sourceUrl` (verified or linked) uses `https://`.
11. Every discovery item has at least one entry in `imageIds`.
12. Every destination's `heroImageId` references an existing, valid `ImageAsset`.

---

## 15. Performance

Unchanged from the prior revision — standard `FlatList`, `expo-image` default caching, in-memory array filtering, filtered-subset-only map marker rendering, Zustand selector-based re-render avoidance, negligible hydration cost at this data scale. No indexing engines, virtualization libraries, or aggressive memoization strategies are justified for thirty-five discovery items.

---

## 16. Privacy and Security

### Corrected wording on external requests

The prior revision incorrectly stated that external image and map requests "carry no user data." Corrected: **external image (Unsplash/Pexels/Wikimedia) and map tile (Google Maps/OpenStreetMap) requests may expose ordinary technical request metadata to those providers — IP address, user agent, referrer, and other standard network-level information — as with any external HTTP request.** This is normal browser/app networking behavior, not something World Unfolded controls. What can be stated accurately: **World Unfolded does not intentionally attach any locally stored Profile, Saved, or Passport data to these external requests.**

### Other privacy/security points (unchanged)

- **Data stored:** Profile preferences, Saved/Want to Go items, Passport/visited records — on-device only, nothing transmitted anywhere, since there is no backend.
- **Safe external links:** any official-source link opens via `Linking.openURL`, restricted to `https://` URLs (Section 4/12).
- **Environment variables:** no API key is required for initial development (Section 1/9); a Google Maps key becomes relevant only at standalone-binary time, verified against current Expo SDK documentation when that time comes.
- **No secrets in GitHub:** `.gitignore` excludes all `.env*` except `.env.example`.

---

## 17. Implementation Boundaries

**Belongs in V1:** everything specified in the locked PRD, implemented per this corrected architecture.

**Deferred (not V1):** authentication/accounts, any backend service, AI/ML-based recommendations, a second interactive map or complex travel history within Passport, social features, custom user-created collections.

**Codex must not build:**
- Any backend, API, or database service.
- Any AI/ML model for personalization — scoring remains the deterministic function in Section 7.
- Dark mode visual theming (token structure only).
- Any automated link-checker or live-data-freshness system for verification sources.
- A Google Maps API key setup as part of initial development — that step applies only at standalone-binary production time (Section 9).

**Technical decisions requiring verification at project setup:**
- Exact Expo SDK version and its documented compatibility with `react-native-maps` and `expo-image`.
- The exact standalone-binary configuration steps for Google Maps on Android/iOS, per current Expo SDK documentation at build time.
- Exact versions of `react-leaflet` and its peer dependencies.
- The specific navigation testing utility compatible with the installed Expo Router version (Section 14).
- The exact mechanism for platform-aware screen-heading focus (Section 11).

**Known risks and mitigations:**
- **Map platform fragmentation** — mitigated by the `MapSurface.native.tsx` / `MapSurface.web.tsx` / shared `map.types.ts` structure (Section 9).
- **OpenStreetMap tile usage policy** — mitigated by using it only within its acceptable low-traffic terms, and by keeping the tile provider swappable via configuration rather than hardcoded (Section 9).
- **Verification source staleness over time** — mitigated by treating "last verified" dates as an explicit, visible UI element; no automated freshness-checking is in scope for V1.
- **"Cities visited" mismatch with actual destination types** — resolved architecturally via Countries/Destinations visited (Section 6); **requires a corresponding PRD wording update before implementation**, per the alignment note at the top of this document.
- **Double text-scaling from combining OS and in-app accessibility settings** — mitigated by using discrete predefined type-scale tokens rather than a runtime multiplier (Section 11).

---

## 18. Architecture Decision Records

| Decision area | Chosen approach | Reason | Rejected alternative |
|---|---|---|---|
| Routing | Expo Router (file-based), stable JS `Tabs`, explicit root redirect to Discover | Matches Expo-first tooling; explicit tab layout and redirect avoid an undefined root route | Experimental native tab implementations — explicitly rejected per correction |
| State management | Zustand, scoped to Profile/Saved/Passport only | Minimal boilerplate, selector-based re-renders, easy persistence integration | Redux/MobX (too heavy); plain Context (re-render footguns) |
| Persistence | AsyncStorage + Zustand persist middleware | Standard Expo-compatible KV store | `expo-sqlite` (unnecessary relational overhead) |
| Static content format | TypeScript const modules, with controlled-vocabulary const arrays | Compile-time safety and editor autocomplete matching the actual authoring workflow | Raw JSON (no compile-time safety) |
| Map implementation | `react-native-maps` (native, works in Expo Go for development) + `react-leaflet`/OpenStreetMap (web), behind a `MapSurface.native/.web` + shared `map.types.ts` contract | Only combination giving a genuinely working map on both native and Expo web without a paid web map key; corrected structure avoids competing same-named files | A single cross-platform map library (none adequately support both targets); the prior `MapView.tsx`/`.native`/`.web` naming (ambiguous, corrected) |
| Passport counting | Countries visited + Destinations visited (not "cities") | The destination model supports cities, regions, and mixed localities, so "cities" is not a valid universal count | Deriving or forcing a "city" value onto every destination |
| Practical info verification | Discriminated union (`verified` / `linked-to-source` / `not-applicable`) with required fields per variant | Makes invalid states (e.g., a link with no URL) structurally unrepresentable | A loose union of an object and string literals, which previously allowed inconsistent shapes |
| Saved/Want to Go | Single `status: 'saved' | 'wantToGo'` field per subject, one record per subject, status changes replace in place | One deterministic model, no duplicate-record ambiguity | Two independent boolean flags or separate lists, which could let both states coexist ambiguously |
| Map visibility | Derived via `isValidCoordinate()`, never `Boolean(item.location)`, never gated by item type | Prevents invalid coordinates (out of range, non-finite) from producing markers; allows any item type representing a real place to appear on the map | `Boolean(item.location)` alone, or excluding certain item types from map eligibility by default |
| Image handling | `expo-image`, referenced by URL, not bundled | Built-in caching/performance; avoids redistributing third-party images without confirmed permission | Bundling images directly |
| Testing | Jest + `@testing-library/react-native`; navigation-testing tool confirmed at setup, not assumed | Matches Expo/RN tooling conventions; avoids naming a navigation-testing utility without confirming Expo Router compatibility | Naming a specific navigation test library upfront without version verification |
| Authentication | None | PRD explicitly excludes accounts/auth for V1 | Any auth provider |
