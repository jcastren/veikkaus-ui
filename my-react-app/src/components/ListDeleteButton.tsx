interface ListDeleteButtonProps {
  onClick: (event: React.MouseEvent) => void
}

export function ListDeleteButton({ onClick }: ListDeleteButtonProps) {
  return (
    <button
      onClick={onClick}
      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
    >
      Delete
    </button>
  )
}
