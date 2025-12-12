export function Terminal({ name }: { name: string }) {
  return (
    <div className="terminal">
      <div className="terminal-content">
        This Terminal is INJECTED here. Name: {name}
      </div>
    </div>
  );
}
