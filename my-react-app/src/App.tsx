import { Route } from 'wouter'
import './App.css'
import NavigationBar from './navigation/NavigationBar'
import TournamentList from './tournaments/TournamentList'
import TeamList from "./teams/TeamList.js"
import Team from "./teams/Team.js" // Import the renamed component

function App() {
  return (
    <div>
      <NavigationBar />
      <Route path="/tournaments" component={TournamentList} />
      
      {/* Route for the list of teams */}
      <Route path="/teams" component={TeamList} />
      
      {/* New route for a single team's details. :id is a dynamic parameter */}
      <Route path="/teams/:id" component={Team} />
    </div>
  )
}

export default App
