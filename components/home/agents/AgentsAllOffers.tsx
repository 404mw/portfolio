// Every About card's offers in the server markup (server component), so crawlers and AI models
// can read what a visitor sees only after picking a card. `hidden`: the same text shows in
// `AgentsTabs` after a pick, so it must not show or be read twice, and it takes no space.
// Title and line only: no demos, no ids, no motion hooks.
import { agents } from "@/content/home";
import { cardSets } from "@/lib/cardSets";

export function AgentsAllOffers() {
  return (
    <div hidden>
      {cardSets.map(({ set, label }) => (
        <div key={set}>
          <h3>{label}</h3>
          <ul>
            {agents.cards[set].map((offer) => (
              <li key={offer.title}>
                <strong>{offer.title}</strong> {offer.line}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
