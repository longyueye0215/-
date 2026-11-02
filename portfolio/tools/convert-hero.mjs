import sharp from "sharp";

const src = "src/assets/hero-miku.png";
const out = "src/assets/hero-miku.webp";

const meta = await sharp(src).metadata();
console.log("source:", meta.width + "x" + meta.height, meta.format);

const res = await sharp(src)
  .resize({ width: 1920, withoutEnlargement: true })
  .webp({ quality: 82, effort: 6 })
  .toFile(out);

console.log(
  "done:",
  out,
  res.width + "x" + res.height,
  Math.round(res.size / 1024) + " KB"
);
