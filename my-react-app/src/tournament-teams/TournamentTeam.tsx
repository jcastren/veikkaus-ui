import { useState, useEffect } from 'react'
import axios from 'axios'
import { Link, useRoute, useLocation } from 'wouter'
import type { Tournament } from "../common/tournaments.ts"
import type { Team } from "../common/teams.js"
import { CrudButtons } from "../components/CrudButtons.js"
import { Loading } from "../components/Loading.js"

// Define the shape of the TournamentTeam object
interface TournamentTeam {
  id: number
  tournament: Tournament
  team: Team
}

export default function TournamentTeam() {
  const [tournamentTeam, setTournamentTeam] = useState<TournamentTeam | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  // State for dropdowns
  const [allTournaments, setAllTournaments] = useState<Tournament[]>([])
  const [allTeams, setAllTeams] = useState<Team[]>([])
  const [editedTournamentId, setEditedTournamentId] = useState<string>("")
  const [editedTeamId, setEditedTeamId] = useState<string>("")

  const [, params] = useRoute("/tournament-teams/:id")
  const [, setLocation] = useLocation()

  useEffect(() => {
    const fetchData = async () => {
      if (!params?.id) return
      setLoading(true)
      try {
        // Fetch all data in parallel
        const [ttRes, tournamentsRes, teamsRes] = await Promise.all([
          axios.get<TournamentTeam>(`http://localhost:8080/api/v2/tournament-teams/${params.id}`),
          axios.get<Tournament[]>('http://localhost:8080/api/v2/tournaments'),
          axios.get<Team[]>('http://localhost:8080/api/v2/teams'),
        ])

        setTournamentTeam(ttRes.data)
        setAllTournaments(tournamentsRes.data)
        setAllTeams(teamsRes.data)

        // Initialize edit state
        setEditedTournamentId(ttRes.data.tournament.id.toString())
        setEditedTeamId(ttRes.data.team.id.toString())

      } catch (err) {
        if (axios.isAxiosError(err) && err.response?.status === 404) {
          setError("Tournament-Team association not found.")
        } else {
          setError("An unexpected error occurred while fetching data.")
        }
      } finally {
        setLoading(false)
      }
    }
    void fetchData()
  }, [params?.id])

  const handleSave = async () => {
    if (!tournamentTeam || !editedTournamentId || !editedTeamId) return

    try {
      const updatedData = {
        id: tournamentTeam.id,
        tournament: { id: parseInt(editedTournamentId, 10) },
        team: { id: parseInt(editedTeamId, 10) },
      }

      const response = await axios.put<TournamentTeam>(`http://localhost:8080/api/v2/tournament-teams/${tournamentTeam.id}`, updatedData)
      
      setTournamentTeam(response.data)
      setIsEditing(false)
    } catch (err) {
      setError('Failed to save changes')
    }
  }

  const handleCancel = () => {
    if (tournamentTeam) {
      setEditedTournamentId(tournamentTeam.tournament.id.toString())
      setEditedTeamId(tournamentTeam.team.id.toString())
    }
    setIsEditing(false)
  }

  const handleDelete = async () => {
    if (!tournamentTeam) return

    if (window.confirm("Are you sure you want to remove this team from the tournament?")) {
      try {
        await axios.delete(`http://localhost:8080/api/v2/tournament-teams/${tournamentTeam.id}`)
        setLocation("/tournament-teams")
      } catch (err) {
        setError('Failed to delete the association')
      }
    }
  }

  if (loading || !tournamentTeam) {
    return <Loading loading={loading} error={error} />
  }

  if (error) {
    return (
      <div className="p-4">
        <p className="text-red-500">Error: {error}</p>
        <Link href="/tournament-teams" className="text-blue-500 hover:underline mt-8 block">&larr; Back to List</Link>
      </div>
    )
  }

  return (
    <div className="p-4">
      <div className="flex flex-col space-y-4 text-left">
        {isEditing ? (
          <>
            <div className="flex items-center gap-2">
              <span className="font-bold w-28">Tournament:</span>
              <select value={editedTournamentId} onChange={(e) => setEditedTournamentId(e.target.value)} className="p-2 border rounded w-full">
                {allTournaments.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold w-28">Team:</span>
              <select value={editedTeamId} onChange={(e) => setEditedTeamId(e.target.value)} className="p-2 border rounded w-full">
                {allTeams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
          </>
        ) : (
          <>
            <p><span className="font-bold">Tournament:</span> {tournamentTeam.tournament.name}</p>
            <p><span className="font-bold">Team:</span> {tournamentTeam.team.name}</p>
          </>
        )}
      </div>

      <CrudButtons
        isEditing={isEditing}
        onEdit={() => setIsEditing(true)}
        onSave={handleSave}
        onCancel={handleCancel}
        onDelete={handleDelete}
      />

      <div className="mt-8">
        <Link href="/tournament-teams" className="text-blue-500 hover:underline">&larr; Back to List</Link>
      </div>
    </div>
  )
}
