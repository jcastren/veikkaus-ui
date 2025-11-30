import { Link } from 'wouter'

export default function NavigationBar() {
  return (
    <nav className="bg-gray-100 p-4">
      <ul className="flex space-x-4">
        <li><Link href="/tournaments" className="navigation_item">Tournaments</Link></li>
        <li><Link href="/teams" className="navigation_item">Teams</Link></li>
        <li><Link href="/tournament-teams" className="navigation_item">Tournament Teams</Link></li>
        <li><Link href="/players" className="navigation_item">Players</Link></li>
        <li><Link href="/tournament-players" className="navigation_item">Tournament Players</Link></li>
      </ul>
    </nav>
  )
}
