import { useState, useEffect, useMemo } from 'react'
import axios from 'axios'
import { useLocation } from 'wouter'
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
import type { TournamentPlayer } from "../common/tournamentPlayers.js"
import type { Player } from "../common/players.js"
import type { Tournament } from "../common/tournaments.js"

const listHeaders: HeaderType[] = [
  { text: "Tournament team", className: "w-1/2" },
  { text: "Player", className: "w-1/2" },
]

export default function TournamentPlayerList() {
  const { items: tournamentPlayers, loading, error, createItem, deleteItem } = useCrudList<TournamentPlayer>('http://localhost:8080/api/v2/tournament-players')
  const [, setLocation] = useLocation()

  const [allTournaments, setAllTournaments] = useState<Tournament[]>([])
  const [allTournamentTeams, setAllTournamentTeams] = useState<TournamentTeam[]>([])
  const [allPlayers, setAllPlayers] = useState<Player[]>([])
  const [selectedTournamentTeamId, setSelectedTournamentTeamId] = useState<string>("")
  const [selectedPlayerId, setSelectedPlayerId] = useState<string>("")

  const [filterTournamentId, setFilterTournamentId] = useState<string>("")
  const [filterTournamentTeamId, setFilterTournamentTeamId] = useState<string>("")

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const [tournaments, tournamentTeams, players] = await Promise.all([
          axios.get<Tournament[]>('http://localhost:8080/api/v2/tournaments'),
          axios.get<TournamentTeam[]>('http://localhost:8080/api/v2/tournament-teams'),
          axios.get<Player[]>('http://localhost:8080/api/v2/players'),
        ])
        setAllTournaments(tournaments.data)
        setAllTournamentTeams(tournamentTeams.data)
        setAllPlayers(players.data)
      } catch (err) {
        console.error("Failed to fetch data for dropdowns", err)
      }
    }
    void fetchDropdownData()
  }, [])

  // --- New Derived State for the Dependent Dropdown ---
  const availableTournamentTeams = useMemo(() => {
    if (!filterTournamentId) {
      return allTournamentTeams // If no tournament is selected, show all teams
    }
    return allTournamentTeams.filter(tt => tt.tournament.id === parseInt(filterTournamentId, 10))
  }, [allTournamentTeams, filterTournamentId])

  const handleCreate = async (onCancel: () => void) => {
    if (!selectedTournamentTeamId || !selectedPlayerId) {
      alert("Please select both a tournament team and a player.")
      return
    }

    const newItem = {
      tournamentTeam: { id: parseInt(selectedTournamentTeamId, 10) },
      player: { id: parseInt(selectedPlayerId, 10) },
    }

    await createItem(newItem as Omit<TournamentPlayer, 'id'>)
    
    setSelectedTournamentTeamId("")
    setSelectedPlayerId("")
    onCancel()
  }

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to remove this tournament player from the tournament team?")) {
      await deleteItem(id)
    }
  }

  const processedList = useMemo(() => {
    if (!tournamentPlayers) return null

    let filteredList = tournamentPlayers

    // First, filter by the main tournament dropdown
    if (filterTournamentId) {
      filteredList = filteredList.filter(item => item.tournamentTeam.tournament.id === parseInt(filterTournamentId, 10))
    }

    // Then, filter by the tournament team dropdown
    if (filterTournamentTeamId) {
      filteredList = filteredList.filter(item => item.tournamentTeam.id === parseInt(filterTournamentTeamId, 10))
    }

    return [...filteredList].sort((a, b) => {
      const tournamentNameComparison = a.tournamentTeam.tournament.name.localeCompare(b.tournamentTeam.tournament.name)
      if (tournamentNameComparison !== 0) return tournamentNameComparison
      
      const teamNameComparison = a.tournamentTeam.team.name.localeCompare(b.tournamentTeam.team.name)
      if (teamNameComparison !== 0) return teamNameComparison

      return a.player.lastName.localeCompare(b.player.lastName)
    })
  }, [tournamentPlayers, filterTournamentId, filterTournamentTeamId])

  return (
    <div className="p-4">
      <Header header="Tournament Players" />

      <Loading loading={loading} error={error} />

      {!loading && (
        <>
          <ListCreateButton buttonText="Add Player to Tournament team">
            {(onCancel) => (
              <div className="p-4 border rounded bg-gray-50 flex items-center gap-2">
                <select
                  value={selectedTournamentTeamId}
                  onChange={(e) => setSelectedTournamentTeamId(e.target.value)}
                  className="p-2 border rounded w-full"
                >
                  <option value="" disabled>Select a tournament team</option>
                  {allTournamentTeams.map(t => <option key={t.id} value={t.id}>{t.tournament.name} - {t.team.name}</option>)}
                </select>

                <select
                  value={selectedPlayerId}
                  onChange={(e) => setSelectedPlayerId(e.target.value)}
                  className="p-2 border rounded w-full"
                >
                  <option value="" disabled>Select a player</option>
                  {allPlayers.map(t => <option key={t.id} value={t.id}>{t.firstName} {t.lastName}</option>)}
                </select>

                <ListSaveButton onClick={() => handleCreate(onCancel)} />
                <ListCancelButton onClick={onCancel} />
              </div>
            )}
          </ListCreateButton>

          <div className="mt-4 mb-2 flex items-center gap-4">
            <div>
              <label htmlFor="tournament-filter" className="mr-2 font-bold text-gray-700">Filter by tournament:</label>
              <select
                id="tournament-filter"
                value={filterTournamentId}
                onChange={(e) => {
                  setFilterTournamentId(e.target.value)
                  setFilterTournamentTeamId("") // Reset the second dropdown when the first one changes
                }}
                className="p-2 border rounded"
              >
                <option value="">All tournaments</option>
                {allTournaments.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="tournament-team-filter" className="mr-2 font-bold text-gray-700">Filter by tournament team:</label>
              <select
                id="tournament-team-filter"
                value={filterTournamentTeamId}
                onChange={(e) => setFilterTournamentTeamId(e.target.value)}
                className="p-2 border rounded"
              >
                <option value="">All tournament teams</option>
                {/* --- The Fix: Use the new derived list --- */}
                {availableTournamentTeams.map(t => <option key={t.id} value={t.id}>{t.team.name}</option>)}
              </select>
            </div>
          </div>

          <table className="min-w-full divide-y divide-gray-200 mt-4 table-fixed">
            <ListHeaderRow headers={listHeaders} actionsHeaderText="Actions" />
            <DataList<TournamentPlayer>
              items={processedList}
              noItemsText="No players have been added to tournament teams yet."
              renderItem={(item) => (
                <tr key={item.id} className="hover:bg-gray-50 text-left cursor-pointer" onClick={() => setLocation(`/tournament-players/${item.id}`)}>
                  <td className="p-2 whitespace-nowrap">{item.tournamentTeam.tournament.name} {item.tournamentTeam.team.name}</td>
                  <td className="p-2 whitespace-nowrap">{item.player.firstName} {item.player.lastName}</td>
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
