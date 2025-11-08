import { useState } from 'react'
import { useLocation } from 'wouter'
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
import type { Player } from "../common/players.js"

const listHeaders: HeaderType[] = [
  { text: "First name", className: "w-1/2" },
  { text: "Last name", className: "w-1/2" },
]

export default function PlayerList() {
  const { items: players, loading, error, createItem, deleteItem } = useCrudList<Player>('http://localhost:8080/api/v2/players')
  const [newFirstName, setNewFirstName] = useState("")
  const [newLastName, setNewLastName] = useState("")
  const [, setLocation] = useLocation()

  const handleCreate = async (onCancel: () => void) => {
    if (!newFirstName.trim() || !newLastName.trim()) {
      alert("First name and last name must not be empty.")
      return
    }

    await createItem({ firstName: newFirstName, lastName: newLastName })
    setNewFirstName("")
    setNewLastName("")
    onCancel()
  }

  const handleDelete = async (playerId: number) => {
    if (window.confirm("Are you sure you want to delete this player?")) {
      await deleteItem(playerId)
    }
  }

  return (
    <div className="p-4">
      <Header header="Players" />

      <Loading loading={loading} error={error} />

      {!loading && (
        <>
          <ListCreateButton buttonText="Create Player">
            {(onCancel) => (
              <div className="p-4 border rounded bg-gray-50 flex items-center gap-2">
                <InputField
                  value={newFirstName}
                  onChange={(e) => setNewFirstName(e.target.value)}
                  placeholder="New first name"
                  className="w-full"
                />
                <InputField
                  value={newLastName}
                  onChange={(e) => setNewLastName(e.target.value)}
                  placeholder="New last name"
                  className="w-1/4"
                />
                <ListSaveButton onClick={() => handleCreate(onCancel)} />
                <ListCancelButton onClick={onCancel} />
              </div>
            )}
          </ListCreateButton>

          <table className="min-w-full divide-y divide-gray-200 mt-4 table-fixed">
            <ListHeaderRow headers={listHeaders} actionsHeaderText="Actions" />
            <DataList<Player>
              items={players}
              noItemsText="No players found."
              renderItem={(player) => (
                <tr key={player.id} className="hover:bg-gray-50 text-left cursor-pointer" onClick={() => setLocation(`/players/${player.id}`)}>
                  <td className="p-2 whitespace-nowrap">{player.firstName}</td>
                  <td className="p-2 whitespace-nowrap">{player.lastName}</td>
                  <td className="p-2 whitespace-nowrap">
                    <ListDeleteButton onClick={(e) => { e.stopPropagation(); handleDelete(player.id); }} />
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
