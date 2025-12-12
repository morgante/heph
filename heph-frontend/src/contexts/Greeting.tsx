interface GreetingProps {
  name?: string
}

export function Greeting({ name = 'World' }: GreetingProps) {
  return <span className="greeting">Hello, {name}! I ❤️ TypeScript</span>
}
