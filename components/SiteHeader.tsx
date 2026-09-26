// The fixed site header at every width: the 2px progress bar above the 64px nav row and its
// 1px bottom border (67px).
// Left: the inline links (`md` up) or the phone menu; right: Book a call. No brand mark.
import { BookCallLink } from "@/components/BookCallLink";
import { NavBar } from "@/components/NavBar";
import { NavLinks } from "@/components/NavLinks";
import { NavMenu } from "@/components/NavMenu";
import { ProgressBar } from "@/components/ProgressBar";
import { ProgressMotion } from "@/components/ProgressMotion";

export function SiteHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-40">
      <ProgressBar />
      <ProgressMotion />
      <NavBar>
        <NavLinks />
        <NavMenu />
        <BookCallLink variant="nav" />
      </NavBar>
    </header>
  );
}
