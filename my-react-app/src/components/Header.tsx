interface HeaderProps {
  header: string;
}

export function Header({ header }: HeaderProps) {
  return (
    <h1 className="text-2xl font-bold mb-4">{header}</h1>
  );
}
