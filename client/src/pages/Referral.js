import React from 'react';

function Referral({ refLink, invitedCount }) {
  return (
    <div>
      <h2>Рефералы</h2>
      <div>Ваша ссылка: <input value={refLink} readOnly style={{ width: '80%' }} /></div>
      <div>Приглашено: {invitedCount}</div>
    </div>
  );
}

export default Referral;
