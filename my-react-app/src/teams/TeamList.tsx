import { useState } from 'react'
import { useLocation } from 'wouter'
import type { Team } from "../common/teams.js"
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
  { text: "Name", className: "w-full" },
]

export default function TeamList() {
  const { items: teams, loading, error, createItem, deleteItem } = useCrudList<Team>('http://localhost:8080/api/v2/teams')
  const [newTeamName, setNewTeamName] = useState("")
  const [, setLocation] = useLocation()

  const handleCreate = async (onCancel: () => void) => {
    if (!newTeamName.trim()) {
      alert("Team name cannot be empty.")
      return
    }
    await createItem({ name: newTeamName })
    setNewTeamName("")
    onCancel()
  }

  const handleDelete = async (teamId: number) => {
    if (window.confirm("Are you sure you want to delete this team?")) {
      await deleteItem(teamId)
    }
  }

  return (
    <div className="p-4">
      <Header header="Teams" />

      <Loading loading={loading} error={error} />

      {/* --- The Fix --- */}
      {/* The main content should only be hidden during the initial load. */}
      {!loading && (
        <>
          <ListCreateButton buttonText="Create Team">
            {(onCancel) => (
              <div className="p-4 border rounded bg-gray-50 flex items-center gap-2">
                <InputField
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                  placeholder="New team name"
                  className="w-full"
                />
                <ListSaveButton onClick={() => handleCreate(onCancel)} />
                <ListCancelButton onClick={onCancel} />
              </div>
            )}
          </ListCreateButton>

          <table className="min-w-full divide-y divide-gray-200 mt-4 table-fixed">
            <ListHeaderRow headers={listHeaders} actionsHeaderText="Actions" />
            <DataList<Team>
              items={teams}
              noItemsText="No teams found."
              renderItem={(team) => (
                <tr key={team.id} className="hover:bg-gray-50 text-left cursor-pointer" onClick={() => setLocation(`/teams/${team.id}`)}>
                  <td className="p-2 whitespace-nowrap">{team.name}</td>
                  <td className="p-2 whitespace-nowrap">
                    <ListDeleteButton onClick={(e) => { e.stopPropagation(); handleDelete(team.id); }} />
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
