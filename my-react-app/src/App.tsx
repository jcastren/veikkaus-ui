import { Route } from 'wouter'
import './App.css'
import NavigationBar from './navigation/NavigationBar'
import TournamentList from './tournaments/TournamentList'
import TeamList from "./teams/TeamList"
import Team from "./teams/Team"
import Tournament from "./tournaments/Tournament"
import TournamentTeamList from "./tournament-teams/TournamentTeamList.js"
import TournamentTeam from "./tournament-teams/TournamentTeam.js"
import PlayerList from "./players/PlayerList.js"
import Player from "./players/Player.js"
import TournamentPlayerList from "./tournament-players/TournamentPlayerList.js"
import TournamentPlayer from "./tournament-players/TournamentPlayer.js"

function App() {
  return (
    <div>
      <NavigationBar />
      <Route path="/tournaments" component={TournamentList} />
      <Route path="/teams" component={TeamList} />
      <Route path="/tournament-teams" component={TournamentTeamList} />
      <Route path="/players" component={PlayerList} />
      <Route path="/tournament-players" component={TournamentPlayerList} />
      <Route path="/tournaments/:id" component={Tournament} />
      <Route path="/teams/:id" component={Team} />
      <Route path="/tournament-teams/:id" component={TournamentTeam} />
      <Route path="/players/:id" component={Player} />
      <Route path="/tournament-players/:id" component={TournamentPlayer} />
    </div>
  )
}

export default App
