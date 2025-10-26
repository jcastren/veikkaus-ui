import { useState, useEffect } from 'react'
import axios from 'axios'
import { Link, useRoute, useLocation } from 'wouter'
import type { Team as TeamType } from '../common/teams.js'
import { Header } from '../components/Header.js'

function Team() {
  const [team, setTeam] = useState<TeamType | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // State for handling edit mode
  const [isEditing, setIsEditing] = useState(false)
  const [editedName, setEditedName] = useState("")

  const [, params] = useRoute("/teams/:id")
  const [, setLocation] = useLocation() // Hook for programmatic navigation

  useEffect(() => {
    if (params?.id) {
      const fetchTeam = async () => {
        setLoading(true)
        try {
          const response = await axios.get<TeamType>(`http://localhost:8080/api/v2/teams/${params.id}`)
          setTeam(response.data)
          setEditedName(response.data.name)
        } catch (err) {
          if (axios.isAxiosError(err)) {
            setError(err.message)
          } else {
            setError('An unexpected error occurred')
          }
        } finally {
          setLoading(false)
        }
      }
      fetchTeam()
    }
  }, [params?.id])

  const handleSave = async () => {
    if (!team) return

    try {
      const updatedTeam = { ...team, name: editedName }
      await axios.put(`http://localhost:8080/api/v2/teams/${team.id}`, updatedTeam)
      setTeam(updatedTeam)
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

    // Confirm with the user before deleting
    if (window.confirm("Are you sure you want to delete this team?")) {
      try {
        await axios.delete(`http://localhost:8080/api/v2/teams/${team.id}`)
        // On successful deletion, redirect to the team list
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
    return <p>Error: {error}</p>
  }

  return (
    <div className="p-4">
      {team ? (
        <>
          <div className="flex items-center gap-4 mb-4">
            {isEditing ? (
              <input
                type="text"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                className="text-2xl font-bold p-2 border rounded"
              />
            ) : (
              <Header header={team.name} />
            )}
          </div>

          <div className="space-y-2">
            <p><span className="font-bold">ID:</span> {team.id}</p>
          </div>

          <div className="mt-4 flex gap-2">
            {isEditing ? (
              <>
                <button onClick={handleSave} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                  Save
                </button>
                <button onClick={handleCancel} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button onClick={() => setIsEditing(true)} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
                  Edit
                </button>
                <button onClick={handleDelete} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
                  Delete
                </button>
              </>
            )}
          </div>
        </>
      ) : (
        <p>Team not found.</p>
      )}

      <div className="mt-8">
        <Link href="/teams" className="text-blue-500 hover:underline">
          &larr; Back to Teams
        </Link>
      </div>
    </div>
  )
}

export default Team
