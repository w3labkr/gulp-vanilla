const gulp = require("gulp");
const { src, dest, watch, series, parallel } = require("gulp");

const fs = require("fs");
const rename = require("gulp-rename");
const concat = require("gulp-concat");
const header = require("gulp-header");
const sourcemaps = require("gulp-sourcemaps");
const mergeStream = require("merge-stream");
const bump = require("gulp-bump");
const replace = require("gulp-replace");
const plumber = require("gulp-plumber");
// gulp-debug is dynamically imported.

const fileinclude = require("gulp-file-include");
const beautify = require("gulp-jsbeautifier");
// imagemin is dynamically imported.

const tailwindcss = require("tailwindcss");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
// cssnano is dynamically imported.

const babel = require("gulp-babel");
const uglify = require("gulp-uglify");

// --- Error Handler ---
function errorHandler(taskName) {
  return function (error) {
    console.error(
      `Error in task '${taskName}', plugin '${error.plugin || "unknown"}':`,
    );
    console.error(error.message);
    if (error.codeFrame) {
      console.error(error.codeFrame);
    }
  };
}

// --- Settings and Helper Functions ---
function version() {
  return new Promise((resolve, reject) => {
    src("./package.json")
      .pipe(plumber(errorHandler("version")))
      .pipe(bump({ type: "patch" }))
      .pipe(dest("./"))
      .on("end", resolve)
      .on("error", reject);
  });
}

function banner(pkg) {
  return [
    "/**",
    " * Copyright (c) <%= new Date().getFullYear() %> <%= pkg.author %>",
    " * <%= pkg.name %> - <%= pkg.description %>",
    " * @version v<%= pkg.version %>",
    " * @link <%= pkg.homepage %>",
    " * @license <%= pkg.license %>",
    " */",
    "",
  ].join("\n");
}

// --- Core Tasks ---
async function clean() {
  const { deleteAsync } = await import("del");
  console.log("Cleaning up the dist/ directory...");
  try {
    await deleteAsync(["dist/"]);
  } catch (error) {
    console.error("Error occurred during the clean task:", error);
    throw error;
  }
}

async function htmlTranspile() {
  console.log(
    "Transforming HTML and updating CSS/JS links to .min versions...",
  );
  const { default: debug } = await import("gulp-debug");

  return src(["src/*.html", "src/en/**/*.html"], {
    allowEmpty: true,
    base: "src",
  })
    .pipe(plumber(errorHandler("htmlTranspile")))
    .pipe(debug({ title: "htmlTranspile - files entering stream:" }))
    .pipe(
      fileinclude({
        prefix: "@@",
        basepath: "@file",
      }),
    )
    .pipe(beautify())
    .pipe(
      replace(
        /href\s*=\s*["']([^"']+\.css)["']/g,
        function (match, capturedPath) {
          if (
            capturedPath.endsWith(".min.css") ||
            capturedPath.startsWith("http://") ||
            capturedPath.startsWith("https://") ||
            !capturedPath.includes(".css")
          ) {
            return match;
          }
          return match.replace(
            capturedPath,
            capturedPath.replace(/\.css$/, ".min.css"),
          );
        },
      ),
    )
    .pipe(
      replace(
        /src\s*=\s*["']([^"']+\.js)["']/g,
        function (match, capturedPath) {
          if (
            capturedPath.endsWith(".min.js") ||
            capturedPath.startsWith("http://") ||
            capturedPath.startsWith("https://") ||
            !capturedPath.includes(".js")
          ) {
            return match;
          }
          return match.replace(
            capturedPath,
            capturedPath.replace(/\.js$/, ".min.js"),
          );
        },
      ),
    )
    .pipe(dest("dist"))
    .on("end", function () {
      console.log("htmlTranspile task finished successfully.");
    })
    .on("error", function (err) {
      console.error("htmlTranspile task failed:", err);
    });
}

async function imageTranspile() {
  console.log("Optimizing images...");
  const { default: imagemin } = await import("gulp-imagemin");
  const { default: debug } = await import("gulp-debug");

  return src(["src/assets/images/**/*"], { allowEmpty: true })
    .pipe(plumber(errorHandler("imageTranspile")))
    .pipe(debug({ title: "imageTranspile - files in stream:" }))
    .pipe(imagemin([]))
    .pipe(dest("dist/assets/images"));
}

