import React from "react";

import '../../astyles/header/HeaderDropDownComponent.css';
import Button from "acommons/Button";

type HeaderDropDownComponentProps = {
  onLogoutClick?: () => void;
  onDeleteAccountClick?: () => void;
};

const HeaderDropDownComponent: React.FC<HeaderDropDownComponentProps> = ({
  onLogoutClick,
  onDeleteAccountClick,
}) => {
  return (
    <div className="dropdown-container">
      <div className="dropdown-menu">
        <ul>
          <li>
            <Button text="로그아웃" onClick={onLogoutClick} className="text-white"/>
          </li>
          <li>
            <Button text="회원탈퇴" onClick={onDeleteAccountClick} className="text-red-600" />
          </li>
        </ul>
      </div>
    </div>
  );
};

export default HeaderDropDownComponent;