# Copilot instructions

## Commands

- Install dependencies with `npm install`.
- Start the Expo dev server with `npm run start`.
- Launch a target from Expo with `npm run android`, `npm run ios`, or `npm run web`.
- Run lint with `npm run lint`. This currently shells into `expo lint`, which prompts to create an ESLint config because no config is committed yet.
- There is no test script or test directory configured right now, so there is no single-test command to run.
- There is no build or release script in `package.json`.

## High-level architecture

- This is an Expo Router app. `package.json` uses `expo-router/entry`, and route files live under `src/app` instead of the default root-level `app` directory.
- `src/app/_layout.tsx` is the app shell. It loads the custom `Changa One Regular` font from `assets/font`, keeps the splash screen visible until fonts load, hides the Android navigation bar, and renders a headerless router `Stack`.
- `src/app/index.tsx` is the current home screen route. It owns the top-level weather state and composes the page from `WeatherBackground`, `MainContent`, and `BottomNavigation`.
- `src/components/MainContent.tsx` assembles the main HUD from `Header`, `CharacterInfo`, and `CharacterDisplay`.
- The current app is a single-screen UI scaffold for the Runagotchi concept: most displayed values are still hardcoded in presentational components, while visuals come from local image and GIF assets under `assets/images`.

## Key conventions

- Read the Expo 55 docs at <https://docs.expo.dev/versions/v55.0.0/> before changing app code. This repository explicitly documents that requirement in `README.md`, `CLAUDE.md`, and `AGENTS.md`.
- Use the TypeScript path aliases from `tsconfig.json`: `@/*` maps to `src/*`, and `@/assets/*` maps to `assets/*`. Prefer alias imports over deep relative paths.
- Keep route files under `src/app` and preserve the Expo Router setup in `_layout.tsx`; app-wide providers, startup hooks, and navigation shell changes belong there.
- Use `AppText` for user-facing text so the custom font is applied consistently across the UI.
- UI components are tightly coupled to pixel-art assets and manual layout tuning (`StyleSheet.create`, fixed image sizes, text shadows, and absolute positioning). Preserve those visual assumptions when refactoring.
- `WeatherBackground` uses a typed weather union and an asset map. When adding a weather mode, update both the union type and the `weatherImages` mapping together.
- Treat `Header`, `CharacterInfo`, `CharacterDisplay`, and `BottomNavigation` as presentational building blocks. Introduce shared state deliberately instead of smuggling app logic into multiple leaf components.
