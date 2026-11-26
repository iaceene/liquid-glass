# @liquid-glass/ui · Nimbus UI

A modern, production-ready React component library crafted in the **Nimbus liquid-glass & Frutiger Aero water aesthetic**.

Frosted glass surfaces with physical backdrop blur, real-time WebGL water shaders, spring-physics droplet shedding, fluid surface ripples, living pointer menisci, and full keyboard & screen reader accessibility.

[View Full Component Reference & API Documentation (docs/COMPONENTS.md)](docs/COMPONENTS.md)

---

## Component Suite

| Category | Components |
|---|---|
| **Forms & Inputs** | `LiquidButton`, `LiquidInput`, `LiquidTextarea`, `LiquidCheckbox`, `LiquidSwitch` (`LiquidToggle`), `LiquidLabel`, `LiquidForm` |
| **Navigation** | `LiquidNavbar`, `LiquidTabs` |
| **Feedback & Status** | `LiquidToast` (`Toaster`, `toast()`), `LiquidAlert` |
| **Overlays & Dialogs** | `LiquidDialog`, `LiquidDropdownMenu`, `LiquidTooltip`, `LiquidPopover` |
| **Data Display** | `LiquidCard`, `LiquidAccordion`, `LiquidBadge`, `LiquidAvatar`, `LiquidSeparator`, `LiquidSkeleton` |
| **Application Flows** | `LiquidAuth` (`AuthCard`, Unified Sign In & Sign Up + OAuth), `LiquidCheckout` (`WaterCard`) |

---

## Key Features

- 💧 **Live Water Engine**: WebGL fragment shaders for caustics, dual specular highlights, fresnel iridescence, and surface tension.
- 🌊 **Spring Droplet Physics**: Leaping satellite droplets, neck-breaking tension snaps, and wave interference ripples.
- 🎨 **Rich Themes & Color Palettes**: `tone="light" | "dark"` across all components, plus `emerald`, `amber`, `violet`, `rose`, `cyan`, `sky`, `deep` palettes.
- 🔔 **Imperative Toast System**: `toast.success()`, `toast.error()`, `toast.info()`, `toast.warning()`, and `<LiquidToaster />` viewport.
- 🎭 **Micro-Animation Scenes**: Dynamic icon animation scenes (`pop`, `plane`, `drop`, `spin`, `glow`, `wave`).
- 🔊 **Synthesized Web Audio**: Frequency-swept water "plip" sound effects with zero external audio assets.
- ♿ **Strict Accessibility**: Semantic markup, ARIA live regions/roles, roving tabindex, visible focus rings, and `prefers-reduced-motion` compliance.
- ⚡ **Zero External Animation Dependencies**: Self-contained React implementations with CSS fallbacks when WebGL is unavailable.

---

## Quickstart & Usage

### 1. Triggering Toasts Imperatively
```tsx
import { LiquidToaster, toast, LiquidButton } from '@liquid-glass/ui';

export function ToastDemo() {
  return (
    <div>
      <LiquidButton
        variant="primary"
        onClick={() => toast.success("Payment Received", {
          description: "Transferred 1.25 ETH with 0.001% slippage.",
          duration: 4000,
        })}
      >
        Trigger Toast
      </LiquidButton>

      {/* Mount once in layout */}
      <LiquidToaster position="bottom-right" tone="light" />
    </div>
  );
}
```

### 2. Segmented Liquid Tabs with Icon Scenes
```tsx
import { LiquidTabs, NimbusTabIcons } from '@liquid-glass/ui';

export function NavigationTabs() {
  return (
    <LiquidTabs
      defaultValue="overview"
      variant="emerald"
      items={[
        { value: "overview", label: "Overview", icon: NimbusTabIcons.overview, fx: "glow", badge: "Live" },
        { value: "activity", label: "Activity", icon: NimbusTabIcons.activity, fx: "wave", badge: "12" },
        { value: "code", label: "Code", icon: NimbusTabIcons.code, fx: "spin" },
        { value: "settings", label: "Settings", icon: NimbusTabIcons.settings, fx: "pop" },
      ]}
    />
  );
}
```

---

## Technology Stack

