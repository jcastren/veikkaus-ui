import { useState, useEffect } from 'react'
import axios from 'axios'
import { Link, useRoute, useLocation } from 'wouter'
import type { Team as TeamType } from '../common/teams.js'
import { DataRow } from "../components/DataRow.js"
import { CrudButtons } from "../components/CrudButtons.js" // Import the new component

function Team() {
  const [team, setTeam] = useState<TeamType | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editedName, setEditedName] = useState("")

  const [, params] = useRoute("/teams/:id")
  const [, setLocation] = useLocation()

  useEffect(() => {
    if (params?.id) {
      const fetchTeam = async () => {
        setLoading(true)
        try {
          const response = await axios.get<TeamType>(`http://localhost:8080/api/v2/teams/${params.id}`)
          setTeam(response.data)
          setEditedName(response.data.name)
        } catch (err) {
          if (axios.isAxiosError(err) && err.response?.status === 404) {
            setError("Team not found.")
          } else {
            setError("An unexpected error occurred while fetching the team.")
          }
        } finally {
          setLoading(false)
        }
      }
      void fetchTeam()
    }
  }, [params?.id])

  const handleSave = async () => {
    if (!team) return

    try {
      const teamToUpdate = { ...team, name: editedName }
      const response = await axios.put<TeamType>(`http://localhost:8080/api/v2/teams/${team.id}`, teamToUpdate)

      setTeam(response.data)
      setEditedName(response.data.name)
      setIsEditing(false)
    } catch (err) {
      setError('Failed to save the team name')
    }
  }

  const handleCancel = () => {
    if (team) {
      setEditedName(team.name)
    }
    setIsEditing(false)
  }

  const handleDelete = async () => {
    if (!team) return

    if (window.confirm("Are you sure you want to delete this team?")) {
      try {
        await axios.delete(`http://localhost:8080/api/v2/teams/${team.id}`)
        setLocation("/teams")
      } catch (err) {
        setError('Failed to delete the team')
      }
    }
  }

  if (loading) {
    return <p>Loading team details...</p>
  }

  if (error) {
    return (
      <div className="p-4">
        <p className="text-red-500">Error: {error}</p>
        <div className="mt-8">
          <Link href="/teams" className="text-blue-500 hover:underline">
            &larr; Back to Teams
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4">
      <div className="flex flex-col space-y-4 text-left">
        <DataRow caption="Id" value={team!.id.toString()} />
        <DataRow 
          caption="Name" 
          value={isEditing ? editedName : team!.name} 
          isEditable={isEditing} 
          onValueChange={setEditedName} 
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
        <Link href="/teams" className="text-blue-500 hover:underline">
          &larr; Back to Teams
        </Link>
      </div>
    </div>
  )
}

export default Team
