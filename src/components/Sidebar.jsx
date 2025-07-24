import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
 import {
  faHome,
  faWallet,
  faLightbulb,
  faHandshake,
  faBullseye,
  faUser,
  faEnvelope,
} from '@fortawesome/free-solid-svg-icons';
const Sidebar = () => {
  const [hover, setHover] = useState(false);

 
const links = [
  { to: '/budgeting', icon: faWallet, label: 'Budgeting' },
  { to: '/planning', icon: faLightbulb, label: 'Planning & Suggestions' },
  { to: '/goals', icon: faBullseye, label: 'Goals' },
  { to: '/inclusion', icon: faHandshake, label: 'Financial Inclusion' },
];

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="bg-white dark:bg-gray-800 border-r dark:border-gray-700 h-screen transition-all duration-300 overflow-hidden transition-all duration-300 h-full overflow-hidden"
      style={{ width: hover ? '240px' : '60px' }}
    >
      <div className="p-2 flex flex-col gap-2">
        {links.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center gap-3 p-2 rounded text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 ${
                isActive ? 'bg-blue-100 dark:bg-blue-600 font-semibold' : ''
              }`
            }
          >
            <FontAwesomeIcon icon={link.icon} />
            {hover && (
              <span className="whitespace-nowrap truncate">{link.label}</span>
            )}
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
