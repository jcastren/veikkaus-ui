import { Link } from 'wouter'
import { ReactNode } from 'react'

// Define a base interface for items to ensure they have an ID for the key
interface ItemWithId {
  id: number
}

interface DataListProps<T extends ItemWithId> {
  items: T[] | null
  renderItem: (item: T) => ReactNode // Function to render the content of an item
  getItemUrl: (item: T) => string
  noItemsText: string
}

export function DataList<T extends ItemWithId>({ items, renderItem, getItemUrl, noItemsText }: DataListProps<T>) {
  if (!items || items.length === 0) {
    return <p>{noItemsText}</p>
  }

  return (
    <div className="space-y-2">
      {items.map((item) => (
        <Link key={item.id} href={getItemUrl(item)}>
          <div className="p-2 border rounded shadow-sm cursor-pointer hover:bg-gray-100">
            {renderItem(item)} 
          </div>
        </Link>
      ))}
    </div>
  )
}
