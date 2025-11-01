import { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'wouter'
import type { Tournament } from "../common/tournaments.ts"
import { Header } from "../components/Header.js"
import { ListDeleteButton } from "../components/ListDeleteButton.js"

export default function TournamentList() {
  const [tournaments, setTournaments] = useState<Tournament[] | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [newTournamentName, setNewTournamentName] = useState("")
  const [newTournamentYear, setNewTournamentYear] = useState("")

  const fetchTournaments = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await axios.get<Tournament[]>('http://localhost:8080/api/v2/tournaments')
      setTournaments(response.data)
    } catch (err) {
      setError('Failed to fetch tournaments')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void fetchTournaments()
  }, [])

  const handleCreate = async () => {
    if (!newTournamentName.trim() || !newTournamentYear.trim()) {
      alert("Tournament name and year cannot be empty.")
      return
    }
    try {
      const response = await axios.post<Tournament>('http://localhost:8080/api/v2/tournaments', { name: newTournamentName, year: newTournamentYear })
      setTournaments(currentTournaments => [...(currentTournaments || []), response.data])
      setNewTournamentName("")
      setNewTournamentYear("")
      setIsCreating(false)
    } catch (err) {
      setError('Failed to create tournament')
    }
  }

  const handleCancelCreate = () => {
    setNewTournamentName("")
    setNewTournamentYear("")
    setIsCreating(false)
  }

  const handleDelete = async (tournamentId: number, event: React.MouseEvent) => {
    event.stopPropagation()
    event.preventDefault()

    if (!window.confirm("Are you sure you want to delete this tournament?")) {
      return
    }

    const originalTournaments = tournaments
    setTournaments(currentTournaments => currentTournaments?.filter(tournament => tournament.id !== tournamentId) || null)

    try {
      await axios.delete(`http://localhost:8080/api/v2/tournaments/${tournamentId}`)
    } catch (err) {
      setError('Failed to delete tournament. Please try again.')
      setTournaments(originalTournaments)
    }
  }

  return (
    <div className="p-4">
      <Header header="Tournaments" />
      {loading && <p>Loading tournaments...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}
      {!loading && !error && (
        <>
          <div className="mb-4">
            {!isCreating ? (
              <button onClick={() => setIsCreating(true)} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
                Create Tournament
              </button>
            ) : (
              <div className="p-4 border rounded bg-gray-50 flex items-center gap-2">
                <input
                  type="text"
                  value={newTournamentName}
                  onChange={(e) => setNewTournamentName(e.target.value)}
                  placeholder="New tournament name"
                  className="p-2 border rounded w-full"
                />
                <input
                  type="text"
                  value={newTournamentYear}
                  onChange={(e) => setNewTournamentYear(e.target.value)}
                  placeholder="Year"
                  className="p-2 border rounded w-1/4"
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

          {tournaments && tournaments.length > 0 ? (
            <div className="space-y-2">
              {tournaments.map((tournament: Tournament) => (
                <Link key={tournament.id} href={`/tournaments/${tournament.id}`}>
                  <div className="p-2 border rounded shadow-sm cursor-pointer hover:bg-gray-100 flex justify-between items-center">
                    <span>{tournament.name}</span>
                    <span>{tournament.year}</span>
                    <ListDeleteButton onClick={(event) => handleDelete(tournament.id, event)} />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p>No tournaments found.</p>
          )}
        </>
      )}
    </div>
  )
}
