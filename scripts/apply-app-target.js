#!/usr/bin/env node
// Patches the ONE checked-in android/ and ios/ native project so it builds
// as either the "patient" app or the "provider" app (nurses/pharmacists/
// doctors/admin staff) — two separate installable apps from one codebase.
//
// Capacitor's own appId/appName in capacitor.config.ts only seed a native
// project at `cap add` time; they don't retroactively rewrite an existing
// project's applicationId/bundle id. So switching targets means patching
// those native identity files directly, which is what this script does.
// Run it before `cap sync` whenever you switch which app you're building —
// see the sync:patient / sync:provider scripts in package.json.
//
// This keeps a single native project that gets re-identified per build,
// rather than maintaining two full duplicate native project trees. That's
// fine pre-launch, but before shipping both apps to the stores in parallel
// you'll likely want to split into two real native project directories so
// both can be built/signed at the same time without re-running this script.
const fs = require("fs");
const path = require("path");

const TARGET = process.argv[2];
const IDENTITY = {
  patient: { appId: "com.mendyr.patient", appName: "Mendyr" },
  provider: { appId: "com.mendyr.provider", appName: "Mendyr Pro" },
};

if (!IDENTITY[TARGET]) {
  console.error(`Usage: node scripts/apply-app-target.js <patient|provider>`);
  process.exit(1);
}

const { appId, appName } = IDENTITY[TARGET];
const root = path.join(__dirname, "..");

function replaceInFile(relPath, replacements) {
  const filePath = path.join(root, relPath);
  if (!fs.existsSync(filePath)) {
    console.warn(`skip (not found): ${relPath}`);
    return;
  }
  let contents = fs.readFileSync(filePath, "utf8");
  for (const [pattern, replacement] of replacements) {
    contents = contents.replace(pattern, replacement);
  }
  fs.writeFileSync(filePath, contents);
  console.log(`patched: ${relPath}`);
}

// ── Android ──────────────────────────────────────
// Only applicationId changes here — Gradle's `namespace` must match the
// actual Java package declared in MainActivity.java (still com.mendyr.app,
// see the note below), but applicationId is designed to differ from it:
// that's exactly how Android supports one Java package installing under a
// different, per-flavor package/bundle name.
replaceInFile("android/app/build.gradle", [
  [/applicationId\s+"[^"]+"/, `applicationId "${appId}"`],
]);

replaceInFile("android/app/src/main/res/values/strings.xml", [
  [/<string name="app_name">[^<]*<\/string>/, `<string name="app_name">${appName}</string>`],
  [/<string name="title_activity_main">[^<]*<\/string>/, `<string name="title_activity_main">${appName}</string>`],
  [/<string name="package_name">[^<]*<\/string>/, `<string name="package_name">${appId}</string>`],
  [/<string name="custom_url_scheme">[^<]*<\/string>/, `<string name="custom_url_scheme">${appId}</string>`],
]);

// applicationId lives in a package-name-derived directory too (MainActivity's
// package declaration must match android/app/build.gradle's applicationId).
// Renaming that directory/package is a much larger native refactor than this
// script attempts — flag it instead of silently leaving a mismatch.
const mainActivityDir = path.join(root, "android/app/src/main/java", ..."com.mendyr.app".split("."));
if (fs.existsSync(mainActivityDir) && appId !== "com.mendyr.app") {
  console.warn(
    `NOTE: MainActivity.java's package is still com.mendyr.app (native Java package renaming isn't automated by this script). ` +
      `Gradle's applicationId override above still makes ${appId} the installed package name, but if you need the Java package ` +
      `itself renamed too, do that once in Android Studio's "Refactor > Rename".`
  );
}

// ── iOS ──────────────────────────────────────────
replaceInFile("ios/App/App.xcodeproj/project.pbxproj", [
  [/PRODUCT_BUNDLE_IDENTIFIER = [^;]+;/g, `PRODUCT_BUNDLE_IDENTIFIER = ${appId};`],
]);

replaceInFile("ios/App/App/Info.plist", [
  [/(<key>CFBundleDisplayName<\/key>\s*\n\s*<string>)[^<]*(<\/string>)/, `$1${appName}$2`],
]);

console.log(`\nNative project re-identified as "${TARGET}" (${appId} / ${appName}).`);
console.log(`Next: npm run build:${TARGET} && CAPACITOR_APP_TARGET=${TARGET} npx cap sync`);
