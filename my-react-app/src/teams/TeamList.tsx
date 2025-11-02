import { useEffect, useState } from 'react'
import axios from 'axios'
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

const listHeaders: HeaderType[] = [
  { text: "Name", className: "w-full" },
]

export default function TeamList() {
  const [teams, setTeams] = useState<Team[] | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [newTeamName, setNewTeamName] = useState("")
  const [, setLocation] = useLocation()

  const fetchTeams = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await axios.get<Team[]>('http://localhost:8080/api/v2/teams')
      setTeams(response.data)
    } catch (err) {
      setError('Failed to fetch teams')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void fetchTeams()
  }, [])

  const handleCreate = async (onCancel: () => void) => {
    if (!newTeamName.trim()) {
      alert("Team name cannot be empty.")
      return
    }
    try {
      const response = await axios.post<Team>('http://localhost:8080/api/v2/teams', { name: newTeamName })
      setTeams(currentTeams => [...(currentTeams || []), response.data])
      setNewTeamName("")
      onCancel()
    } catch (err) {
      setError('Failed to create team')
    }
  }

  const handleDelete = async (teamId: number) => {
    if (!window.confirm("Are you sure you want to delete this team?")) {
      return
    }

    const originalTeams = teams
    setTeams(currentTeams => currentTeams?.filter(team => team.id !== teamId) || null)

    try {
      await axios.delete(`http://localhost:8080/api/v2/teams/${teamId}`)
    } catch (err) {
      setError('Failed to delete team. Please try again.')
      setTeams(originalTeams)
    }
  }

  return (
    <div className="p-4">
      <Header header="Teams" />

      <Loading loading={loading} error={error} />

      {!loading && !error && (
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
