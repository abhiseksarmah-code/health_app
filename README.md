# Personal Fitness by Abhisek

A home workout and nutrition app for training with a resistance tube.

- **Plan** – a 7-day upper/lower split that trains every muscle group twice a week, with today's session highlighted.
- **Exercises** – 34 tube exercises by muscle group, each with an animated demo, setup, form cues, reps, and a link to video demos.
- **Nutrition** – log food from a built-in list of ~50 Indian, UAE and gym staples or your own entries, and see protein, carbs and fat against your daily targets. Take a photo of your meal and Claude identifies the foods and estimates the macros.

## Install on Android

1. Open the [latest release](../../releases/latest) on your phone.
2. Download **PersonalFitness.apk** and open it. Allow installs from your browser if Android asks.

Every push to `main` builds a new APK with GitHub Actions and publishes it as a release. New versions install over the old one and keep your food log.

## Photo recognition

The Android app sends meal photos to Claude with your own Anthropic API key. Add it under **Nutrition → Photo recognition setup**. The key is stored only on your phone. Without a key you can still log food by searching the list.

## Project layout

| Path | What it is |
|---|---|
| `src/app.html` | The app: markup, styles and logic |
| `src/anim.js` | Exercise animations (poses for each exercise, drawn on canvas) |
| `build.mjs` | Builds `www/index.html` (used by the Android app) |
| `capacitor.config.json` | Android wrapper settings |
| `.github/workflows/android.yml` | Builds the APK and publishes the release |
| `signing/debug.keystore` | Signing key so each new APK installs as an update |

Build locally with `npm install && npm run build`, then `npx cap add android && npx cap sync android` and open the `android` folder in Android Studio.
