// Define an interface for the component's props for type safety and clarity
interface HeaderProps {
  header: string;
}

// Use a standard function declaration for the component
export function Header({ header }: HeaderProps) {
  return (
    <h1 className="text-2xl font-bold mb-4">{header}</h1>
  );
}
