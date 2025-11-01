import { useState, type ReactNode } from 'react'

interface ListCreateButtonProps {
  buttonText: string
  children: (onCancel: () => void) => ReactNode
}

export function ListCreateButton({ buttonText, children }: ListCreateButtonProps) {
  const [isCreating, setIsCreating] = useState(false)

  const handleCancel = () => {
    setIsCreating(false)
  }

  return (
    <div className="mb-4">
      {!isCreating ? (
        <button onClick={() => setIsCreating(true)} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
          {buttonText}
        </button>
      ) : (
        // The form content is now passed in from the parent component.
        // We provide the `handleCancel` function so the child can close itself.
        children(handleCancel)
      )}
    </div>
  )
}
