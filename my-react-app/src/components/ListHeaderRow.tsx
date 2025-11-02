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
    <thead className="bg-gray-50">
      <tr>
        {headers.map((header, index) => (
          <th 
            key={index} 
            className={`p-2 text-left font-bold text-gray-600 tracking-wider ${header.className || ''}`}
          >
            {header.text}
          </th>
        ))}
        {actionsHeaderText && (
          <th className="p-2 text-left font-bold text-gray-600 tracking-wider">
            {actionsHeaderText}
          </th>
        )}
      </tr>
    </thead>
  )
}
