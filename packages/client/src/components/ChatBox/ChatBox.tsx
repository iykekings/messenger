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
  const {
    messages,
    join,
    sendMessageToUser,
    users,
    auth,
    typing,
    stopTyping,
    usersTyping,
  } = useSocket();
  const [currentChatId, setCurrentChatId] = useState<string>(users[0]?.uuid);

  const typingState = useMemo(() => {
    return usersTyping[currentChatId];
  }, [usersTyping, currentChatId]);

  const chatMessages = useMemo(() => {
    return messages.filter(
      (m) => m.from === currentChatId || m.to === currentChatId
    );
  }, [messages, currentChatId]);

  const currentChat = useMemo(() => {
    return users.find((u) => u.uuid === currentChatId);
  }, [currentChatId]);

  const usersList = useMemo(() => {
    if (!auth.uuid) return [];
    return users.filter((u) => u.uuid !== auth.uuid);
  }, [users, auth]);

  const spacer = useRef<HTMLDivElement>(null);
  const [name, setName] = useState("");
  const [text, setText] = useState("");

  useEffect(() => {
    spacer.current?.scrollIntoView();
  }, [messages]);

  useEffect(() => {
    if (!currentChatId) {
      setCurrentChatId(usersList[0]?.uuid);
    }
  }, [usersList]);

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
        {!usersList.length && (
          <p>
            <i>Contacts empty</i>
          </p>
        )}
        <UserList
          activeChatId={currentChatId}
          users={usersList}
          changeChat={(id) => setCurrentChatId(id)}
        />
      </aside>
      <div id="chatbox">
        {auth.uuid && (
          <h4>
            {currentChat
              ? `Chat with ${currentChat?.name}`
              : "No chat selected"}
          </h4>
        )}
        <div className="chatbox-messages">
          {chatMessages.map((m, i) => (
            <Message {...m} sameUser={m.from === auth.uuid} key={i} />
          ))}
          <div className="chat-spacer" ref={spacer}></div>
        </div>
        <div className="typing" style={{ marginLeft: "1rem" }}>
          {typingState && <i>{currentChat?.name} is typing </i>}
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
              onFocus={() => {
                typing(currentChatId);
              }}
              onBlur={() => stopTyping(currentChatId)}
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
