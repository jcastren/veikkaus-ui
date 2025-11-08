import { useState, useEffect } from 'react'
import axios from 'axios'
import { Link, useRoute, useLocation } from 'wouter'
import type { Player as PlayerType } from '../common/players.js'
import { DataRow } from "../components/DataRow.js"
import { CrudButtons } from "../components/CrudButtons.js" // Import the new component

export default function Player() {
  const [player, setPlayer] = useState<PlayerType | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editedFirstName, setEditedFirstName] = useState("")
  const [editedLastName, setEditedLastName] = useState("")

  const [, params] = useRoute("/players/:id")
  const [, setLocation] = useLocation()

  useEffect(() => {
    if (params?.id) {
      const fetchPlayer = async () => {
        setLoading(true)
        try {
          const response = await axios.get<PlayerType>(`http://localhost:8080/api/v2/players/${params.id}`)
          setPlayer(response.data)
          setEditedFirstName(response.data.firstName)
          setEditedLastName(response.data.lastName)
        } catch (err) {
          if (axios.isAxiosError(err) && err.response?.status === 404) {
            setError("Player not found.")
          } else {
            setError("An unexpected error occurred while fetching the player.")
          }
        } finally {
          setLoading(false)
        }
      }
      void fetchPlayer()
    }
  }, [params?.id])

  const handleSave = async () => {
    if (!player) return

    try {
      const playerToUpdate = { ...player, firstName: editedFirstName, lastName: editedLastName }
      const response = await axios.put<PlayerType>(`http://localhost:8080/api/v2/players/${player.id}`, playerToUpdate)

      setPlayer(response.data)
      setEditedFirstName(response.data.firstName)
      setEditedLastName(response.data.lastName)
      setIsEditing(false)
    } catch (err) {
      setError('Failed to save the player')
    }
  }

  const handleCancel = () => {
    if (player) {
      setEditedFirstName(player.firstName)
      setEditedLastName(player.lastName)
    }
    setIsEditing(false)
  }

  const handleDelete = async () => {
    if (!player) return

    if (window.confirm("Are you sure you want to delete this player?")) {
      try {
        await axios.delete(`http://localhost:8080/api/v2/players/${player.id}`)
        setLocation("/players")
      } catch (err) {
        setError('Failed to delete the player')
      }
    }
  }

  if (loading) {
    return <p>Loading player details...</p>
  }

  if (error) {
    return (
      <div className="p-4">
        <p className="text-red-500">Error: {error}</p>
        <div className="mt-8">
          <Link href="/players" className="text-blue-500 hover:underline">
            &larr; Back to Players
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4">
      <div className="flex flex-col space-y-4 text-left">
        <DataRow caption="Id" value={player!.id.toString()} />
        <DataRow 
          caption="Name" 
          value={isEditing ? editedFirstName : player!.firstName}
          isEditable={isEditing} 
          onValueChange={setEditedFirstName}
        />
        <DataRow
          caption="Year"
          value={isEditing ? editedLastName : player!.lastName}
          isEditable={isEditing}
          onValueChange={setEditedLastName}
        />
      </div>

      {/* Use the new CrudButtons component */}
      <CrudButtons
        isEditing={isEditing}
        onEdit={() => setIsEditing(true)}
        onSave={handleSave}
        onCancel={handleCancel}
        onDelete={handleDelete}
      />

      <div className="mt-8">
        <Link href="/players" className="text-blue-500 hover:underline">
          &larr; Back to Players
        </Link>
      </div>
    </div>
  )
}
