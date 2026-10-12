---
name: Tashkent Modern Marketplace
colors:
  surface: '#faf8ff'
  surface-dim: '#d7d9e8'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3ff'
  surface-container: '#ebedfc'
  surface-container-high: '#e5e7f6'
  surface-container-highest: '#dfe2f1'
  on-surface: '#171b26'
  on-surface-variant: '#434655'
  inverse-surface: '#2c303b'
  inverse-on-surface: '#eef0ff'
  outline: '#737686'
  outline-variant: '#c3c6d7'
  surface-tint: '#0053db'
  primary: '#004ac6'
  on-primary: '#ffffff'
  primary-container: '#2563eb'
  on-primary-container: '#eeefff'
  inverse-primary: '#b4c5ff'
  secondary: '#006c49'
  on-secondary: '#ffffff'
  secondary-container: '#6cf8bb'
  on-secondary-container: '#00714d'
  tertiary: '#784b00'
  on-tertiary: '#ffffff'
  tertiary-container: '#996100'
  on-tertiary-container: '#ffeedd'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b4c5ff'
  on-primary-fixed: '#00174b'
  on-primary-fixed-variant: '#003ea8'
  secondary-fixed: '#6ffbbe'
  secondary-fixed-dim: '#4edea3'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#005236'
  tertiary-fixed: '#ffddb8'
  tertiary-fixed-dim: '#ffb95f'
  on-tertiary-fixed: '#2a1700'
  on-tertiary-fixed-variant: '#653e00'
  background: '#faf8ff'
  on-background: '#171b26'
  surface-variant: '#dfe2f1'
typography:
  display:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: '800'
    lineHeight: 48px
    letterSpacing: -0.02em
  display-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '800'
    lineHeight: 36px
    letterSpacing: -0.015em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.015em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  price-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 26px
    fontWeight: '800'
    lineHeight: 32px
    letterSpacing: -0.02em
  price-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '700'
    lineHeight: 26px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-md:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '600'
    lineHeight: 18px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.04em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-desktop: 1.5rem
  margin: 1rem
  margin-tablet: 1.5rem
  margin-desktop: 2rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

This design system is engineered for a high-velocity, high-trust metropolitan real estate marketplace tailored to Tashkent’s rapidly evolving property ecosystem. The aesthetic balances institutional credibility with agile consumer tech dynamism.

### Personality & Tone
- **Authoritative & Secure:** Real estate decisions require uncompromising trust. The visual language favors structural discipline, crisp metric alignments, and unmistakable status indicators.
- **Urban & Contemporary:** Tailored for a mobile-native demographic navigating Tashkent's vibrant new builds (novostroyki) and secondary rental markets.
- **Optimistic & Decisive:** Interfaces emphasize clarity, frictionless property submission, transparent pricing filters, and instant communication pathways (e.g., Telegram integration, direct calls).

### Visual Movement: Modern Tactile Hybrid
A contemporary SaaS-meets-marketplace style fusing crisp, borderless structural planes with targeted atmospheric elevation. Interfaces rely on clean Slate surfaces (`#f8fafc`), floating card architectures (`#ffffff`), and deliberate micro-depth cues rather than heavy skeuomorphism.

## Colors

The palette balances financial institutional confidence with urgent conversion hooks.

### Functional Roles
- **Primary Sapphire (`#2563eb`, hover: `#1d4ed8`):** Anchors main navigational pathways, search queries, filter resets, active tab highlights, and verified realtor badges.
- **Secondary Emerald (`#10b981`, hover: `#059669`):** Dedicated conversion accelerator. Used exclusively for "Подать объявление" (Post Listing), confirmed booking steps, positive verification checkmarks, and competitive price-drop badges.
- **Tertiary Amber (`#f59e0b`, fill tint: `#fef3c7`):** High-priority contextual awareness reserved for user-owned properties ("⭐ Ваше объявление"), urgent expiration warnings, and exclusive premium placements.
- **Neutrals & Surfaces:**
  - **Light Mode Canvas:** `#f8fafc` provides a neutral, low-strain backdrop that separates naturally from pure `#ffffff` listing cards.
  - **Dark Mode Core:** Deep obsidian canvas at `#0b0f19` paired with elevated card surfaces at `#131b2e` and borders at `#1e293b`.
  - **Typography Slate:** `#0f172a` (primary text), `#475569` (secondary metadata, addresses, floor levels), and `#94a3b8` (inactive icons, placeholder states).

## Typography

The type system blends the energetic geometry of **Plus Jakarta Sans** for headers, district indicators, and property pricing blocks with the high-legibility utilitarian structure of **Inter** for real estate specifications, legal details, and parameter tables.

### Execution Guidelines
- **Financial Figures (Prices in UZS / USD):** Always format apartment prices using `price-xl` or `price-lg` with tabular numbers enabled (`tnum`) to eliminate optical jitter across list comparison views.
- **Multilingual Consistency:** Ensure all weights support extended Cyrillic glyphs without layout shifts between Russian and Uzbek (Latin/Cyrillic) property descriptions.
- **Badges & Metrics:** Metric counters (e.g., `42 м²`, `3/9 эт.`) must pair with uppercase micro-labels (`label-sm`) for spatial efficiency on smaller handheld screens.

## Layout & Spacing

A mobile-first fluid layout that locks into a max-width container of `1280px` on desktop viewport sizes.

