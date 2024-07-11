//src/apages/Testpage
import React from 'react';

import SignUpComponent from 'acomponents/auth/SignUpComponent';
import '../../astyles/ASignInPage.css';

const SignUpPage: React.FC = () => {
  return (
    <div className="testpage-container">
      <SignUpComponent />
    </div>
  );
};

export default SignUpPage;