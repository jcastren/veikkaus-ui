import React from 'react';

const NavigationBar: React.FC = () => {
  return (
    <nav className="bg-gray-100 p-4">
      <ul className="flex space-x-4">
        <li><a href="/" className="navigation_item">Home</a></li>
        <li><a href="/tournaments" className="navigation_item">Tournaments</a></li>
        <li><a href="/teams" className="navigation_item">Teams</a></li>
      </ul>
    </nav>
  );
};

export default NavigationBar;
