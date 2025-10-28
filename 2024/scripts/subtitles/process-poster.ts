// Must run with Bun
// Required package: curl, imagemagick-cli, cwebp
import { $ } from "bun";
import { exists, mkdir } from "fs/promises";
import directors from "./out/directors.json";

const IMAGE_OUTPUT = "public/directors-dialogue/posters";
const WIDTH = 128;

if (!(await exists(IMAGE_OUTPUT))) {
  await mkdir(IMAGE_OUTPUT);
}

const posters = directors.flatMap((d) =>
  d.movies.map((m) => ({
    url: m.image,
    output: `${IMAGE_OUTPUT}/${m.image.split("/").at(-1)}`,
  })),
);

for (const { url, output } of posters) {
  await $`curl ${url} > ${output}`;
}

console.log(`Resizing width to ${WIDTH}px`);

await $`mogrify -resize ${WIDTH}x ${IMAGE_OUTPUT}/*.jpg`;

for (const { output } of posters) {
  await $`cwebp ${output} -o "${output.replace(".jpg", ".webp")}"`;
}

await $`rm ${IMAGE_OUTPUT}/*.jpg`;
