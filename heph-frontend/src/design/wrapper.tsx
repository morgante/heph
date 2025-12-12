import { Terminal } from "@ds/inject/terminal";

export function Wrapper() {
  return (
    <div className="wrapper">
      I am shared!
      <Terminal name="Morgante"/>
    </div>
  );
}
