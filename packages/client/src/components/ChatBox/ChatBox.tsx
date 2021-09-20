import './ChatBox.scss';

import { h } from 'preact';
import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'preact/hooks';
import { IoIosSend } from 'react-icons/io';

import { useSocket } from '../../hooks';
import Message from '../Message/Message';
import UserList from '../UserList/UserList';

const ChatBox = () => {
  const { messages, join, sendMessageToUser, users, auth } = useSocket();
  const [currentChatId, setCurrentChatId] = useState<string>(users[0]?.name);

  const chatMessages = useMemo(() => {
    return messages.filter(
      (m) => m.from === currentChatId || m.to === currentChatId
    );
  }, [messages, currentChatId]);

  const usersList = useMemo(() => {
    if (!auth.uuid) return [];
    return users.filter((u) => u.uuid !== auth.uuid);
  }, [users, auth]);

  const spacer = useRef<HTMLDivElement>(null);
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [hide, setHide] = useState(false);

  useEffect(() => {
    spacer.current?.scrollIntoView();
  }, [messages]);

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    if (!auth.uuid) {
      join(name);
    } else if (currentChatId) {
      sendMessageToUser({ message: text, sender: name }, currentChatId);
      spacer.current?.scrollIntoView();
      setText("");
    }
  };
  return (
    <main id="chatview">
      <aside>
        <h3>Contacts</h3>
        <UserList
          activeChatId={currentChatId}
          users={usersList}
          changeChat={(id) => setCurrentChatId(id)}
        />
      </aside>
      <div id="chatbox">
        <div className="chatbox-messages">
          {chatMessages.map((m, i) => (
            <Message {...m} sameUser={m.from === auth.uuid} key={i} />
          ))}
          <div className="chat-spacer" ref={spacer}></div>
        </div>
        <form onSubmit={handleSubmit} id="chat-form">
          <input
            type="text"
            style={{ display: auth.uuid ? "none" : "block" }}
            id="name-input"
            placeholder="Enter name to start chatting"
            value={name}
            onChange={(e) => setName(e.currentTarget.value)}
          />
          {auth.uuid && currentChatId && (
            <textarea
              id="chat-input"
              rows={3}
              placeholder="Type message and click send"
              value={text}
              onChange={(e) => setText(e.currentTarget.value)}
            />
          )}
          {((auth.uuid && currentChatId) || !auth.uuid) && (
            <button type="submit" className="submit-btn">
              <IoIosSend fontSize="2rem" />
            </button>
          )}
        </form>
      </div>
    </main>
  );
};

export default ChatBox;
