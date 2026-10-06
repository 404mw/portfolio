// Fills `{name}` placeholders in a content string with plain values: "Offer {n} of {total}".

/** `template` with every `{key}` replaced by `values[key]`; unknown keys stay as written. */
export function fillTemplate(template: string, values: Readonly<Record<string, string | number>>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  );
}
