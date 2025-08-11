import React from 'react';

function Profile({ user, coins, invitedCount }) {
  return (
    <div>
      <h2>Профиль</h2>
      <div>👤 {user?.first_name} {user?.last_name}</div>
      <div>💰 Монет: {coins}</div>
      <div>👥 Приглашено: {invitedCount}</div>
    </div>
  );
}

export default Profile;
