import { useState } from 'react'
import { useLocation } from 'wouter'
import type { Tournament } from "../common/tournaments.ts"
import { Header } from "../components/Header.js"
import { ListCreateButton } from "../components/ListCreateButton.js"
import { ListDeleteButton } from "../components/ListDeleteButton.js"
import { InputField } from "../components/InputField.js"
import { ListSaveButton } from "../components/ListSaveButton.js"
import { ListCancelButton } from "../components/ListCancelButton.js"
import { Loading } from "../components/Loading.js"
import { DataList } from "../components/DataList.js"
import { ListHeaderRow, type Header as HeaderType } from "../components/ListHeaderRow.js"
import { useCrudList } from "../hooks/useCrudList.js"

const listHeaders: HeaderType[] = [
  { text: "Name", className: "w-1/2" },
  { text: "Year", className: "w-1/2" },
]

export default function TournamentList() {
  const { items: tournaments, loading, error, createItem, deleteItem } = useCrudList<Tournament>('http://localhost:8080/api/v2/tournaments')
  const [newTournamentName, setNewTournamentName] = useState("")
  const [newTournamentYear, setNewTournamentYear] = useState("")
  const [, setLocation] = useLocation()

  const handleCreate = async (onCancel: () => void) => {
    if (!newTournamentName.trim() || !newTournamentYear.trim()) {
      alert("Tournament name and year cannot be empty.")
      return
    }
    // --- The Fix: Convert year to a number before sending ---
    await createItem({ name: newTournamentName, year: parseInt(newTournamentYear, 10) })
    setNewTournamentName("")
    setNewTournamentYear("")
    onCancel()
  }

  const handleDelete = async (tournamentId: number) => {
    if (window.confirm("Are you sure you want to delete this tournament?")) {
      await deleteItem(tournamentId)
    }
  }

  return (
    <div className="p-4">
      <Header header="Tournaments" />

      <Loading loading={loading} error={error} />

      {!loading && (
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
                  type="number" // Use number type for better UX
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

          <table className="min-w-full divide-y divide-gray-200 mt-4 table-fixed">
            <ListHeaderRow headers={listHeaders} actionsHeaderText="Actions" />
            <DataList<Tournament>
              items={tournaments}
              noItemsText="No tournaments found."
              renderItem={(tournament) => (
                <tr key={tournament.id} className="hover:bg-gray-50 text-left cursor-pointer" onClick={() => setLocation(`/tournaments/${tournament.id}`)}>
                  <td className="p-2 whitespace-nowrap">{tournament.name}</td>
                  <td className="p-2 whitespace-nowrap">{tournament.year}</td>
                  <td className="p-2 whitespace-nowrap">
                    <ListDeleteButton onClick={(e) => { e.stopPropagation(); handleDelete(tournament.id); }} />
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
