import './StatelessChat.scss';

import { h } from 'preact';
import { useEffect, useRef, useState } from 'preact/hooks';
import { IoIosSend } from 'react-icons/io';

import { MessageProps } from '../../interfaces';
import Message from '../Message/Message';

interface StatelessChatProps {
  user: { id: string; name: string };
  adminName: string;
  sendMessage: (id: string, message: string) => void;
  messages: MessageProps[];
}
const StatelessChat = (props: StatelessChatProps) => {
  const [text, setText] = useState('');
  const spacer = useRef<HTMLDivElement>();

  useEffect(() => {
    spacer.current?.scrollIntoView();
  }, []);

  return (
    <div id='chatbox'>
      <h1 className='title'>{props.user.name}</h1>
      <div className='chatbox-messages'>
        {props.messages
          .filter((m) => m.uuid === props.user.id)
          .map((m, i) => (
            <Message {...m} sameUser={m.sender === props.adminName} key={i} />
          ))}
        <div className='chat-spacer' ref={spacer}></div>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (text.length) {
            props.sendMessage(props.user.id, text);
          }
          setText('');
        }}
        id='chat-form'
      >
        <input
          id='chat-input'
          rows={2}
          placeholder='Type message and click send'
          value={text}
          onChange={(e) => setText(e.currentTarget.value)}
        />
        <button type='submit' className='submit-btn'>
          <IoIosSend fontSize='2rem' />
        </button>
      </form>
    </div>
  );
};

export default StatelessChat;
