export function Terminal({ name }: { name: string }) {
  return (
    <div className="terminal">
      <div className="terminal-content">
        Terminal - {name}
      </div>
    </div>
  );
}
