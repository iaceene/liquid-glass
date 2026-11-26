# Nimbus UI — Liquid Glass Component Reference

A modern library of self-contained React UI components styled in the **Nimbus UI liquid-glass & Frutiger Aero water aesthetic**:
frosted glass surfaces with real backdrop blur, WebGL-powered water shaders, spring-physics droplet shedding, fluid ripples, living pointer menisci, and full keyboard and screen reader accessibility.

---

## Component Index

### Core & Form Controls (Phase 1)
- [LiquidButton](#liquidbutton) (`Button`)
- [LiquidInput](#liquidinput) (`Input`)
- [LiquidLabel](#liquidlabel) (`Label`)
- [LiquidTextarea](#liquidtextarea) (`Textarea`)
- [LiquidCard](#liquidcard) (`Card`)
- [LiquidBadge](#liquidbadge) (`Badge`)
- [LiquidAvatar](#liquidavatar) (`Avatar`)
- [LiquidSeparator](#liquidseparator) (`Separator`)
- [LiquidSkeleton](#liquidskeleton) (`Skeleton`)
- [LiquidToggle](#liquidtoggle) / [LiquidSwitch](#liquidswitch) (`Switch`)

### Interaction, Navigation & Feedback (Phase 2)
- [LiquidNavbar](#liquidnavbar) (`Navbar`)
- [LiquidTabs](#liquidtabs) (`Tabs`)
- [LiquidDialog](#liquiddialog) (`Dialog`)
- [LiquidDropdownMenu](#liquiddropdownmenu) (`DropdownMenu`)
- [LiquidTooltip](#liquidtooltip) (`Tooltip`)
- [LiquidPopover](#liquidpopover) (`Popover`)
- [LiquidAccordion](#liquidaccordion) (`Accordion`)
- [LiquidToast & Toaster](#liquidtoast--liquidtoaster) (`Toast`, `Toaster`, `toast()`, `useToast()`)
- [LiquidAlert](#liquidalert) (`Alert`)
- [LiquidCheckbox](#liquidcheckbox) (`Checkbox`)
- [LiquidAuth](#liquidauth) (`AuthCard`, Sign In & Sign Up)
- [LiquidCheckout](#liquidcheckout) (`Checkout`, `WaterCard`)

---

## Theming & Color Palettes

All components support dynamic theming via the `tone` and `variant` props:

### 1. Base Tones & Dark Themes
- `tone="light"`: Crystal-clear daylight glass with sunlit highlights and deep slate typography (`#0B132B`).
- `tone="dark"`: Deep navy obsidian glass with cyan water reflections and icy typography (`#F1F7FF`).
- `tone="midnight"`: Pure abyss onyx glass (`rgba(4, 7, 16, .68)`) with electric cyan rim reflections and stark white typography.
- `tone="aurora"`: Northern lights emerald-violet bioluminescence (`rgba(12, 28, 42, .62)`).
- `tone="sunset"`: Warm radiant amber honey glass (`rgba(38, 18, 8, .6)`) with golden highlights.
- `tone="rose"`: Translucent quartz blush glass (`rgba(40, 12, 28, .6)`) with rose gold rim and magenta caustics.
- `tone="emerald"`: Deep aquatic lagoon glass (`rgba(6, 32, 24, .62)`) with mint and seafoam luminescence.

### 2. Color Palettes & Variants
- **Tabs Variants**: `default` (Azure), `emerald` (Aquamarine), `amber` (Sunstone), `violet` (Amethyst), `rose` (Sunset), `cyan` (Turquoise).
- **Button Variants**: `primary`, `secondary`, `ghost`, `glass`, `destructive`.
- **Card Palettes**: `sky`, `glass`, `deep`, `amber`, `emerald`, `rose`.
- **Badge Variants**: `default`, `primary`, `secondary`, `success`, `warning`, `danger`, `outline`.
- **Toast & Alert Variants**: `default`, `info`, `success`, `warning`, `error` / `destructive`.

---

## Detailed Component Documentation

### LiquidToast & LiquidToaster
Luminous floating notification banners with liquid entry/exit spring physics, clean clutter-free design, living status droplet icons, action buttons, rich dark and color themes, and an imperative `toast()` manager.

#### Usage with `LiquidToaster` Viewport
Place `<LiquidToaster />` once near the root of your application (or in layout):
```tsx
import { LiquidToaster, toast } from "@liquid-glass/ui"

export function App() {
  return (
    <div>
      <main>
        {/* Triggering different themes */}
        <button onClick={() => toast.success("Payment Received", {
          description: "Transferred 1.25 ETH with 0.001% slippage.",
          tone: "midnight",
          duration: 4000,
        })}>
          Trigger Midnight Toast
        </button>

        <button onClick={() => toast({
          title: "Aurora Glow",
          description: "Northern lights theme activated.",
          tone: "aurora",
        })}>
          Trigger Aurora Toast
        </button>

        <button onClick={() => toast.warning("High Temperature", {
          description: "Ambient chamber thermal limits near maximum.",
          tone: "sunset",
        })}>
          Trigger Sunset Toast
        </button>
      </main>

      {/* Floating viewport container */}
      <LiquidToaster position="bottom-right" tone="midnight" />
    </div>
  )
}
```

#### Individual Component Usage
```tsx
import { LiquidToast } from "@liquid-glass/ui"

<LiquidToast
  tone="midnight"
  variant="warning"
  title="Surface Tension Alert"
  description="High salinity detected in basin."
  duration={5000}
  onDismiss={() => console.log("Dismissed")}
/>
```

#### Props
| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | `"default" \| "success" \| "warning" \| "error" \| "info"` | `"default"` | Accent color theme and status icon |
| `tone` | `"light" \| "dark" \| "midnight" \| "aurora" \| "sunset" \| "rose" \| "emerald"` | `"light"` | Base glass theme |
| `title` | `ReactNode` | — | Toast header title |
| `description` | `ReactNode` | — | Toast body text or details |
| `action` | `ReactNode` | — | Optional custom action button |
| `duration` | `number` | `5000` | Auto-dismiss timer duration in ms (0 to disable) |
| `onDismiss` | `() => void` | — | Callback fired when toast is dismissed |

---

### LiquidTabs
A liquid segmented navigation tray. The active tab drop stretches toward the selected tab with spring physics (`k=220`, `c=25`), sheds satellite droplets on long leaps, and lands with wave interference ripples. Features interactive mouse menisci, tap waves, and animated icon scenes.

#### Props-driven API
```tsx
import { LiquidTabs, NimbusTabIcons } from "@liquid-glass/ui"

<LiquidTabs
  defaultValue="overview"
  variant="emerald"
  items={[
    {
      value: "overview",
      label: "Overview",
      icon: NimbusTabIcons.overview,
      fx: "glow",
      badge: "Live",
      content: <div>Dashboard analytics</div>,
    },
    {
      value: "activity",
      label: "Activity",
      icon: NimbusTabIcons.activity,
      fx: "wave",
      badge: "8",
      content: <div>Activity feed</div>,
    },
    {
      value: "settings",
      label: "Settings",
      icon: NimbusTabIcons.settings,
      fx: "pop",
      content: <div>Settings panel</div>,
    },
  ]}
/>
```

#### Compound Component API
```tsx
import {
  LiquidTabs,
  LiquidTabsList,
  LiquidTabsTrigger,
  LiquidTabsContent,
  NimbusTabIcons,
} from "@liquid-glass/ui"

<LiquidTabs defaultValue="code" tone="dark">
  <LiquidTabsList>
    <LiquidTabsTrigger value="code" icon={NimbusTabIcons.code} fx="spin">Code</LiquidTabsTrigger>
    <LiquidTabsTrigger value="preview" icon={NimbusTabIcons.sparkles} fx="drop">Preview</LiquidTabsTrigger>
  </LiquidTabsList>
  <LiquidTabsContent value="code">Source view</LiquidTabsContent>
  <LiquidTabsContent value="preview">Live canvas</LiquidTabsContent>
</LiquidTabs>
```

#### Icon Animation Scenes (`fx`)
- `"pop"`: Playful bounce with squash & stretch keyframes.
- `"plane"`: Sweeping 3D arc leaving a glowing vapor condensation trail.
- `"drop"`: Leaps upward and squashes on landing, kicking up splash droplets on left and right.
- `"spin"`: 3D perspective spin around the Y axis (`perspective(80px)`).
- `"glow"`: Upward hop with glowing illumination.
- `"wave"`: Fluid pendulum wave.

---

### LiquidDialog
Frosted glass modal chamber with backdrop blur, focus trapping, Escape key dismissal, click-outside dismissal, water droplet close button, and accessible dialog ARIA attributes.

```tsx
import {
  LiquidDialog,
  LiquidDialogTrigger,
  LiquidDialogContent,
  LiquidDialogHeader,
  LiquidDialogTitle,
  LiquidDialogDescription,
  LiquidDialogFooter,
  LiquidDialogClose,
  LiquidButton,
} from "@liquid-glass/ui"

<LiquidDialog>
  <LiquidDialogTrigger asChild>
    <LiquidButton variant="primary">Open Chamber</LiquidButton>
  </LiquidDialogTrigger>
  <LiquidDialogContent>
    <LiquidDialogHeader>
      <LiquidDialogTitle>Glass Chamber</LiquidDialogTitle>
      <LiquidDialogDescription>
        A tranquil floating modal cast from frosted glass and surface tension.
      </LiquidDialogDescription>
    </LiquidDialogHeader>
    <p>Modal body content...</p>
    <LiquidDialogFooter>
      <LiquidDialogClose asChild>
        <LiquidButton variant="ghost">Cancel</LiquidButton>
      </LiquidDialogClose>
      <LiquidButton variant="primary">Confirm</LiquidButton>
    </LiquidDialogFooter>
  </LiquidDialogContent>
</LiquidDialog>
```

---

### LiquidDropdownMenu
Cascading glass menu with an active water pool that glides across items, keyboard navigation (`ArrowUp`, `ArrowDown`, `Home`, `End`, `Enter`, `Escape`), menu separators, item shortcuts, and labels.

```tsx
import {
  LiquidDropdownMenu,
  LiquidDropdownMenuTrigger,
  LiquidDropdownMenuContent,
  LiquidDropdownMenuItem,
  LiquidDropdownMenuSeparator,
  LiquidDropdownMenuLabel,
  LiquidButton,
} from "@liquid-glass/ui"

<LiquidDropdownMenu>
  <LiquidDropdownMenuTrigger asChild>
    <LiquidButton variant="primary">Options</LiquidButton>
  </LiquidDropdownMenuTrigger>
  <LiquidDropdownMenuContent align="start">
    <LiquidDropdownMenuLabel>Actions</LiquidDropdownMenuLabel>
    <LiquidDropdownMenuItem shortcut="⌘S">Save State</LiquidDropdownMenuItem>
    <LiquidDropdownMenuItem shortcut="⌘D">Duplicate</LiquidDropdownMenuItem>
    <LiquidDropdownMenuSeparator />
    <LiquidDropdownMenuItem disabled>Archive</LiquidDropdownMenuItem>
  </LiquidDropdownMenuContent>
</LiquidDropdownMenu>
```

---

### LiquidTooltip
Floating liquid glass dewdrop with directional pointer arrow (`top`, `bottom`, `left`, `right`), configurable hover/focus delay, Escape dismissal, and accessible `role="tooltip"`.

```tsx
import { LiquidTooltip, LiquidButton } from "@liquid-glass/ui"

<LiquidTooltip content="Subsurface information" side="top">
  <LiquidButton variant="secondary">Hover me</LiquidButton>
</LiquidTooltip>
```

---

### LiquidPopover
Floating reservoir for richer interactive content with placement alignment (`start`, `center`, `end`), directional offset, click-outside dismissal, and keyboard support.

```tsx
import {
  LiquidPopover,
  LiquidPopoverTrigger,
  LiquidPopoverContent,
  LiquidPopoverClose,
  LiquidButton,
} from "@liquid-glass/ui"

<LiquidPopover>
  <LiquidPopoverTrigger asChild>
    <LiquidButton variant="primary">Reservoir Stats</LiquidButton>
  </LiquidPopoverTrigger>
  <LiquidPopoverContent side="bottom" align="start">
    <h4>Status</h4>
    <p>Salinity: 0.04% · Temp: 18.4°C</p>
    <LiquidPopoverClose asChild>
      <LiquidButton size="sm" variant="ghost">Close</LiquidButton>
    </LiquidPopoverClose>
  </LiquidPopoverContent>
</LiquidPopover>
```

---

### LiquidCheckbox
Glass reservoir basin that fills with blue water and checkmark droplet upon check, Space key toggle, sound effects, hidden input for form submissions, and `role="checkbox"`.

```tsx
import { LiquidCheckbox } from "@liquid-glass/ui"

<LiquidCheckbox
  defaultChecked
  sound
  onCheckedChange={(checked) => console.log("Checked:", checked)}
/>
```

---

### LiquidAlert
Glass callout banner with glowing beacon drop indicator, `AlertTitle`, `AlertDescription`, optional dismissal, and accessibility (`role="alert"`).

```tsx
import { LiquidAlert } from "@liquid-glass/ui"

<LiquidAlert variant="info" title="Water Level Normal" dismissible>
  The reservoir maintains standard equilibrium.
</LiquidAlert>
```

---

### LiquidAuth
A unified authentication card combining **Sign In** and **Sign Up** in a single living glass slab. Inspired by `LiquidAccordion` (liquid spring water pool tab indicator) and `LiquidCheckout` (3D perspective tilt, drop tracking focused inputs, fluid OAuth integrations for Google, GitHub, Apple, password strength water gauge, and liquid submit button filling with water and morphing into a checkmark).

Supports `tone="light" | "dark" | "midnight" | "aurora" | "sunset" | "rose" | "emerald"`.

```tsx
import { LiquidAuth } from "@liquid-glass/ui"

<LiquidAuth
  tone="midnight"
  sound
  tilt
  onLogin={async (credentials) => {
    console.log("Signing in:", credentials)
  }}
  onSignUp={async (data) => {
    console.log("Signing up:", data)
  }}
  onOAuth={async (provider) => {
    console.log("OAuth provider clicked:", provider)
  }}
  onForgotPassword={() => {
    console.log("Forgot password clicked")
  }}
/>
```

