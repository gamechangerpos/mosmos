# Virgin Limited Edition — Media & Design System Extraction

Comprehensive media extraction and design system analysis for [Virgin Limited Edition](https://www.virginlimitededition.com/) — Sir Richard Branson's portfolio of luxury retreats across the globe.

---

## 📁 Repository & Folder Organization

```text
MOS MOS SAFARI/
│
├── Africa/                                      # African luxury safari & retreats
│   ├── Finch_Hattons/                           # Tsavo West, Kenya (Safaris, Kilimanjaro views)
│   │   ├── images/                              # 21 high-res master photographs
│   │   ├── videos/                              # Finch_Hattons_Hero_Video.mp4 + metadata
│   │   └── Finch_Hattons_Catalog.md             # Complete asset catalog
│   ├── Kasbah_Tamadot/                          # Atlas Mountains, Morocco (Luxury riads & castle)
│   │   ├── images/                              # 26 high-res master photographs
│   │   ├── videos/                              # Kasbah_Tamadot_Hero_Video.mp4 + metadata
│   │   └── Kasbah_Tamadot_Catalog.md            # Complete asset catalog
│   ├── Mahali_Mzuri/                            # Maasai Mara, Kenya (Migration safari camp)
│   │   ├── images/                              # 20 high-res master photographs
│   │   ├── videos/                              # Mahali_Mzuri_Hero_Video.mp4 + metadata
│   │   └── Mahali_Mzuri_Catalog.md              # Complete asset catalog
│   ├── Mont_Rochelle/                           # Franschhoek, South Africa (Vineyard & culinary estate)
│   │   ├── images/                              # 20 high-res master photographs
│   │   ├── videos/                              # Mont_Rochelle_Hero_Video.mp4 + metadata
│   │   └── Mont_Rochelle_Catalog.md             # Complete asset catalog
│   ├── Ulusaba/                                 # Sabi Sand, South Africa (Big 5 private game reserve)
│   │   ├── images/                              # 19 high-res master photographs
│   │   ├── videos/                              # Ulusaba_Hero_Video.mp4 + metadata
│   │   └── Ulusaba_Catalog.md                   # Complete asset catalog
│   └── Africa_Overview.md                       # Regional portfolio overview
│
├── Caribbean/                                   # Private island retreats
│   ├── Necker_Island/                           # British Virgin Islands (Private 74-acre island)
│   │   ├── images/                              # 28 high-res master photographs
│   │   ├── videos/                              # Necker_Island_Hero_Video.mp4 + metadata
│   │   └── Necker_Island_Catalog.md             # Complete asset catalog
│   ├── The_Branson_Beach_Estate/                # Moskito Island, BVI (Beachfront pavilions)
│   │   ├── images/                              # 26 high-res master photographs
│   │   ├── videos/                              # The_Branson_Beach_Estate_Hero_Video.mp4 + metadata
│   │   └── The_Branson_Beach_Estate_Catalog.md  # Complete asset catalog
│   └── Caribbean_Overview.md                    # Regional portfolio overview
│
├── Europe/                                      # European mountain & coastal sanctuaries
│   ├── Son_Bunyola/                             # Mallorca, Spain (UNESCO Tramuntana finca & villas)
│   │   ├── images/                              # 21 high-res master photographs
│   │   ├── videos/                              # Son_Bunyola_Hero_Video.mp4 + metadata
│   │   └── Son_Bunyola_Catalog.md               # Complete asset catalog
│   ├── The_Lodge/                               # Verbier, Switzerland (Exclusive alpine chalet)
│   │   ├── images/                              # 19 high-res master photographs
│   │   ├── videos/                              # The_Lodge_Hero_Video.mp4 + metadata
│   │   └── The_Lodge_Catalog.md                 # Complete asset catalog
│   └── Europe_Overview.md                       # Regional portfolio overview
│
├── Brand_and_General/                           # Global brand assets
│   ├── images/                                  # Logos, regional thumbnails, flamingo hero banner
│   └── videos/                                  # Virgin Limited Edition 120s Collection Showreel
│
├── Design_System_and_Effects/                   # Complete design specification & interactive guide
│   ├── WEBSITE_DESIGN_AND_EFFECTS_SPECIFICATION.md # Full technical specification (Fonts, colors, animations, grids)
│   ├── interactive_style_guide.html             # Standalone interactive showcase (live curtain reveals, palette switchers)
│   └── extracted_tokens.json                    # Machine-readable design tokens (JSON)
│
└── README.md                                    # Master project documentation
```

---

## 🎨 Design System Summary

### 1. Typography Hierarchy
- **Display Serif**: `miller-banner` (Adobe Typekit)
  - Used for editorial titles, luxury headers, and booking triggers.
  - Sizing: `45px` (Hero Titles), `28px` (Offer Headings), `24px` (Editorial Quotes).
  - Weights: `300` (Light), `400` (Regular), `700` (Bold), `800` (Extra Bold).
- **Interface Sans-Serif**: `aktiv-grotesk` (Adobe Typekit)
  - Used for body copy, category badges, captions, and navigation links.
  - Sizing: `14px` / `24px` line-height (Body text), `9px` uppercase (Badges).
  - Weights: `300` (Light), `400` (Regular), `500` (Medium), `700` (Bold).

### 2. Location-Specific Brand Color Palette
Each property is paired with an authentic regional color accent:
- **Kasbah Tamadot** (Morocco / Africa): `#B83C25` (Atlas Terracotta)
- **Mahali Mzuri** (Kenya / Africa): `#BA5F27` (Savannah Ochre)
- **Finch Hattons** (Kenya / Africa): `#4A4238` (Safari Canvas & Leather)
- **Mont Rochelle** (South Africa / Africa): `#8A8F64` (Vineyard Sage)
- **Ulusaba** (South Africa / Africa): `#7C6119` (Bushveld Amber)
- **Necker Island** (Caribbean): `#00B3D2` (Coral Reef Cyan)
- **The Branson Beach Estate** (Caribbean): `#2CB2A5` (Moskito Lagoon Teal)
- **Son Bunyola** (Mallorca / Europe): `#5F7361` (Tramuntana Mountain Pine)
- **The Lodge** (Switzerland / Europe): `#365D9D` (Alpine Glacier Dusk)
- **Core Dark & Light**: `#0f0f0f` (Charcoal Black), `#f6f6f6` (Soft Off-White).

### 3. Signature Animations
- **Curtain Reveal**: Solid white mask overlays slide off horizontally (`@keyframes animate-image-left-curtain`, `@keyframes animate-image-right-curtain`) while the underlying photograph gently scales down from `1.08` to `1.0` and fades in (`@keyframes animate-image-reveal`).
- **Smooth Hover Physics**: `transform: scale(1.03);` with `cubic-bezier(0.25, 1, 0.5, 1)` easing.

### 4. Scrolling Effects
- **Sticky Header Shrink**: Compresses navigation height and applies backdrop blur and shadow at `scrollY > 80px`.
- **Viewport Triggers**: IntersectionObserver triggers curtain animations at 15% viewport intersection.
- **Parallax Depth**: Layered text and background photo translation on scroll.

### 5. Layout & Image Placement Strategy
- **Asymmetric Hero Split**: 40% editorial left column paired with a 60% high-impact 4:5 portrait photo.
- **FlexMasonry Staggered Grid**: 3 fluid columns that balance landscape (3:2) and portrait (4:5) photography without gaps.
- **Floating Badges**: Off-white uppercase badges positioned with negative offsets over image corners.

---

## 🚀 How to View the Interactive Showcase
Open [`Design_System_and_Effects/interactive_style_guide.html`](./Design_System_and_Effects/interactive_style_guide.html) in your browser (double-click the file in Windows Explorer or open via Chrome/Edge). It includes:
- Live interactive trigger buttons for the **Curtain Reveal Effect**.
- Clickable **Property Theme Switcher** that dynamically updates all website accents.
- Responsive **FlexMasonry Preview** using the extracted photography.
- Demonstration of the **Asymmetric Editorial Layout**.
