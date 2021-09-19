import './Admin.scss';

import {
  useEffect,
  useState,
} from 'react';

import { h } from 'preact';

import { ChatType } from '@chat/shared';

import StatelessChat from '../components/StatelessChat/StatelessChat';
import { useSocket } from '../hooks';
import { MessageProps } from '../interfaces';

interface User {
  id: string;
  name: string;
}
const Admin = () => {
  const socket = useSocket();
  const [users, setUsers] = useState<User[]>([]);
  const [active, setActive] = useState<User>({ id: "", name: "" });
  const [messages, setMessages] = useState<MessageProps[]>([]);
  const [name, setName] = useState("");
  const [auth, setAuth] = useState(false);

  const sendMessage = (id: string, message: string) => {
    socket.emit(ChatType.ADMIN_SEND_MESSAGE, { sender: name, to: id, message });
  };

  useEffect(() => {
    socket.on(ChatType.ALL_USERS, ({ users }: { users: User[] }) => {
      setUsers(users);
      if (!active.id && users.length) {
        setActive(users[0]);
      }
    });
    socket.on(ChatType.SEND_MESSAGE, (msg: MessageProps) => {
      const time = msg.time;
      if (time) {
        setMessages((pre) => [...pre, { ...msg, time: new Date(time) }]);
      }
    });

    socket.on(ChatType.USER_JOIN, (msg: MessageProps) => {
      if (msg.uuid) {
        setUsers((pre) => [
          ...pre,
          {
            name: msg.sender,
            // ts is not smart enough yet for this
            id: msg.uuid!,
          },
        ]);
      }
      console.log({ msg }, "user join");
      // socket.emit(ChatType.ADMIN_JOIN_CHAT, { id: msg.uuid, name });
    });

    socket.on(ChatType.USER_LEAVE_CHAT, (msg: MessageProps) => {
      setUsers((pre) => pre.filter((user) => user.id !== msg.uuid));
    });
  }, []);

  return (
    <div class="admin">
      {!auth && (
        <form
          className="admin-form"
          onSubmit={(e) => {
            e.preventDefault();
            socket.emit(ChatType.ADMIN_JOIN_CONNECTION, name);
            setAuth(true);
          }}
        >
          <input
            type="text"
            value={name}
            autoComplete="name"
            onChange={(e) => setName(e.currentTarget.value)}
          />
          <input type="submit" value="Login as Admin" />
        </form>
      )}
      {auth && (
        <aside>
          <ul class="side-menu">
            {users.map((user) => (
              <li
                key={user.id}
                onClick={() => setActive(user)}
                className={active.id === user.id ? "active" : ""}
              >
                {user.name}
              </li>
            ))}
          </ul>
        </aside>
      )}
      {auth && (
        <main>
          {users.map((user) => (
            <article
              key={user.id}
              style={{ display: active.id === user.id ? "block" : "none" }}
            >
              <StatelessChat
                adminName={name}
                messages={messages}
                user={user}
                sendMessage={sendMessage}
              />
            </article>
          ))}
        </main>
      )}
    </div>
  );
};

export default Admin;
