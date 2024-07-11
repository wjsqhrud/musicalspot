//src/apages/Testpage
import React from 'react';
import '../../astyles/ASignInPage.css';
import CreateNickNameComponent from 'acomponents/auth/CreateNickNameComponent';

const CreateNickNamePage: React.FC = () => {
  return (
    <div className="testpage-container">
      <CreateNickNameComponent />
    </div>
  );
};

export default CreateNickNamePage;