interface CrudButtonsProps {
  isEditing: boolean
  onEdit: () => void
  onSave: () => void
  onCancel: () => void
  onDelete: () => void
}

export function CrudButtons({ isEditing, onEdit, onSave, onCancel, onDelete }: CrudButtonsProps) {
  return (
    <div className="mt-4 flex gap-2">
      {isEditing ? (
        <>
          <button onClick={onSave} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Save
          </button>
          <button onClick={onCancel} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
            Cancel
          </button>
        </>
      ) : (
        <>
          <button onClick={onEdit} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
            Edit
          </button>
          <button onClick={onDelete} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
            Delete
          </button>
        </>
      )}
    </div>
  )
}
