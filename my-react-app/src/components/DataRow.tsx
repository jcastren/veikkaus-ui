interface DataRowProps<T> {
  caption: string
  value: string
  isEditable?: boolean
  setValue?: React.Dispatch<React.SetStateAction<T>>
}

export function DataRow<T>({ caption, value, isEditable, setValue }: DataRowProps<T>) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value as T
    setValue?.(newValue)
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
            value={value}
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
