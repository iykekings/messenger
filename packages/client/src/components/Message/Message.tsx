import './Message.scss';

import { formatDistance } from 'date-fns';
import { h } from 'preact';

import { MessageProps } from '../../interfaces';

function from(date: Date) {
  return formatDistance(new Date(), date, { includeSeconds: true });
}
const Message = (props: MessageProps) => {
  if (props.type === 'disconnect') {
    return (
      <article className='chat-message notification'>
        <span className='left'>{props.sender} left</span>
      </article>
    );
  }

  if (props.type === 'join') {
    return (
      <article className='chat-message notification'>
        <span className='left'>{props.sender} joined</span>
      </article>
    );
  }

  return (
    <article
      className={props.sameUser ? 'chat-message same-user' : 'chat-message'}
    >
      <div
        className={
          props.sameUser ? 'message-container same-user' : 'message-container'
        }
      >
        <span className='chat-message-sender'>{props.sender}</span>
        <p className='chat-message-body'>{props.message}</p>
        <span className='chat-message-time'> {from(props.time)}</span>
      </div>
    </article>
  );
};

export default Message;
