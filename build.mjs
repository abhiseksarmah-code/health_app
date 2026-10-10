// Builds the app from src/ into:
//   www/index.html      – standalone page used by the Android app (Capacitor)
//   dist/artifact.html  – the same page in claude.ai artifact form
//   photos/ is copied next to both
import { readFileSync, writeFileSync, mkdirSync, cpSync } from "node:fs";

const page = readFileSync("src/app.html", "utf8");
// exercise photos (public domain, from free-exercise-db) ship next to the page
for (const out of ["dist/photos", "www/photos"]) cpSync("src/photos", out, { recursive: true, filter: f => !f.endsWith(".json") });

mkdirSync("dist", { recursive: true });
writeFileSync("dist/artifact.html", page);

// Standalone: move <title>, font links and <style> into <head>, add the small reset claude.ai normally provides.
const split = page.indexOf('<div class="wrap">');
const head = page.slice(0, split);
const body = page.slice(split);
const standalone = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="theme-color" content="#F2F3F1" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#111315" media="(prefers-color-scheme: dark)">
<style>:root{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}body{margin:0;font-size:14px}img{max-width:100%}[hidden]{display:none!important}</style>
${head}</head>
<body>
${body}
</body>
</html>
`;
mkdirSync("www", { recursive: true });
writeFileSync("www/index.html", standalone);
console.log("Built www/index.html and dist/artifact.html");