async function cssProcess() {
  console.log("Processing individual CSS files (for watch)...");

  const { default: debug } = await import("gulp-debug");
  const pkg = JSON.parse(fs.readFileSync("./package.json"));

  return (
    src("src/assets/css/**/*.css", { allowEmpty: true })
      .pipe(plumber(errorHandler("cssProcess")))
      // .pipe(debug({title: 'cssProcess - files in stream:'})) // Uncomment for debugging
      .pipe(sourcemaps.init())
      .pipe(postcss([tailwindcss("./tailwind.config.js"), autoprefixer()]))
      .pipe(header(banner(pkg), { pkg: pkg }))
      .pipe(sourcemaps.write("."))
      .pipe(dest("dist/assets/css"))
  );
}

async function cssMinifyIndividual() {
  console.log("Minifying individual CSS files...");
  const { default: cssnano } = await import("cssnano");
  const { default: debug } = await import("gulp-debug");
  const pkg = JSON.parse(fs.readFileSync("./package.json"));

  return src("src/assets/css/**/*.css", { allowEmpty: true })
    .pipe(plumber(errorHandler("cssMinifyIndividual")))
    .pipe(debug({ title: "cssMinifyIndividual - files in stream:" }))
    .pipe(sourcemaps.init())
    .pipe(
      postcss([
        tailwindcss("./tailwind.config.js"),
        autoprefixer(),
        cssnano({ preset: "default" }),
      ]),
    )
    .pipe(header(banner(pkg), { pkg: pkg }))
    .pipe(rename({ suffix: ".min" }))
    .pipe(sourcemaps.write("."))
    .pipe(dest("dist/assets/css"));
}

async function jsProcess() {
  console.log("Processing individual JavaScript files (for watch)...");

  const { default: debug } = await import("gulp-debug");
  const pkg = JSON.parse(fs.readFileSync("./package.json"));

  return (
    src("src/assets/js/**/*.js", { allowEmpty: true })
      .pipe(plumber(errorHandler("jsProcess")))
      // .pipe(debug({title: 'jsProcess - files in stream:'})) // Uncomment for debugging
      .pipe(sourcemaps.init())
      .pipe(babel())
      .pipe(header(banner(pkg), { pkg: pkg }))
      .pipe(sourcemaps.write("."))
      .pipe(dest("dist/assets/js"))
  );
}

async function jsMinifyIndividual() {
  console.log("Minifying individual JavaScript files...");
  const { default: debug } = await import("gulp-debug");
  const pkg = JSON.parse(fs.readFileSync("./package.json"));

  return src("src/assets/js/**/*.js", { allowEmpty: true })
    .pipe(plumber(errorHandler("jsMinifyIndividual")))
    .pipe(debug({ title: "jsMinifyIndividual - files in stream:" }))
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(uglify())
    .pipe(header(banner(pkg), { pkg: pkg }))
    .pipe(rename({ suffix: ".min" }))
    .pipe(sourcemaps.write("."))
    .pipe(dest("dist/assets/js"));
}

async function publishPublic() {
  console.log("Publishing public files...");
  const { default: debug } = await import("gulp-debug");
  return src(["public/**/*"], { allowEmpty: true })
    .pipe(plumber(errorHandler("publish-public")))
    .pipe(debug({ title: "publish-public - files in stream:" }))
    .pipe(dest("dist"));
}

async function publishFonts() {
  console.log("Publishing fonts...");
  const { default: debug } = await import("gulp-debug");
  return src(["src/assets/fonts/**/*"], { allowEmpty: true })
    .pipe(plumber(errorHandler("publish-fonts")))
    .pipe(debug({ title: "publish-fonts - files in stream:" }))
    .pipe(dest("dist/assets/fonts"));
}

const publish = parallel(publishPublic, publishFonts);

// --- Watch Tasks ---
function watchFiles() {
  console.log("Watching for file changes...");
  watch("src/**/*.html", series(htmlTranspile));
  watch("src/assets/images/**/*", series(imageTranspile));
  watch("src/assets/css/**/*.css", series(cssProcess, cssMinifyIndividual));
  watch("src/assets/js/**/*.js", series(jsProcess, jsMinifyIndividual));
  watch("src/assets/fonts/**/*", series(publish));
  watch("public/**/*", series(publish));
}

// --- Exported Gulp Tasks ---
exports.default = series(
  clean,
  version,
  parallel(
    htmlTranspile,
    imageTranspile,
    cssMinifyIndividual,
    jsMinifyIndividual,
  ),
  publish,
);

exports.build = exports.default;
exports.watch = series(exports.default, watchFiles);

exports.clean = clean;
exports.html = htmlTranspile;
exports.images = imageTranspile;
exports.styles = cssMinifyIndividual;
exports.scripts = jsMinifyIndividual;
exports.version = version;
exports.publish = publish;

exports.cssProcess = cssProcess;
exports.jsProcess = jsProcess;
