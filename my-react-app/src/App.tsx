import { Route } from 'wouter'
import './App.css'
import NavigationBar from './navigation/NavigationBar'
import TournamentList from './tournaments/TournamentList'
import TeamList from "./teams/TeamList"
import Team from "./teams/Team"
import Tournament from "./tournaments/Tournament"
import TournamentTeamList from "./tournamentteams/TournamentTeamList.js"
import TournamentTeam from "./tournamentteams/TournamentTeam.js"
import PlayerList from "./players/PlayerList.js"
import Player from "./players/Player.js"

function App() {
  return (
    <div>
      <NavigationBar />
      <Route path="/tournaments" component={TournamentList} />
      <Route path="/teams" component={TeamList} />
      <Route path="/tournament-teams" component={TournamentTeamList} />
      <Route path="/players" component={PlayerList} />
      <Route path="/tournaments/:id" component={Tournament} />
      <Route path="/teams/:id" component={Team} />
      <Route path="/tournament-teams/:id" component={TournamentTeam} />
      <Route path="/players/:id" component={Player} />
    </div>
  )
}

export default App
