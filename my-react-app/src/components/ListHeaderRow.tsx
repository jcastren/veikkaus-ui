export interface Header {
  text: string
  className?: string
}

interface ListHeaderRowProps {
  headers: Header[]
  actionsHeaderText?: string
}

export function ListHeaderRow({ headers, actionsHeaderText }: ListHeaderRowProps) {
  return (
    <div className="p-2 border-b-2 border-gray-300 flex justify-between items-center font-bold text-gray-600">
      <div className="flex-grow flex items-center text-left gap-4">
        {headers.map((header, index) => (
          <div key={index} className={header.className}>
            {header.text}
          </div>
        ))}
      </div>
      {actionsHeaderText && <span>{actionsHeaderText}</span>}
    </div>
  )
}
