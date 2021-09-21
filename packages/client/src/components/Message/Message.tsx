import './Message.scss';

import { formatDistance } from 'date-fns';
import { h } from 'preact';
import {
  useEffect,
  useState,
} from 'preact/hooks';

import { ServerMessage } from '@chat/shared';

function fromTime(date: Date) {
  return formatDistance(new Date(), new Date(date), { includeSeconds: true });
}
const Message = (props: ServerMessage & { sameUser: boolean }) => {
  const [from, setFrom] = useState("now");

  useEffect(() => {
    const interval = setInterval(() => setFrom(fromTime(props.time)), 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  if (props.type === "disconnect") {
    return (
      <article className="chat-message notification">
        <span className="left">{props.sender} left</span>
      </article>
    );
  }

  if (props.type === "join") {
    return (
      <article className="chat-message notification">
        <span className="left">{props.sender} joined</span>
      </article>
    );
  }

  return (
    <article
      className={props.sameUser ? "chat-message same-user" : "chat-message"}
    >
      <div
        className={
          props.sameUser ? "message-container same-user" : "message-container"
        }
      >
        <span className="chat-message-sender">{props.sender}</span>
        <p className="chat-message-body">{props.message}</p>
        <span className="chat-message-time">{from}</span>
      </div>
    </article>
  );
};

export default Message;
