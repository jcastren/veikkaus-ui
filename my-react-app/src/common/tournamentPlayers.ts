import type { TournamentTeam } from "./tournamentTeams.js"
import type { Player } from "./players.js"

export type TournamentPlayer = {
  id: number,
  tournamentTeam: TournamentTeam
  player: Player
}