import type { TournamentTeam } from "./tournamentTeams.js"
import type { Tournament } from "./tournaments.js"

export type Game = {
  id: number,
  tournament: Tournament
  homeTeam: TournamentTeam
  awayTeam: TournamentTeam
  homeScore: number
  awayScore: number
  gameDate: Date
}