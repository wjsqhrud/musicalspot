import React from "react";

import '../../astyles/header/HeaderComponent.css';
import Header from "acommons/Header";
import Button from "acommons/Button";

type HeaderComponentProps = {
  title: string;
  onHeaderClick?: () => void;
  hasNickname?: boolean;
  nickname?: string | null;
  onLoginClick?: () => void;
  onNicknameClick?: () => void;
};

const HeaderComponent: React.FC<HeaderComponentProps> = ({ title, onHeaderClick, hasNickname, nickname, onLoginClick, onNicknameClick }) => {
  return (
    <header className="header-section">
      <Header title={title} onClick={onHeaderClick} />
      {hasNickname && nickname ? (
        <div className="button-container">
          <Button text={nickname} onClick={onNicknameClick} />
        </div >
      ) : (
        <div className="button-container">
          <Button text="로그인" onClick={onLoginClick} />
        </div>
      )}
    </header>
  );
};

export default HeaderComponent;