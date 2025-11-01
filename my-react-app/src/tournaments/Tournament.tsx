import { useState, useEffect } from 'react'
import axios from 'axios'
import { Link, useRoute, useLocation } from 'wouter'
import type { Tournament as TournamentType } from '../common/tournaments.js'
import { DataRow } from "../components/DataRow.js"
import { CrudButtons } from "../components/CrudButtons.js" // Import the new component

export default function Tournament() {
  const [tournament, setTournament] = useState<TournamentType | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editedName, setEditedName] = useState("")
  const [editedYear, setEditedYear] = useState("")

  const [, params] = useRoute("/tournaments/:id")
  const [, setLocation] = useLocation()

  useEffect(() => {
    if (params?.id) {
      const fetchTournament = async () => {
        setLoading(true)
        try {
          const response = await axios.get<TournamentType>(`http://localhost:8080/api/v2/tournaments/${params.id}`)
          setTournament(response.data)
          setEditedName(response.data.name)
          setEditedYear(response.data.year)
        } catch (err) {
          if (axios.isAxiosError(err) && err.response?.status === 404) {
            setError("Tournament not found.")
          } else {
            setError("An unexpected error occurred while fetching the tournament.")
          }
        } finally {
          setLoading(false)
        }
      }
      void fetchTournament()
    }
  }, [params?.id])

  const handleSave = async () => {
    if (!tournament) return

    try {
      const tournamentToUpdate = { ...tournament, name: editedName, year: editedYear }
      const response = await axios.put<TournamentType>(`http://localhost:8080/api/v2/tournaments/${tournament.id}`, tournamentToUpdate)

      setTournament(response.data)
      setEditedName(response.data.name)
      setEditedYear(response.data.year)
      setIsEditing(false)
    } catch (err) {
      setError('Failed to save the tournament')
    }
  }

  const handleCancel = () => {
    if (tournament) {
      setEditedName(tournament.name)
      setEditedYear(tournament.year)
    }
    setIsEditing(false)
  }

  const handleDelete = async () => {
    if (!tournament) return

    if (window.confirm("Are you sure you want to delete this tournament?")) {
      try {
        await axios.delete(`http://localhost:8080/api/v2/tournaments/${tournament.id}`)
        setLocation("/tournaments")
      } catch (err) {
        setError('Failed to delete the tournament')
      }
    }
  }

  if (loading) {
    return <p>Loading tournament details...</p>
  }

  if (error) {
    return (
      <div className="p-4">
        <p className="text-red-500">Error: {error}</p>
        <div className="mt-8">
          <Link href="/tournaments" className="text-blue-500 hover:underline">
            &larr; Back to Tournaments
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4">
      <div className="flex flex-col space-y-4 text-left">
        <DataRow caption="Id" value={tournament!.id.toString()} />
        <DataRow 
          caption="Name" 
          value={isEditing ? editedName : tournament!.name} 
          isEditable={isEditing} 
          onValueChange={setEditedName} 
        />
        <DataRow
          caption="Year"
          value={isEditing ? editedYear : tournament!.year}
          isEditable={isEditing}
          onValueChange={setEditedYear}
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
        <Link href="/tournaments" className="text-blue-500 hover:underline">
          &larr; Back to Tournaments
        </Link>
      </div>
    </div>
  )
}
