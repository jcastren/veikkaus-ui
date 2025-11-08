interface DataRowProps {
  caption: string
  // --- The Fix: Allow value to be a string or a number ---
  value: string | number
  isEditable?: boolean
  onValueChange?: (newValue: string) => void
}

export function DataRow({ caption, value, isEditable, onValueChange }: DataRowProps) {
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onValueChange?.(e.target.value)
  }

  return (
    <div className="flex flex-row space-x-4">
      <div className="w-20">
        <span className="font-bold">{caption}:</span>
      </div>
      <div className="flex-1">
        {isEditable ? (
          <input
            type="text"
            // The input's value must be a string, so we convert it here.
            value={value.toString()}
            onChange={handleChange}
            className="pl-2 border rounded"
          />
        ) : (
          <span>{value}</span>
        )}
      </div>
    </div>
  )
}
