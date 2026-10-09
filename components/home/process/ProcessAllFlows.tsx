// Every About card's flow in the server markup (server component), so crawlers and AI models
// can read what a visitor sees only after picking a card. `hidden`: the same text shows in
// `ProcessFlow` after a pick, so it must not show or be read twice, and it takes no space.
// Caption, step titles and lines only: no bots, no loops, no motion hooks.
import { process } from "@/content/home";
import { cardSets } from "@/lib/cardSets";

export function ProcessAllFlows() {
  return (
    <div hidden>
      {cardSets.map(({ set, label }) => (
        <div key={set}>
          <h3>{label}</h3>
          <p>{process.flows[set].caption}</p>
          <ol>
            {process.flows[set].steps.map((step) => (
              <li key={step.title}>
                <strong>{step.title}</strong> {step.line}
              </li>
            ))}
          </ol>
        </div>
      ))}
    </div>
  );
}
