import { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'wouter'
import type { Team } from "../common/teams.js"
import { Header } from "../components/Header.js"
import { ListCreateButton } from "../components/ListCreateButton.js"
import { ListDeleteButton } from "../components/ListDeleteButton.js"

export default function TeamList() {
  const [teams, setTeams] = useState<Team[] | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTeams = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await axios.get<Team[]>('http://localhost:8080/api/v2/teams')
      setTeams(response.data)
    } catch (err) {
      setError('Failed to fetch teams')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void fetchTeams()
  }, [])

  const handleTeamCreated = (newTeam: Team) => {
    setTeams(currentTeams => [...(currentTeams || []), newTeam])
  }

  const handleDelete = async (teamId: number, event: React.MouseEvent) => {
    event.stopPropagation()
    event.preventDefault()

    if (!window.confirm("Are you sure you want to delete this team?")) {
      return
    }

    const originalTeams = teams
    setTeams(currentTeams => currentTeams?.filter(team => team.id !== teamId) || null)

    try {
      await axios.delete(`http://localhost:8080/api/v2/teams/${teamId}`)
    } catch (err) {
      setError('Failed to delete team. Please try again.')
      setTeams(originalTeams)
    }
  }

  return (
    <div className="p-4">
      <Header header="Teams" />

      {loading && <p>Loading teams...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      {!loading && !error && (
        <>
          <ListCreateButton<Team>
            onCreate={handleTeamCreated}
            apiUrl="http://localhost:8080/api/v2/teams"
            placeholderText="New team name"
            buttonText="Create Team"
          />

          {teams && teams.length > 0 ? (
            <div className="space-y-2">
              {teams.map((team: Team) => (
                <Link key={team.id} href={`/teams/${team.id}`}>
                  <div className="p-2 border rounded shadow-sm cursor-pointer hover:bg-gray-100 flex justify-between items-center">
                    <span>{team.name}</span>
                    <ListDeleteButton onClick={(event) => handleDelete(team.id, event)} />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p>No teams found.</p>
          )}
        </>
      )}
    </div>
  )
}
