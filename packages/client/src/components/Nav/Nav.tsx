import './Nav.scss';

import { h } from 'preact';
import { Link } from 'preact-router/match';

export function Nav() {
  return (
    <nav class="main-navbar">
      <h2>
        <Link activeClassName="active" href="/">
          <i>Cognite</i> Messenger
        </Link>
      </h2>
      <ul>
        <li>
          <Link activeClassName="active" href="/">
            Chat
          </Link>
        </li>
        <li>About</li>
        <li>Team</li>
        <li>Projects</li>
      </ul>
    </nav>
  );
}
