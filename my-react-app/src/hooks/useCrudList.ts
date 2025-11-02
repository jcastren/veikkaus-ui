import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'

interface ItemWithId {
  id: number
}

export function useCrudList<T extends ItemWithId>(apiUrl: string) {
  const [items, setItems] = useState<T[] | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await axios.get<T[]>(apiUrl)
      setItems(response.data)
    } catch (err) {
      setError(`Failed to fetch items from ${apiUrl}`)
    } finally {
      setLoading(false)
    }
  }, [apiUrl])

  useEffect(() => {
    void fetchItems()
  }, [fetchItems])

  const createItem = async (newItemData: Omit<T, 'id'>): Promise<void> => {
    try {
      const response = await axios.post<T>(apiUrl, newItemData)
      setItems(currentItems => [...(currentItems || []), response.data])
      setError(null) // Clear any previous errors on success
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        setError(err.response.data.message)
      } else {
        setError(`Failed to create item at ${apiUrl}`)
      }
      // We explicitly DO NOT re-fetch here, so the user can see the error.
    }
  }

  const deleteItem = async (itemId: number): Promise<void> => {
    const originalItems = items
    setItems(currentItems => currentItems?.filter(item => item.id !== itemId) || null)

    try {
      await axios.delete(`${apiUrl}/${itemId}`)
      setError(null) // Clear any previous errors on success
    } catch (err) {
      setError(`Failed to delete item ${itemId}`)
      setItems(originalItems)
    }
  }

  return { items, loading, error, createItem, deleteItem, refetch: fetchItems }
}
