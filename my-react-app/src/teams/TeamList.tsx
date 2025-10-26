import { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'wouter'
import type { Team } from "../common/teams.js"
import { Header } from "../components/Header.js"

function TeamList() {
  const [teams, setTeams] = useState<Team[] | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // State for the create form
  const [isCreating, setIsCreating] = useState(false)
  const [newTeamName, setNewTeamName] = useState("")

  const fetchTeams = async () => {
    try {
      setLoading(true)
      const response = await axios.get<Team[]>('http://localhost:8080/api/v2/teams')
      setTeams(response.data)
    } catch (err) {
      setError('Failed to fetch teams')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTeams()
  }, [])

  const handleCreate = async () => {
    if (!newTeamName.trim()) {
      alert("Team name cannot be empty.")
      return
    }
    try {
      await axios.post<Team>('http://localhost:8080/api/v2/teams', { name: newTeamName })
      
      // Re-fetch the entire list from the server to ensure data is fresh.
      await fetchTeams()

      setNewTeamName("") // Reset input field
      setIsCreating(false) // Hide the form
    } catch (err) {
      setError('Failed to create team')
    }
  }

  const handleCancelCreate = () => {
    setNewTeamName("")
    setIsCreating(false)
  }

  const handleDelete = async (teamId: number, event: React.MouseEvent) => {
    // --- The Fix ---
    // This stops the click event from bubbling up to the parent <Link> component.
    event.stopPropagation()
    event.preventDefault() // Also good practice to prevent default link behavior

    if (!window.confirm("Are you sure you want to delete this team?")) {
      return
    }

    try {
      await axios.delete(`http://localhost:8080/api/v2/teams/${teamId}`)
      await fetchTeams() // Re-fetch the list after deletion
    } catch (err) {
      setError('Failed to delete team')
    }
  }

  if (loading) {
    return <p>Loading teams...</p>
  }

  if (error) {
    return <p>Error: {error}</p>
  }

  return (
    <div className="p-4">
      <Header header="Teams" />

      <div className="mb-4">
        {!isCreating ? (
          <button onClick={() => setIsCreating(true)} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
            Create Team
          </button>
        ) : (
          <div className="p-4 border rounded bg-gray-50 flex items-center gap-2">
            <input
              type="text"
              value={newTeamName}
              onChange={(e) => setNewTeamName(e.target.value)}
              placeholder="New team name"
              className="p-2 border rounded w-full"
            />
            <button onClick={handleCreate} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              Save
            </button>
            <button onClick={handleCancelCreate} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
              Cancel
            </button>
          </div>
        )}
      </div>

      {teams && teams.length > 0 ? (
        <div className="space-y-2">
          {teams.map((team: Team) => (
            <Link key={team.id} href={`/teams/${team.id}`}>
              <div className="p-2 border rounded shadow-sm cursor-pointer hover:bg-gray-100 flex justify-between items-center">
                <span>{team.name}</span>
                <button
                  onClick={(event) => handleDelete(team.id, event)}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                >
                  Delete
                </button>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p>No teams found.</p>
      )}
    </div>
  )
}

export default TeamList
