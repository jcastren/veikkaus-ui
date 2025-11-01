import { useState } from 'react'
import axios from 'axios'

// The component is now generic, accepting the type of the created item
interface ListCreateButtonProps<T> {
  onCreate: (newItem: T) => void
  apiUrl: string
  placeholderText: string
  buttonText: string
}

export function ListCreateButton<T>({ onCreate, apiUrl, placeholderText, buttonText }: ListCreateButtonProps<T>) {
  const [isCreating, setIsCreating] = useState(false)
  const [newItemName, setNewItemName] = useState("")
  const [error, setError] = useState<string | null>(null)

  const handleCreate = async () => {
    if (!newItemName.trim()) {
      alert("Name cannot be empty.")
      return
    }
    try {
      // Use the generic apiUrl prop for the POST request
      const response = await axios.post<T>(apiUrl, { name: newItemName })
      onCreate(response.data)
      setNewItemName("")
      setIsCreating(false)
      setError(null)
    } catch (err) {
      setError(`Failed to create item at ${apiUrl}`)
    }
  }

  const handleCancelCreate = () => {
    setNewItemName("")
    setIsCreating(false)
    setError(null)
  }

  return (
    <div className="mb-4">
      {!isCreating ? (
        <button onClick={() => setIsCreating(true)} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
          {buttonText}
        </button>
      ) : (
        <div className="p-4 border rounded bg-gray-50 flex items-center gap-2">
          <input
            type="text"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            placeholder={placeholderText}
            className="p-2 border rounded w-full"
          />
          <button onClick={handleCreate} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Save
          </button>
          <button onClick={handleCancelCreate} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
            Cancel
          </button>
        </div>
      )}
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  )
}
