// In-page link targets on the one page: the main landmark (skip link), section ids and the
// takeover hashes (ui-spec §0.1). `sectionIds` holds the bare id for `id=`; `routes` holds
// the matching `#hash` for `href=`.
export const sectionIds = {
  main: "main",
  top: "top",
  agents: "agents",
  process: "process",
  web: "web",
  proofs: "proofs",
  contact: "contact",
  exile: "exile",
  designVault: "design-vault",
  marwixSkills: "marwix-skills",
} as const;

export type SectionKey = keyof typeof sectionIds;

export const routes = Object.fromEntries(
  Object.entries(sectionIds).map(([key, id]) => [key, `#${id}`]),
) as { readonly [K in SectionKey]: `#${(typeof sectionIds)[K]}` };
