// The click-tracking props (constitution §11). Umami counts a click on any element carrying
// `data-umami-event="<name>"`. Every Book a call link on the page spreads `bookCallTrackProps`,
// so they all count as one action.
export const bookCallEvent = "book-call";

export type TrackProps = { readonly "data-umami-event": string };

export const bookCallTrackProps: TrackProps = { "data-umami-event": bookCallEvent };
