//src/apages/Testpage
import React from 'react';
import SignInComponent from '../../acomponents/auth/SignInComponent';
import '../../astyles/ASignInPage.css';

const SignInPage: React.FC = () => {
  return (
    <div className="testpage-container">
      <SignInComponent />
    </div>
  );
};

export default SignInPage;