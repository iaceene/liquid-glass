# Task: Initialize a Reusable React UI Component Library

Act as a senior frontend engineer and UI library architect. I want you to initialize a production-ready, reusable React component library inspired by shadcn/ui.

## 1. Project goals

Build a standalone UI component library using React and TypeScript.

The library should:
- Be reusable across different React applications.
- Support Vite and Next.js projects.
- Have a consistent design system.
- Provide accessible and customizable components.
- Include interactive component documentation.
- Eventually be publishable as an npm package.

Do not build the entire component collection yet. Focus on creating the project architecture and development infrastructure.

## 2. Technology stack

Use:

- React
- TypeScript (strict mode)
- Vite
- Tailwind CSS
- Storybook for component development and documentation
- Vitest for unit testing
- React Testing Library for component testing
- Playwright for browser-level testing
- Changesets for package versioning
- Lucide React for icons

Choose compatible, stable versions of dependencies.

## 3. Project architecture

Create a clean and scalable architecture:

```text
my-ui/
├── .storybook/
│   ├── main.ts
│   └── preview.ts
│
├── src/
│   ├── components/
│   │   ├── button/
│   │   │   ├── button.tsx
│   │   │   ├── button.stories.tsx
│   │   │   ├── button.test.tsx
│   │   │   └── index.ts
│   │   └── index.ts
│   │
│   ├── hooks/
│   ├── lib/
│   ├── styles/
│   │   └── globals.css
│   ├── types/
│   └── index.ts
│
├── tests/
├── .changeset/
├── package.json
├── tsconfig.json
├── vite.config.ts
├── vitest.config.ts
├── tailwind.config.ts
├── README.md
└── .gitignore
```

Adapt the configuration to the actual versions and tooling rather than creating obsolete configuration files.

## 4. Design system foundations

Prepare a centralized design system using CSS variables.

Include tokens for:

- Primary and secondary colors
- Background and foreground
- Muted colors
- Destructive colors
- Border colors
- Focus rings
- Border radius
- Typography
- Spacing
- Shadows

Support light and dark themes.

Make the design tokens customizable by consuming applications.

## 5. Component architecture

Establish conventions for creating components.

Every component should:
- Be written in TypeScript.
- Have properly typed props.
- Support className customization.
- Support native HTML attributes where appropriate.
- Be accessible.
- Have a consistent API.
- Be independently exportable.
- Include a Storybook story.
- Include relevant tests.

Use composition where appropriate.

Avoid unnecessary abstractions and dependencies.

Do not tightly couple components to a specific application.

## 6. Initial component

Create only one initial component: Button.

It should support:

Variants:
- default
- secondary
- destructive
- outline
- ghost
- link

Sizes:
- sm
- default
- lg
- icon

Additional features:
- Disabled state
- Loading state
- Custom className
- Native button attributes
- Keyboard accessibility

Create:
- button.tsx
- button.stories.tsx
- button.test.tsx
- index.ts

Use a clean implementation inspired by shadcn/ui conventions without copying its entire implementation.

## 7. Storybook configuration

Configure Storybook to:

- Discover component stories automatically.
- Support React and TypeScript.
- Support Tailwind CSS styles.
- Include autodocs.
- Provide interactive Controls.
- Include light and dark theme previews.
- Provide a clean component navigation structure.

Create stories covering all Button variants, sizes and important states.

## 8. Testing infrastructure

Configure Vitest and React Testing Library.

Add initial tests for:
- Button rendering.
- Variants.
- Sizes.
- Disabled behavior.
- Loading behavior.
- Click interactions.

Configure Playwright for future browser testing, but don't create unnecessary E2E tests yet.

## 9. npm package preparation

Prepare the project for publishing.

Requirements:
- Configure package.json correctly.
- Use Vite library mode or an appropriate library bundler.
- Generate ESM and CommonJS outputs where appropriate.
- Generate TypeScript declaration files.
- Configure React and React DOM as peer dependencies.
- Avoid bundling React into the library.
- Configure package exports.
- Ensure CSS can be consumed by external projects.
- Add Changesets configuration.

Include scripts for:
- dev
- build
- typecheck
- lint
- test
- test:watch
- storybook
- build-storybook

## 10. Documentation

Create a README.md explaining:

- What the library is.
- Technology stack.
- Installation.
- Development setup.
- How to run Storybook.
- How to run tests.
- How to build the package.
- How to create a new component.
- How to import components into another React project.

## 11. Engineering rules

Important:

1. Inspect the current directory before making changes.
2. Do not overwrite existing user files without checking them.
3. Use clean, maintainable code.
4. Avoid unnecessary dependencies.
5. Use TypeScript strict mode.
6. Avoid `any` unless absolutely necessary.
7. Ensure all scripts actually work.
8. Do not leave placeholder configurations or broken imports.
9. Keep components independent and reusable.
10. Do not implement all planned components yet.

## 12. Final verification

After initialization:

1. Install all dependencies.
2. Run TypeScript checks.
3. Run unit tests.
4. Run the production build.
5. Run Storybook build.
6. Fix any errors you encounter.

At the end, provide:
- Final project structure.
- Installed dependencies.
- Available npm scripts.
- Commands to start development.
- Any architectural decisions or limitations.

**Expected result:** A fully initialized, working React + TypeScript UI component library with Storybook, testing infrastructure, design tokens, and a single production-ready Button component.