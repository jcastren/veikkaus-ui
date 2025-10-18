import { Route } from 'wouter';
import './App.css';
import NavigationBar from './navigation/NavigationBar';
import TournamentList from './tournaments/TournamentList';
import TeamList from "./teams/TeamList.js";

function App() {
  return (
    <div>
      <NavigationBar />
      <Route path="/tournaments" component={TournamentList} />
      <Route path="/teams" component={TeamList} />
    </div>
  );
}

export default App;
