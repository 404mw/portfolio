// The faces for the sharing images (ImageResponse can't use next/font), read from disk when the
// image is built: Acosta 400 (assets/fonts/acosta.otf), the display face, and IBM Plex Sans 400
// (assets/fonts/ibm-plex-sans-latin-400.woff), the body face, since Acosta has no punctuation.
// Returns ImageResponse's `fonts` entries for the faces asked for.
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const ogDisplayFamily = "Acosta";
export const ogBodyFamily = "IBM Plex Sans";

type OgFace = "display" | "body";

const files: Record<OgFace, { readonly name: string; readonly file: string }> = {
  display: { name: ogDisplayFamily, file: "acosta.otf" },
  body: { name: ogBodyFamily, file: "ibm-plex-sans-latin-400.woff" },
};

export async function ogFonts(faces: readonly OgFace[]) {
  const fontsDir = join(process.cwd(), "assets", "fonts");
  return Promise.all(
    faces.map(async (face) => ({
      name: files[face].name,
      data: await readFile(join(fontsDir, files[face].file)),
      weight: 400 as const,
      style: "normal" as const,
    })),
  );
}
