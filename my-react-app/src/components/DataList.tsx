import { Link } from 'wouter'
import { ReactNode } from 'react'

interface ItemWithId {
  id: number
}

interface DataListProps<T extends ItemWithId> {
  items: T[] | null
  renderMainContent: (item: T) => ReactNode // Renders the main part of the row
  renderActions?: (item: T) => ReactNode   // Renders the actions part (e.g., delete button)
  getItemUrl: (item: T) => string
  noItemsText: string
}

export function DataList<T extends ItemWithId>({ items, renderMainContent, renderActions, getItemUrl, noItemsText }: DataListProps<T>) {
  if (!items || items.length === 0) {
    return <p>{noItemsText}</p>
  }

  return (
    <div className="space-y-2">
      {items.map((item) => (
        <Link key={item.id} href={getItemUrl(item)}>
          <div className="p-2 border rounded shadow-sm cursor-pointer hover:bg-gray-100 flex justify-between items-center">
            {/* Main content is now separate from actions */}
            {renderMainContent(item)}
            {renderActions && renderActions(item)}
          </div>
        </Link>
      ))}
    </div>
  )
}
