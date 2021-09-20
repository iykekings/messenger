import 'preact/debug';

import {
  h,
  render,
} from 'preact';
import { Router } from 'preact-router';

import { Nav } from './components/Nav/Nav';
import { SocketProvider } from './hooks';
import User from './pages/User';

const App = () => {
  return (
    <SocketProvider>
      <div
        style={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          width: "100%",
        }}
      >
        <Nav />
        <main
          className="container"
          style={{
            display: "flex",
            flex: 1,
            flexDirection: "column",
            color: "white",
            gap: "1rem",
            background: "linear-gradient(90deg, #4b6cb7 0%, #182848 100%)",
          }}
        >
          <Router>
            <User path="/" />
          </Router>
        </main>
      </div>
    </SocketProvider>
  );
};

render(<App />, document.getElementById("app")!);