### Breakpoints & Grid Structure
- **Mobile (< 768px):** Single-column layout. Horizontal snap scrolls for filter presets (Mirabad, Chilanzar, Yunusabad) and media galleries. Gutter is set at `1rem`, with outer margins locked to `1rem` to maximize mobile image aspect ratios.
- **Tablet (768px - 1024px):** 2-column listing grid. Outer margins increase to `1.5rem`. Filter bar transitions to a sticky top horizontal sheet.
- **Desktop (> 1024px):** 12-column grid. Listing feeds utilize 3-column splits (`span 4`), while map-view integration adopts an asymmetric 5:7 split (Sticky Map on right 7 columns, scrollable listings on left 5 columns). Gutter is fixed at `1.5rem`, outer margins at `2rem`.

### Spacing Harmony
- Use `space-xs` (4px) and `space-sm` (8px) for internal pill tags, room count badges, and parameter chips.
- Use `space-md` (16px) for listing card interior padding and mobile row item separation.
- Use `space-lg` (24px) for separation between distinct section blocks (e.g., amenities grid, floor plan, mortgage calculator).

## Elevation & Depth

This system avoids heavy, muddy shadows, opting for diffused, ambient lighting that simulates clean natural light reflecting off architectural surfaces.

### Surface Tiers
- **Tier 0 (Ground):** Canvas background `#f8fafc` (Dark: `#0b0f19`).
- **Tier 1 (Resting Cards):** Surface `#ffffff` (Dark: `#131b2e`) with a crisp border: `1px solid rgba(226, 232, 240, 0.8)` (Dark: `1px solid rgba(255, 255, 255, 0.08)`) and ambient shadow: `0 1px 3px rgba(15, 23, 42, 0.05)`.
- **Tier 2 (Hover & Active Listings):** Lifted card state. Border switches to `1px solid rgba(37, 99, 235, 0.3)`. Shadow transitions to: `0 10px 25px -5px rgba(15, 23, 42, 0.08), 0 8px 10px -6px rgba(15, 23, 42, 0.04)`.
- **Tier 3 (Modals, Bottom Sheets, Filter Drawers):** Heavy diffuse elevation: `0 20px 25px -5px rgba(15, 23, 42, 0.12), 0 10px 10px -5px rgba(15, 23, 42, 0.04)` combined with backdrop blur (`backdrop-filter: blur(8px); background: rgba(255, 255, 255, 0.85)`).
- **Personal Listing Highlight:** For user-owned listings, apply an ambient inner-glow or border tint using tertiary amber: `0 0 0 1px #f59e0b, 0 4px 12px rgba(245, 158, 11, 0.12)`.

## Shapes

The roundedness language conveys an ergonomic, modern mobile feel without leaning childish.

### Radius Implementations
- **Core Elements (0.5rem / 8px):** Small badges, icon buttons, input boxes, inline filter tags, and quick-call triggers.
- **Card Containers (`rounded-lg` / 1rem / 16px):** Primary listing tiles, gallery image wraps, complex parameter containers, and bottom navigation sheets.
- **Featured Visual Elements (`rounded-xl` / 1.5rem / 24px):** Hero promotional search bars, district explore cards, and bottom sheet containers on mobile devices.
- **Full Radius (Pill / 9999px):** Filter pill buttons, status indicators ("Вторичка", "Новостройка"), verification status dots, and floating map switch triggers.

## Components

### Buttons
- **Primary Action (Call / Apply Filter):** Sapphire blue (`#2563eb`) solid background, white text, 12px vertical padding, 16px radius, subtle font weight (600). Active click triggers a scale transform of `0.98`.
- **Listing CTA ("Подать объявление"):** Emerald green (`#10b981`) solid fill with white text, paired with a plus icon. High prominence in the top navigation and mobile bottom bar.
- **Ghost & Secondary:** Transparent background with `1px solid #e2e8f0`, slate text (`#334155`), transitioning to sapphire fill tint (`rgba(37, 99, 235, 0.05)`) on hover.

### Property Listing Cards
- Constructed with an upper media section (16:10 aspect ratio, rounded top corners), layered with a top-left status chip (e.g., "Аренда", "Продажа"), and top-right favorite heart button with frosted glass backdrop blur.
- Content zone has 16px interior padding. Hierarchy: Price (`price-lg`) -> Neighborhood / District (`body-md`, bold) -> Micro parameters in chips (`42 м² · 2 комн. · 4/9 эт.`).
- User-owned cards show a top-pinned banner with warm amber badge: `⭐ Ваше объявление` with edit and promote shortcuts.

### Chips & Badges
- **Status Badges:** Pill-shaped with subtle tinted backgrounds. Green tint (`#ecfdf5` text `#065f46`) for ready-to-move properties, blue tint (`#eff6ff` text `#1e40af`) for new developer projects.
- **Interactive Filter Chips:** Bordered, clickable items with `#f1f5f9` inactive state and solid Sapphire `#2563eb` with white text when toggled active.

### Inputs & Search
- Large, finger-friendly inputs (height: 48px to 52px on mobile) with neutral slate outlines (`#cbd5e1`). Focus states trigger an immediate crisp ring: `box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.2)` with sapphire border (`#2563eb`).
- Search bars integrate multi-segment inputs (District, Price range, Rooms) with clean hairline dividers (`1px solid #e2e8f0`).

### Mobile Bottom Navigation
- Fixed navigation dock on mobile screens featuring Home, Search, Saved, "Подать объявление" (highlighted center button in emerald green), and Profile. Uses elevated blur backdrop for clean readability over moving listings.