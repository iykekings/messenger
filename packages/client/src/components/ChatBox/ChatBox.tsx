import './ChatBox.scss';

import { h } from 'preact';
import {
  useEffect,
  useRef,
  useState,
} from 'preact/hooks';
import { IoIosSend } from 'react-icons/io';

import { ChatType } from '../../../../shared';
import { useSocket } from '../../hooks';
import { MessageProps } from '../../interfaces';
import Message from '../Message/Message';

const ChatBox = () => {
  const socket = useSocket();
  const [messages, setMessages] = useState<MessageProps[]>([]);
  const [name, setName] = useState("");
  function updateMessage(msg: MessageProps) {
    setMessages((pre) => [
      ...pre,
      {
        ...msg,
        time: new Date(msg.time),
      },
    ]);
  }
  useEffect(() => {
    socket.on(ChatType.SEND_MESSAGE, (msg: MessageProps) => {
      updateMessage(msg);
      spacer.current?.scrollIntoView();
    });
    socket.on(ChatType.USER_LEAVE_CHAT, (msg: MessageProps) => {
      updateMessage({
        ...msg,
        message: "",
        type: "disconnect",
      });
      spacer.current?.scrollIntoView();
    });

    socket.on(ChatType.USER_JOIN, (msg: MessageProps) => {
      updateMessage({
        ...msg,
        message: "",
        type: "join",
      });
      spacer.current?.scrollIntoView();
    });
  }, []);

  const [text, setText] = useState("");
  const [hide, setHide] = useState(false);

  const spacer = useRef<HTMLDivElement>();
  const handleSubmit = (e: Event) => {
    e.preventDefault();
    if (!hide) {
      setHide(true);
      socket.emit(ChatType.USER_JOIN, name);
    } else {
      socket.emit(ChatType.SEND_MESSAGE, { message: text, sender: name });
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
