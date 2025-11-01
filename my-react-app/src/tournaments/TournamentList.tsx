import { useEffect, useState } from 'react'
import axios from 'axios'
import type { Tournament } from "../common/tournaments.ts"
import { Header } from "../components/Header.js"
import { ListCreateButton } from "../components/ListCreateButton.js"
import { ListDeleteButton } from "../components/ListDeleteButton.js"
import { InputField } from "../components/InputField.js"
import { ListSaveButton } from "../components/ListSaveButton.js"
import { ListCancelButton } from "../components/ListCancelButton.js"
import { Loading } from "../components/Loading.js"
import { DataList } from "../components/DataList.js"

export default function TournamentList() {
  const [tournaments, setTournaments] = useState<Tournament[] | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
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

  const handleCreate = async (onCancel: () => void) => {
    if (!newTournamentName.trim() || !newTournamentYear.trim()) {
      alert("Tournament name and year cannot be empty.")
      return
    }
    try {
      const response = await axios.post<Tournament>('http://localhost:8080/api/v2/tournaments', { name: newTournamentName, year: newTournamentYear })
      setTournaments(currentTournaments => [...(currentTournaments || []), response.data])
      setNewTournamentName("")
      setNewTournamentYear("")
      onCancel()
    } catch (err) {
      setError('Failed to create tournament')
    }
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

      <Loading loading={loading} error={error} />

      {!loading && !error && (
        <>
          <ListCreateButton buttonText="Create Tournament">
            {(onCancel) => (
              <div className="p-4 border rounded bg-gray-50 flex items-center gap-2">
                <InputField
                  value={newTournamentName}
                  onChange={(e) => setNewTournamentName(e.target.value)}
                  placeholder="New tournament name"
                  className="w-full"
                />
                <InputField
                  value={newTournamentYear}
                  onChange={(e) => setNewTournamentYear(e.target.value)}
                  placeholder="Year"
                  className="w-1/4"
                />
                <ListSaveButton onClick={() => handleCreate(onCancel)} />
                <ListCancelButton onClick={onCancel} />
              </div>
            )}
          </ListCreateButton>

          <DataList<Tournament>
            items={tournaments}
            getItemUrl={(tournament) => `/tournaments/${tournament.id}`}
            noItemsText="No tournaments found."
            renderItem={(tournament) => (
              <div className="flex justify-between items-center">
                <div className="flex gap-4">
                  <span>{tournament.name}</span>
                  <span>{tournament.year}</span>
                </div>
                <ListDeleteButton onClick={(event) => handleDelete(tournament.id, event)} />
              </div>
            )}
          />
        </>
      )}
    </div>
  )
}
