# Virgin Limited Edition — Design, Layout, Animation & Effects Specification

> **Source**: [Virgin Limited Edition](https://www.virginlimitededition.com/)  
> **Extraction & Analysis Target**: Luxury Retreats Across The Globe  
> **Document Purpose**: Complete technical breakdown of visual styles, typography, brand colors, layout grids, animations, scrolling effects, and image placement rules.

---

## 1. Executive Design & Aesthetics Philosophy

Virgin Limited Edition crafts an ultra-luxury, editorial storytelling experience. The aesthetic balances **timeless heritage typography** (classic high-contrast serif headlines) with **modern minimalist Swiss interface sans-serif**, generous whitespace, full-bleed cinematic imagery, and theatrical theatrical image reveal effects.

### Key Visual Pillars
1. **Theatrical Curtain Reveals**: Images don't merely "fade in"; they are unveiled using sliding architectural curtains that glide smoothly off the frame while the photograph gently scales down into sharp focus.
2. **Editorial Asymmetry**: Off-center headlines, asymmetric 2-column storytelling splits, and staggered masonry grids provide an organic, magazine-like cadence rather than rigid corporate blocks.
3. **Location-Specific Color Identity**: While the core website navigation and UI maintain a crisp, minimalist black (`#0f0f0f`) and soft off-white (`#f6f6f6`), each property features a distinct signature brand color drawn from its geography (e.g. terracotta for Morocco, bushveld amber for South Africa, turquoise for the Caribbean).

---

## 2. Color Palette & Property Brand Tokens

### Core Neutral Palette
| Token | Hex | Usage |
|---|---|---|
| `--color-dark` | `#0f0f0f` | Primary headings, luxury serif titles, heavy borders |
| `--color-pure-black` | `#000000` | High-contrast overlays, modal backdrops |
| `--color-body-text` | `#1a1a1a` | Standard readable editorial body copy |
| `--color-muted` | `#8a8a8a` | Captions, dates, secondary metadata, borders |
| `--color-light-gray` | `#f6f6f6` | Section alternating backgrounds, category badges |
| `--color-badge-bg` | `#ededed` | Floating badge cards, button hover fills |
| `--color-white` | `#ffffff` | Clean card surfaces, curtain animation masks |

### Property-Specific Brand Accent Colors
Applied dynamically via body themes (`body.theme-{property-name}`):

```css
/* Core Property Color Theme Definitions */
body.theme-kasbah-tamadot     { --brand-color: #B83C25; } /* Moroccan Terracotta / Burnt Sienna */
body.theme-mahali             { --brand-color: #BA5F27; } /* Maasai Savannah Ochre / Warm Spice */
body.theme-mont-rochelle      { --brand-color: #8A8F64; } /* Franschhoek Olive / Vineyard Sage */
body.theme-ulusaba            { --brand-color: #7C6119; } /* Sabi Sand Golden Amber / Safari Earth */
body.theme-finch-hattons      { --brand-color: #4A4238; } /* Tsavo Vintage Khaki & Leather */
body.theme-necker-island      { --brand-color: #00B3D2; } /* Caribbean Barrier Reef Cyan / Azure */
body.theme-moskito-island     { --brand-color: #2CB2A5; } /* Moskito Island Lagoon Teal / Turquoise */
body.theme-son-bunyola        { --brand-color: #5F7361; } /* Mallorca Tramuntana Mountain Pine */
body.theme-the-lodge          { --brand-color: #365D9D; } /* Swiss Alpine Glacier Dusk / Cobalt */
```

---

## 3. Typography System & Font Styles

Served via Adobe Typekit (`https://use.typekit.net/lih7vef.css`).

### 3.1 Primary Editorial Display Serif: `miller-banner`
- **Family**: `"miller-banner", Georgia, "Times New Roman", serif`
- **Characteristics**: High stroke contrast, sharp serifs, elegant vertical stress, conveying heritage, exclusivity, and bespoke craftsmanship.
- **Available Weights**: 300 (Light), 300 Italic, 400 (Regular), 700 (Bold), 800 (Extra Bold).

| Component Selector | Font Weight | Font Size | Line Height | Margin / Spacing |
|---|---|---|---|---|
| `.intro--default h1` | Bold (`700`) | `45px` | `50px` | `margin-bottom: 13px; letter-spacing: -0.5px;` |
| `.intro--big-text h1` | Light (`300`) | `24px` | `35px` | `margin: 0; font-style: normal;` |
| `.offers__item-content h2` | Bold (`700`) | `28px` | `32px` | `margin-bottom: 16px;` |
| `.key-offer__content h2` | Bold (`700`) | `28px` | `32px` | `margin-bottom: 12px;` |
| `.header__booking-cta` | Heavy (`900`) | `30px` | `1.0` | `cursor: pointer; color: #0f0f0f;` |
| `.header__property-logo a`| Bold (`700`) | `16px` | `1.2` | `letter-spacing: 0.5px; text-transform: uppercase;` |

### 3.2 Primary Interface Sans-Serif: `aktiv-grotesk`
- **Family**: `"aktiv-grotesk", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif`
- **Characteristics**: Modern neo-grotesque with balanced geometry, high x-height, and neutral precision.
- **Available Weights**: 300 (Light), 400 (Regular), 500 (Medium), 700 (Bold), 900 (Black).

| Component Selector | Font Weight | Font Size | Line Height | Transform / Tracking |
|---|---|---|---|---|
| `body, p` | Regular (`400`) | `14px` | `24px` | Normal tracking, high readability |
| `.intro--default h2` | Bold (`700`) | `14px` | `22px` | `margin-bottom: 22px; text-transform: uppercase;` |
| `.intro--title-left h2` | Medium (`500`) | `20px` | `30px` | Editorial intro lead paragraph |
| `.offers__badge` | Medium (`500`) | `9px` | `1.0` | `text-transform: uppercase; letter-spacing: 1.5px;` |
| `.button, .nav__link` | Bold (`700`) | `12px` | `1.2` | `text-transform: uppercase; letter-spacing: 1.2px;` |

---

## 4. Animations & Micro-Interactions

### 4.1 The "Curtain Reveal" Effect
The signature animation across all property pages and gallery reveals.

```css
/* 1. Mask element overlay */
.curtain {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 500;
  width: 100%;
  height: 100%;
  background-color: #ffffff;
  transform-origin: left center;
  pointer-events: none;
}

.curtain--right {
  transform-origin: right center;
}

/* 2. Left Curtain Sliding Out */
@keyframes animate-image-left-curtain {
  0% {
    transform: translateX(0%);
  }
  100% {
    transform: translateX(-110%);
  }
}

/* 3. Right Curtain Sliding Out */
@keyframes animate-image-right-curtain {
  0% {
    transform: translateX(0%);
  }
  100% {
    transform: translateX(110%);
  }
}

/* 4. Underlying Image Unveil & Subtle Zoom-Out */
@keyframes animate-image-reveal {
  0%, 51.9% {
    opacity: 0;
    transform: scale(1.08);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

/* 5. Applied on In-View State */
.in-view .curtain {
  animation: animate-image-left-curtain 0.9s cubic-bezier(0.77, 0, 0.175, 1) forwards;
}

.in-view img {
  animation: animate-image-reveal 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
```

### 4.2 Hover State Physics
- **Card Imagery**: Hovering over property cards applies a smooth `transform: scale(1.03);` with `transition: transform 0.6s cubic-bezier(0.25, 1, 0.5, 1);`.
- **Buttons**: Secondary outline buttons fill with `--brand-color` and shift text color to `#ffffff` over `0.25s ease-in-out`.
- **Editorial Hyperlinks**: Subtle animated bottom borders expand from `width: 0%` to `width: 100%` on hover.

---

## 5. Scrolling Effects & Interactivity

### 5.1 IntersectionObserver Viewport Triggers
- Images and content blocks are assigned the observer trigger:
  ```javascript
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });
  ```

### 5.2 Header Dynamic Shrink & Pinning
- **Top State**: Transparent background, `padding: 24px 0`, large logo (`120px` width), bold booking call-to-action.
- **Scrolled State (`.header--scrolled`)**: Triggered at `window.scrollY > 80px`.
  - Background transitions smoothly to `#ffffff` with a subtle box-shadow: `0 2px 14px rgba(0, 0, 0, 0.08)`.
  - Padding compresses to `12px 0`.
  - Logo scales down by 15%.

### 5.3 Subtle Parallax Scrolling
- Split hero imagery utilizes subtle translate offsets based on scroll progress:
  `transform: translateY(calc(var(--scroll-offset) * 0.12px));`
- Creates a 3D layer separation between the foreground serif typography and background landscape photography.

---

## 6. Layout Architecture & Grid Systems

### 6.1 Foundation 6 Grid Implementation
The responsive foundation is built upon Foundation Sites 6:
- **Max Container Width**: `1440px` (standard desktop) / `1600px` (wide displays).
- **Column System**: 12 responsive fluid columns (`.grid-x`, `.cell`).
- **Gutters**: `30px` (desktop), `20px` (tablet), `16px` (mobile).

### 6.2 FlexMasonry Staggered Gallery
Used on `/gallery/` (`FlexMasonry v0.2.3`):
- **Desktop (>=1024px)**: 3 columns (`large-4`).
- **Tablet (640px - 1023px)**: 2 columns (`medium-6`).
- **Mobile (<640px)**: 1 column (`small-12`).
- **Behavior**: Images are stacked dynamically without forced row heights, preventing white gaps when mixing portrait and landscape orientations.

### 6.3 Asymmetric Hero Split Layout (`.intro--title-left`)
- **Left Column (`38%` width)**: Displays the `h1` serif headline, property location eyebrow, and concise intro narrative.
- **Right Column (`62%` width)**: High-resolution portrait/landscape master photo equipped with the curtain reveal effect.

---

## 7. Image Placement Strategy & Aspect Ratios

| Layout Location | Aspect Ratio | Placement Technique | Narrative Purpose |
|---|---|---|---|
| **Homepage Hero Banner** | `16:9` / `21:9` | Edge-to-edge full bleed with central video modal trigger | Instant cinematic immersion into the retreat world |
| **Regional Destination Cards** | `1:1` Square | 3-column grid (`Africa`, `Caribbean`, `Europe`) with rounded circular masks or clean squared cards | Quick geographical navigation |
| **Editorial Story Sections** | `4:5` Portrait | Asymmetrically right-aligned, overlapping text container | Evokes high-end travel print magazine spreads |
| **Gallery Masonry** | Alternating `3:2` & `4:5` | FlexMasonry fluid columns with hover metadata overlays | Showcases diverse guest perspectives (suites, wildlife, dining) |
| **Floating Badges** | Variable pill | `position: absolute; top: 0; left: 18px;` | Highlights key inclusions (e.g. "ALL-INCLUSIVE", "MICHELIN STARRED") |

---

## 8. Summary of Extracted Assets in This Directory

- **Extracted Master High-Resolution Photos**: 228 images (~500 MB) categorized by Region & Property.
- **Extracted 4K/HD Hero Videos**: 10 official cinematic videos (Africa, Caribbean, Europe, Brand Showreel).
- **Design Tokens File**: [`extracted_tokens.json`](./extracted_tokens.json)
- **Live Interactive Showcase**: [`interactive_style_guide.html`](./interactive_style_guide.html)
