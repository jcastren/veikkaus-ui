interface ListSaveButtonProps {
  onClick: () => void
}

export function ListSaveButton({ onClick }: ListSaveButtonProps) {
  return (
    <button onClick={onClick} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
      Save
    </button>
  )
}
