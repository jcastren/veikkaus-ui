import type { ReactNode } from 'react'

interface ItemWithId {
  id: number
}

interface DataListProps<T extends ItemWithId> {
  items: T[] | null
  renderItem: (item: T) => ReactNode // This function must now return a <tr> element
  noItemsText: string
}

export function DataList<T extends ItemWithId>({ items, renderItem, noItemsText }: DataListProps<T>) {
  if (!items || items.length === 0) {
    return (
      <tbody>
        <tr>
          <td colSpan={100} className="p-4 text-center text-gray-500">
            {noItemsText}
          </td>
        </tr>
      </tbody>
    )
  }

  return (
    <tbody className="bg-white divide-y divide-gray-200">
      {items.map((item) => renderItem(item))}
    </tbody>
  )
}
