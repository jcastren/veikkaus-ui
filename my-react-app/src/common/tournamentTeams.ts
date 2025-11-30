import type { Tournament } from "./tournaments.js"
import type { Team } from "./teams.js"

export type TournamentTeam = {
  id: number,
  tournament: Tournament
  team: Team
}