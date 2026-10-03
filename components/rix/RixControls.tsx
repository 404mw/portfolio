"use client";
// The /rix playground's controls (ui-spec/02-playground.md §2.1): it owns `useRixPlayground` and
// lays out the stage band (the stage, passed in as `children`, then the "now playing" readout),
// which stays in view on screens at least 40rem tall; then the patrol toggle, the reduced-motion
// note, and the five button groups (emotions, moves, plays, moods, glyphs), one button per content
// key. Under reduced motion the buttons and groups with no R8.1 version and the toggle hide, and
// the note shows (§2.4).
import type { ReactNode } from "react";
import { RixGroup } from "@/components/rix/RixGroup";
import { RixPlayButton } from "@/components/rix/RixPlayButton";
import { RixReadout } from "@/components/rix/RixReadout";
import { playground } from "@/content/rix";
import { useRixPlayground } from "@/hooks/useRixPlayground";
import {
  groupPlaysReduced,
  playsReduced,
  rixGroupId,
  rixPlaygroundCommands,
  rixPlaygroundGroups,
  rixPlaygroundLabel,
  sameRixPlaygroundCommand,
} from "@/lib/rixPlayground";

export function RixControls({ children }: { readonly children: ReactNode }) {
  const { playing, patrol, play, togglePatrol } = useRixPlayground();
  return (
    <>
      <div
        data-anim="reveal"
        data-anim-delay="150"
        className="z-10 bg-bg pb-4 [@media(min-height:40rem)]:sticky [@media(min-height:40rem)]:top-17"
      >
        {children}
        <RixReadout label={playing ? rixPlaygroundLabel(playing) : null} />
      </div>
      <div className="mt-8 flex flex-col gap-8">
        <div className="flex flex-wrap gap-2 motion-reduce:hidden">
          <RixPlayButton onClick={togglePatrol} pressed={patrol}>
            {playground.patrolToggle}
          </RixPlayButton>
        </div>
        <p className="hidden max-w-xl text-body text-muted motion-reduce:block">{playground.reducedNote}</p>
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-5 motion-reduce:xl:grid-cols-2">
          {rixPlaygroundGroups.map((group) => (
            <RixGroup
              key={group}
              id={rixGroupId(group)}
              heading={playground.groups[group]}
              hideReduced={!groupPlaysReduced(group)}
            >
              {rixPlaygroundCommands(group).map((command) => (
                <RixPlayButton
                  key={command.move}
                  onClick={() => play(command)}
                  playing={sameRixPlaygroundCommand(playing, command)}
                  hideReduced={!playsReduced(command)}
                >
                  {rixPlaygroundLabel(command)}
                </RixPlayButton>
              ))}
            </RixGroup>
          ))}
        </div>
      </div>
    </>
  );
}
