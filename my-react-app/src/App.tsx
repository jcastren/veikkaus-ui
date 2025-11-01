import { Route } from 'wouter'
import './App.css'
import NavigationBar from './navigation/NavigationBar'
import TournamentList from './tournaments/TournamentList'
import TeamList from "./teams/TeamList"
import Team from "./teams/Team"
import Tournament from "./tournaments/Tournament"

function App() {
  return (
    <div>
      <NavigationBar />
      <Route path="/tournaments" component={TournamentList} />
      <Route path="/teams" component={TeamList} />
      <Route path="/tournaments/:id" component={Tournament} />
      <Route path="/teams/:id" component={Team} />
    </div>
  )
}

export default App
