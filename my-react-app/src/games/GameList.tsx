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
import type { Tournament } from "../common/tournaments.js"
import type { Game } from "../common/games.js"
import { InputField } from "../components/InputField.js"

const listHeaders: HeaderType[] = [
  { text: "Tournament", className: "w-1/6" },
  { text: "Home team", className: "w-1/6" },
  { text: "Away team", className: "w-1/6" },
  { text: "Home score", className: "w-1/6" },
  { text: "Away score", className: "w-1/6" },
  { text: "Date", className: "w-1/6" },
]

export default function GameList() {
  const { items: games, loading, error, createItem, deleteItem } = useCrudList<Game>('http://localhost:8080/api/v2/games')
  const [, setLocation] = useLocation()

  const [allTournaments, setAllTournaments] = useState<Tournament[]>([])
  const [allTournamentTeams, setAllTournamentTeams] = useState<TournamentTeam[]>([])
  const [allGames, setAllGames] = useState<Game[]>([])
  const [selectedHomeTeamId, setSelectedHomeTeamId] = useState<string>("")
  const [selectedAwayTeamId, setSelectedAwayTeamId] = useState<string>("")
  const [homeScore, setHomeScore] = useState<number>(0)
  const [awayScore, setAwayScore] = useState<number>(0)

  const [filterTournamentId, setFilterTournamentId] = useState<string>("")
  const [filterHomeTeamId, setFilterHomeTeamId] = useState<string>("")
  const [filterAwayTeamId, setFilterAwayTeamId] = useState<string>("")

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const [tournaments, tournamentTeams, games] = await Promise.all([
          axios.get<Tournament[]>('http://localhost:8080/api/v2/tournaments'),
          axios.get<TournamentTeam[]>('http://localhost:8080/api/v2/tournament-teams'),
          axios.get<TournamentTeam[]>('http://localhost:8080/api/v2/games')
        ])
        setAllTournaments(tournaments.data)
        setAllTournamentTeams(tournamentTeams.data)
        setAllGames(games.data)
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
    if (!selectedHomeTeamId || !selectedAwayTeamId) {
      alert("Please select a tournament, home team and away team.")
      return
    }

    const newItem = {
      homeTeam: { id: parseInt(selectedHomeTeamId, 10) },
      awayTeam: { id: parseInt(selectedAwayTeamId, 10) },
    }

    await createItem(newItem as Omit<Game, 'id'>)
    
    setSelectedHomeTeamId("")
    setSelectedAwayTeamId("")
    onCancel()
  }

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to remove this game from the tournament?")) {
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
      <Header header="Games" />

      <Loading loading={loading} error={error} />

      {!loading && (
        <>
          <ListCreateButton buttonText="Add Game to Tournament">
            {(onCancel) => (
              <div className="p-4 border rounded bg-gray-50 flex items-center gap-2">
                <select
                  value={selectedHomeTeamId}
                  onChange={(e) => setSelectedHomeTeamId(e.target.value)}
                  className="p-2 border rounded w-full"
                >
                  <option value="" disabled>Select a home team</option>
                  {allTournamentTeams.map(t => <option key={t.id} value={t.id}>{t.tournament.name} {t.team.name}</option>)}
                </select>

                <select
                  value={selectedAwayTeamId}
                  onChange={(e) => setSelectedAwayTeamId(e.target.value)}
                  className="p-2 border rounded w-full"
                >
                  <option value="" disabled>Select an away team</option>
                  {allTournamentTeams.map(t => <option key={t.id} value={t.id}>{t.tournament.name} {t.team.name}</option>)}
                </select>

                <InputField
                  value={newHomeScore}
                  onChange={(e) => setHomeScore(e.target.value)}
                  placeholder="New home score"
                  className="w-full"
                />

                <InputField
                  value={newAwayScore}
                  onChange={(e) => setAwayScore(e.target.value)}
                  placeholder="New away score"
                  className="w-full"
                />

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
                  setFilterHomeTeamId("") // Reset the second dropdown when the first one changes
                  setFilterAwayTeamId("") // Reset the second dropdown when the first one changes
                }}
                className="p-2 border rounded"
              >
                <option value="">All tournaments</option>
                {allTournaments.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="home-team-filter" className="mr-2 font-bold text-gray-700">Filter by home team:</label>
              <select
                id="home-team-filter"
                value={filterHomeTeamId}
                onChange={(e) => setFilterHomeTeamId(e.target.value)}
                className="p-2 border rounded"
              >
                <option value="">All home teams</option>
                {/* --- The Fix: Use the new derived list --- */}
                {availableTournamentTeams.map(t => <option key={t.id} value={t.id}>{t.team.name}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="away-team-filter" className="mr-2 font-bold text-gray-700">Filter by away team:</label>
              <select
                id="away-team-filter"
                value={filterAwayTeamId}
                onChange={(e) => setFilterAwayTeamId(e.target.value)}
                className="p-2 border rounded"
              >
                <option value="">All away teams</option>
                {/* --- The Fix: Use the new derived list --- */}
                {availableTournamentTeams.map(t => <option key={t.id} value={t.id}>{t.team.name}</option>)}
              </select>
            </div>
          </div>

          <table className="min-w-full divide-y divide-gray-200 mt-4 table-fixed">
            <ListHeaderRow headers={listHeaders} actionsHeaderText="Actions" />
            <DataList<Game>
              items={processedList}
              noItemsText="No games have been added to tournament yet."
              renderItem={(item) => (
                <tr key={item.id} className="hover:bg-gray-50 text-left cursor-pointer" onClick={() => setLocation(`/games/${item.id}`)}>
                  <td className="p-2 whitespace-nowrap">{item.tournament.name} {item.tournament.year}</td>
                  <td className="p-2 whitespace-nowrap">{item.homeTeam.team.name}</td>
                  <td className="p-2 whitespace-nowrap">{item.awayTeam.team.name}</td>
                  <td className="p-2 whitespace-nowrap">{item.homeScore}</td>
                  <td className="p-2 whitespace-nowrap">{item.awayScore}</td>
                  <td className="p-2 whitespace-nowrap">{item.gameDate.toLocaleDateString()}</td>
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
