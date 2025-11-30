import { useState, useEffect, useMemo } from 'react'
import axios from 'axios'
import { useLocation } from 'wouter'
import type { Tournament } from "../common/tournaments.ts"
import type { Team } from "../common/teams.js"
import { Header } from "../components/Header.js"
import { ListCreateButton } from "../components/ListCreateButton.js"
import { ListDeleteButton } from "../components/ListDeleteButton.js"
import { ListSaveButton } from "../components/ListSaveButton.js"
import { ListCancelButton } from "../components/ListCancelButton.js"
import { Loading } from "../components/Loading.js"
import { DataList } from "../components/DataList.js"
import { ListHeaderRow, type Header as HeaderType } from "../components/ListHeaderRow.js"
import { useCrudList } from "../hooks/useCrudList.js"
import type { TournamentTeam } from "../common/tournamentTeams.js"

const listHeaders: HeaderType[] = [
  { text: "Tournament", className: "w-1/2" },
  { text: "Team", className: "w-1/2" },
]

export default function TournamentTeamList() {
  const { items: tournamentTeams, loading, error, createItem, deleteItem } = useCrudList<TournamentTeam>('http://localhost:8080/api/v2/tournament-teams')
  const [, setLocation] = useLocation()

  // State for the create form dropdowns
  const [allTournaments, setAllTournaments] = useState<Tournament[]>([])
  const [allTeams, setAllTeams] = useState<Team[]>([])
  const [selectedTournamentId, setSelectedTournamentId] = useState<string>("")
  const [selectedTeamId, setSelectedTeamId] = useState<string>("")

  const [filterTournamentId, setFilterTournamentId] = useState<string>("")

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const [tournamentsRes, teamsRes] = await Promise.all([
          axios.get<Tournament[]>('http://localhost:8080/api/v2/tournaments'),
          axios.get<Team[]>('http://localhost:8080/api/v2/teams'),
        ])
        setAllTournaments(tournamentsRes.data)
        setAllTeams(teamsRes.data)
      } catch (err) {
        console.error("Failed to fetch data for dropdowns", err)
      }
    }
    void fetchDropdownData()
  }, [])

  const handleCreate = async (onCancel: () => void) => {
    if (!selectedTournamentId || !selectedTeamId) {
      alert("Please select both a tournament and a team.")
      return
    }

    const newItem = {
      tournament: { id: parseInt(selectedTournamentId, 10) },
      team: { id: parseInt(selectedTeamId, 10) },
    }

    await createItem(newItem as Omit<TournamentTeam, 'id'>)
    
    setSelectedTournamentId("")
    setSelectedTeamId("")
    onCancel()
  }

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to remove this team from the tournament?")) {
      await deleteItem(id)
    }
  }

  const processedList = useMemo(() => {
    if (!tournamentTeams) return null

    const filtered = filterTournamentId
      // --- The Fix: Compare numbers to numbers now that the API is consistent ---
      ? tournamentTeams.filter(item => item.tournament.id === parseInt(filterTournamentId, 10))
      : tournamentTeams

    return [...filtered].sort((a, b) => {
      const tournamentNameComparison = a.tournament.name.localeCompare(b.tournament.name)
      if (tournamentNameComparison !== 0) {
        return tournamentNameComparison
      }
      return a.team.name.localeCompare(b.team.name)
    })
  }, [tournamentTeams, filterTournamentId])

  return (
    <div className="p-4">
      <Header header="Tournament Teams" />

      <Loading loading={loading} error={error} />

      {!loading && (
        <>
          <ListCreateButton buttonText="Add Team to Tournament">
            {(onCancel) => (
              <div className="p-4 border rounded bg-gray-50 flex items-center gap-2">
                <select
                  value={selectedTournamentId}
                  onChange={(e) => setSelectedTournamentId(e.target.value)}
                  className="p-2 border rounded w-full"
                >
                  <option value="" disabled>Select a Tournament</option>
                  {allTournaments.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>

                <select
                  value={selectedTeamId}
                  onChange={(e) => setSelectedTeamId(e.target.value)}
                  className="p-2 border rounded w-full"
                >
                  <option value="" disabled>Select a Team</option>
                  {allTeams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>

                <ListSaveButton onClick={() => handleCreate(onCancel)} />
                <ListCancelButton onClick={onCancel} />
              </div>
            )}
          </ListCreateButton>

          <div className="mt-4 mb-2">
            <label htmlFor="tournament-filter" className="mr-2 font-bold text-gray-700">Filter by Tournament:</label>
            <select
              id="tournament-filter"
              value={filterTournamentId}
              onChange={(e) => setFilterTournamentId(e.target.value)}
              className="p-2 border rounded"
            >
              <option value="">All Tournaments</option>
              {allTournaments.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>

          <table className="min-w-full divide-y divide-gray-200 mt-4 table-fixed">
            <ListHeaderRow headers={listHeaders} actionsHeaderText="Actions" />
            <DataList<TournamentTeam>
              items={processedList}
              noItemsText="No teams have been added to tournaments yet."
              renderItem={(item) => (
                <tr key={item.id} className="hover:bg-gray-50 text-left cursor-pointer" onClick={() => setLocation(`/tournament-teams/${item.id}`)}>
                  <td className="p-2 whitespace-nowrap">{item.tournament.name}</td>
                  <td className="p-2 whitespace-nowrap">{item.team.name}</td>
                  <td className="p-2 whitespace-nowrap text-right">
                    <ListDeleteButton onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }} />
                  </td>
                </tr>
              )}
            />
          </table>
        </>
      )}
    </div>
  )
}
