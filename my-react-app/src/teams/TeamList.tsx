import React, { useEffect, useState } from 'react'
import axios from 'axios'
import type { Team } from "../common/teams.js"

const TeamList: React.FC = () => {
  const [teams, setTeams] = useState<Team[] | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  console.log('TeamList component')

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await axios.get<Team[]>('http://localhost:8080/api/v2/teams')
        setTeams(response.data)
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

    fetchTeams()
  }, []) // The empty array ensures this runs only once on component mount

  if (loading) {
    return <p>Loading teams...</p>
  }

  if (error) {
    return <p>Error fetching teams: {error}</p>
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Teams</h1>

      {/* Render a list if teams exist and the array is not empty */}
      {teams && teams && teams.length > 0 ? (
        <ul className="space-y-2">
          {/* Map over the teams array to create list items */}
          {teams.map((team: Team) => (
            <li key={team.id} className="p-2 border rounded shadow-sm">
              {team.name}
            </li>
          ))}
        </ul>
      ) : (
        // Render a message if there are no teams
        <p>No teams found.</p>
      )}
    </div>
  )
}

export default TeamList