- **Runtime & Package Manager**: [Bun](https://bun.sh/)
- **Core**: React 18+ & TypeScript (Strict Mode)
- **Styling**: Tailwind CSS, PostCSS, Autoprefixer
- **Variants & Class Merging**: `class-variance-authority`, `clsx`, `tailwind-merge`
- **Icons**: `lucide-react`
- **Documentation**: Storybook 8 (Vite Framework)
- **Unit & Component Testing**: Vitest, React Testing Library, `@testing-library/jest-dom`
- **Browser Testing**: Playwright
- **Bundler**: Vite (Library Mode) + `vite-plugin-dts`
- **Versioning**: Changesets

---

## Project Architecture

```text
liquid-glass/
├── .changeset/           # Changesets configuration
├── .storybook/           # Storybook configuration & decorators
│   ├── main.ts
│   └── preview.ts
├── src/
│   ├── components/       # UI components
│   │   ├── button/
│   │   │   ├── button.tsx         # Component implementation
│   │   │   ├── button.stories.tsx # Storybook stories & autodocs
│   │   │   ├── button.test.tsx    # Vitest component tests
│   │   │   └── index.ts           # Button module export
│   │   └── index.ts      # Components barrel export
│   ├── hooks/            # Custom reusable hooks
│   ├── lib/              # Utility helpers (cn, etc.)
│   ├── styles/
│   │   └── globals.css   # Centralized design tokens & CSS variables
│   ├── types/            # Shared TypeScript types
│   └── index.ts          # Library entry point
├── tests/
│   ├── setup.ts          # Vitest testing setup
│   └── e2e/              # Playwright test specifications
├── package.json
├── tsconfig.json
├── vite.config.ts
├── vitest.config.ts
├── playwright.config.ts
├── tailwind.config.ts
└── README.md
```

---

## Installation

Install `@liquid-glass/ui` along with its peer dependencies:

```bash
# Using Bun
bun add @liquid-glass/ui react react-dom

# Using npm
npm install @liquid-glass/ui react react-dom

# Using pnpm
pnpm add @liquid-glass/ui react react-dom
```

---

## Usage in React Projects (Vite or Next.js)

### 1. Import Styles

Import the library CSS in your root file (e.g., `main.tsx` in Vite or `app/layout.tsx` in Next.js):

```tsx
import '@liquid-glass/ui/styles.css';
```

### 2. Using Components

```tsx
import { Button } from '@liquid-glass/ui';
import { Mail } from 'lucide-react';

export default function App() {
  return (
    <div className="flex gap-4 p-8">
      {/* Default variant */}
      <Button variant="default" size="default">
        Click Me
      </Button>

      {/* Loading state with spinner */}
      <Button variant="secondary" loading loadingText="Saving...">
        Save
      </Button>

      {/* With icon */}
      <Button variant="outline">
        <Mail className="mr-2 h-4 w-4" /> Login with Email
      </Button>

      {/* Destructive variant */}
      <Button variant="destructive">
        Delete
      </Button>
    </div>
  );
}
```

---

## Design System Tokens & Theming

The design system uses HSL CSS variables configured in `src/styles/globals.css`.

### Tokens Available:
- **Background & Foreground**: `--background`, `--foreground`
- **Primary & Secondary**: `--primary`, `--primary-foreground`, `--secondary`, `--secondary-foreground`
- **Muted**: `--muted`, `--muted-foreground`
- **Destructive**: `--destructive`, `--destructive-foreground`
- **Card & Popover**: `--card`, `--popover`
- **Border & Focus Ring**: `--border`, `--ring`
- **Border Radius**: `--radius`
- **Shadows**: `--shadow-subtle`, `--shadow-elevated`
- **Typography**: `--font-sans`, `--font-mono`

### Switching Themes:
Add the `dark` class (or `data-theme="dark"` attribute) to your `<html>` or container element:

```html
<html class="dark">
  ...
</html>
```

Consuming applications can customize any color or token simply by overriding the CSS variables in their own stylesheets.

---

## Button Component API

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `variant` | `'default' \| 'secondary' \| 'destructive' \| 'outline' \| 'ghost' \| 'link'` | `'default'` | Visual style variant |
| `size` | `'sm' \| 'default' \| 'lg' \| 'icon'` | `'default'` | Size preset |
| `loading` | `boolean` | `false` | Displays spinning indicator and disables interactions |
| `loadingText` | `ReactNode` | `undefined` | Custom label while in loading state |
| `disabled` | `boolean` | `false` | Disables button and prevents pointer events |
| `className` | `string` | `undefined` | Custom Tailwind CSS class names (merged with `cn`) |
| `...props` | `ButtonHTMLAttributes` | - | Standard HTML button attributes (`onClick`, `type`, etc.) |

---

## Development Setup

### 1. Install Dependencies

```bash
bun install
```

### 2. Run TypeScript Verification

```bash
bun run typecheck
```

### 3. Run Linting

```bash
bun run lint
```

### 4. Run Unit & Component Tests

```bash
# Run tests once
bun run test

# Run tests in watch mode
bun run test:watch
```

### 5. Run Browser E2E Tests (Playwright)

```bash
bun run test:e2e
```

### 6. Run Storybook Development Server

```bash
bun run storybook
```
Open `http://localhost:6006` in your browser to interact with components, test variants, and toggle light/dark themes.

### 7. Build Storybook Static Site

```bash
bun run build-storybook
```

### 8. Build Component Library (Production)

```bash
bun run build
```
This produces:
- `dist/index.js` (ES Module bundle)
- `dist/index.cjs` (CommonJS bundle)
- `dist/index.d.ts` (TypeScript declarations)
- `dist/styles.css` (Tailwind CSS stylesheet)

---

## How to Create a New Component

Follow these steps to maintain architectural consistency:

1. **Create the component directory**:
   ```bash
   mkdir -p src/components/badge
   ```

2. **Implement the component** (`src/components/badge/badge.tsx`):
   - Define variants using `class-variance-authority` (`cva`).
   - Define `BadgeProps` extending HTML attributes and `VariantProps`.
   - Forward refs with `React.forwardRef`.
   - Merge class names with `cn(...)`.

3. **Export the component** (`src/components/badge/index.ts`):
   ```ts
   export { Badge, badgeVariants, type BadgeProps } from './badge';
   ```

4. **Add Unit Tests** (`src/components/badge/badge.test.tsx`):
   - Test rendering, variants, custom classes, and user interactions.

5. **Add Storybook Stories** (`src/components/badge/badge.stories.tsx`):
   - Set `tags: ['autodocs']`.
   - Provide interactive args and stories for all variants.

6. **Export in barrel** (`src/components/index.ts`):
   ```ts
   export * from './button';
   export * from './badge';
   ```

---

## Versioning & Releases (Changesets)

Generate a new changeset when making modifications:

```bash
bun run changeset
```

Follow the interactive prompts to define release bump level (major/minor/patch) and changelog summary.
