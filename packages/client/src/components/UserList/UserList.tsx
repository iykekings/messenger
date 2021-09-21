import './UserList.scss';

import {
  FunctionComponent,
  h,
} from 'preact';

import { User } from '@chat/shared';

const UserList: FunctionComponent<{
  users: User[];
  activeChatId: string;
  changeChat: (chatId: string) => void;
}> = ({ users, changeChat, activeChatId }) => {
  return (
    <div>
      <ul class="users-list">
        {users.map((user) => (
          <User
            user={user}
            changeChat={changeChat}
            isActive={activeChatId === user.uuid}
          />
        ))}
      </ul>
    </div>
  );
};

const User: FunctionComponent<{
  user: User;
  changeChat: (chatId: string) => void;
  isActive: boolean;
}> = ({ user, changeChat, isActive }) => {
  return (
    <li onClick={() => changeChat(user.uuid)} class={isActive ? "active" : ""}>
      <span>{user.name[0].toUpperCase()}</span>
      {user.name}
    </li>
  );
};

export default UserList;
