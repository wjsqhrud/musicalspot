// src/acomponents/header/TestHeaderDropDownComponent
import React from "react";
import Button from "acommons/Button";

type CommonDropDownProps = {
  onMyPageClick: () => void;
  onLogoutClick: () => void;
  onDeleteAccountClick: () => void;
};

const CommonDropDown: React.FC<CommonDropDownProps> = ({
  onMyPageClick,
  onLogoutClick,
  onDeleteAccountClick
}) => {
  return (
    <div className="absolute top-11 right-0 w-48 bg-white border border-gray-300 rounded shadow-lg z-10 mt-2 ">
      <ul className="list-none m-0 p-0 ">
        <li className="p-2">
          <Button text="마이페이지" onClick={onMyPageClick} className="text-black" />
        </li>
        <li className="p-2">
          <Button text="로그아웃" onClick={onLogoutClick} className="text-black" />
        </li>
        <li className="p-2">
          <Button text="회원탈퇴" onClick={onDeleteAccountClick} className="text-red-600" />
        </li>
      </ul>
    </div>
  );
};

export default CommonDropDown;