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

const listHeaders: HeaderType[] = [
  { text: "Tournament team", className: "w-1/2" },
  { text: "Player", className: "w-1/2" },
]

export default function TournamentPlayerList() {
  const { items: tournamentPlayers, loading, error, createItem, deleteItem } = useCrudList<TournamentPlayer>('http://localhost:8080/api/v2/tournament-players')
  const [, setLocation] = useLocation()

  const [allTournamentTeams, setAllTournamentTeams] = useState<TournamentTeam[]>([])
  const [allPlayers, setAllPlayers] = useState<Player[]>([])
  const [selectedTournamentTeamId, setSelectedTournamentTeamId] = useState<string>("")
  const [selectedPlayerId, setSelectedPlayerId] = useState<string>("")

  const [filterTournamentTeamId, setFilterTournamentTeamId] = useState<string>("")

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const [tournamentTeamsRes, playersRes] = await Promise.all([
          axios.get<TournamentTeam[]>('http://localhost:8080/api/v2/tournament-teams'),
          axios.get<Player[]>('http://localhost:8080/api/v2/players'),
        ])
        setAllTournamentTeams(tournamentTeamsRes.data)
        setAllPlayers(playersRes.data)
      } catch (err) {
        console.error("Failed to fetch data for dropdowns", err)
      }
    }
    void fetchDropdownData()
  }, [])

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

    const filtered = filterTournamentTeamId
      // --- The Fix: Compare numbers to numbers now that the API is consistent ---
      ? tournamentPlayers.filter(item => item.tournamentTeam.id === parseInt(filterTournamentTeamId, 10))
      : tournamentPlayers

    return [...filtered].sort((a, b) => {
      const tournamentTeamNameComparison = a.tournamentTeam.team.name.localeCompare(b.tournamentTeam.team.name)
      if (tournamentTeamNameComparison !== 0) {
        return tournamentTeamNameComparison
      }
      return a.tournamentTeam.tournament.name.localeCompare(b.tournamentTeam.tournament.name)
    })
  }, [tournamentPlayers, filterTournamentTeamId])

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
                  value={selectedTournamentTeamId}
                  onChange={(e) => setSelectedPlayerId(e.target.value)}
                  className="p-2 border rounded w-full"
                >
                  <option value="" disabled>Select a player</option>
                  {allPlayers.map(t => <option key={t.id} value={t.id}>{t.firstName} - {t.lastName}</option>)}
                </select>

                <ListSaveButton onClick={() => handleCreate(onCancel)} />
                <ListCancelButton onClick={onCancel} />
              </div>
            )}
          </ListCreateButton>

          <div className="mt-4 mb-2">
            <label htmlFor="tournament-team-filter" className="mr-2 font-bold text-gray-700">Filter by tournament team:</label>
            <select
              id="tournament-team-filter"
              value={filterTournamentTeamId}
              onChange={(e) => setFilterTournamentTeamId(e.target.value)}
              className="p-2 border rounded"
            >
              <option value="">All tournament teams</option>
              {allTournamentTeams.map(t => <option key={t.id} value={t.id}>{t.tournament.name}</option>)}
            </select>
          </div>

          <table className="min-w-full divide-y divide-gray-200 mt-4 table-fixed">
            <ListHeaderRow headers={listHeaders} actionsHeaderText="Actions" />
            <DataList<TournamentPlayer>
              items={processedList}
              noItemsText="No players have been added to tournament teams yet."
              renderItem={(item) => (
                <tr key={item.id} className="hover:bg-gray-50 text-left cursor-pointer" onClick={() => setLocation(`/tournament-players/${item.id}`)}>
                  <td className="p-2 whitespace-nowrap">{item.tournamentTeam.tournament.name}-{item.tournamentTeam.tournament.year}</td>
                  <td className="p-2 whitespace-nowrap">{item.player.firstName}-{item.player.lastName}</td>
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
