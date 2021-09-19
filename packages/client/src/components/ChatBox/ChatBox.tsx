import './ChatBox.scss';

import { h } from 'preact';
import {
  useEffect,
  useRef,
  useState,
} from 'preact/hooks';
import { IoIosSend } from 'react-icons/io';

import { ServerMessage } from '@chat/shared';

import { useSocket } from '../../hooks';
import Message from '../Message/Message';

const ChatBox = () => {
  const socket = useSocket();
  const spacer = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<ServerMessage[]>([]);
  const [name, setName] = useState("");

  const [text, setText] = useState("");
  const [hide, setHide] = useState(false);

  function updateMessages(msg: ServerMessage) {
    setMessages((pre) => [...pre, msg]);
  }

  useEffect(() => {
    socket.on("recieveMessage", (msg: ServerMessage) => {
      updateMessages(msg);
      spacer.current?.scrollIntoView();
    });
    socket.on("userLeft", (msg: ServerMessage) => {
      updateMessages(msg);
      spacer.current?.scrollIntoView();
    });

    socket.on("newUser", (msg: ServerMessage) => {
      updateMessages(msg);
      spacer.current?.scrollIntoView();
    });
  }, []);

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    if (!hide) {
      setHide(true);
      socket.emit("joinChat", name);
    } else {
      socket.emit("sendMessage", { message: text, sender: name });
      spacer.current?.scrollIntoView();
      setText("");
    }
  };
  return (
    <div id="chatbox">
      <h1 className="title">ChataBox</h1>
      <div className="chatbox-messages">
        {messages.map((m, i) => (
          <Message {...m} sameUser={m.sender === name} key={i} />
        ))}
        <div className="chat-spacer" ref={spacer}></div>
      </div>
      <form onSubmit={handleSubmit} id="chat-form">
        <input
          type="text"
          style={{ display: hide ? "none" : "block" }}
          id="name-input"
          placeholder="Enter name to start chatting"
          value={name}
          onChange={(e) => setName(e.currentTarget.value)}
        />
        {hide && (
          <textarea
            id="chat-input"
            rows={3}
            placeholder="Type message and click send"
            value={text}
            onChange={(e) => setText(e.currentTarget.value)}
          />
        )}
        <button type="submit" className="submit-btn">
          <IoIosSend fontSize="2rem" />
        </button>
      </form>
    </div>
  );
};

export default ChatBox;
