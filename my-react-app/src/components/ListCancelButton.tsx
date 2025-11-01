interface ListCancelButtonProps {
  onClick: () => void
}

export function ListCancelButton({ onClick }: ListCancelButtonProps) {
  return (
    <button onClick={onClick} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
      Cancel
    </button>
  )
}
