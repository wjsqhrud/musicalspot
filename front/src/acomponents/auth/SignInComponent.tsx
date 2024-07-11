//src/acomponents/AuthComponent
import React, { useRef, useState } from 'react';
import kakaoSignInImage from 'assets/images/kakao-sign-in.png';
import naverSignInImage from 'assets/images/naver-sign-in.png';
import Input from '../../acommons/Input';
import Label from '../../acommons/Label';
import Button from '../../acommons/Button';
import Divider from '../../acommons/Divider';
import '../../astyles/AuthComponent.css';
import { 
  handleLogin as handleLoginService, 
  handleUsernameChange, 
  handlePasswordChange, 
  handleUsernameKeyDown, 
  handlePasswordKeyDown 
} from 'services/SignInService/signInService';
import useSignInResponse from 'services/SignInService/signInResponseService';
import HomeButton from './HomeButton';
import useNavigateHelper from 'utils/NavigationUtil/navigationUtil';
import { onSnsSignInButtonClickHandler } from 'services/OAuth2SignInService/snsSignInService';

const SignInComponent: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const usernameRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);

  const { navigateToSignUp } = useNavigateHelper(); 
  const { signInResponse } = useSignInResponse();

  const handleLogin = () => {
    handleLoginService(username, password, setUsernameError, setPasswordError, usernameRef, signInResponse);
  };

  const handleKakaoSignIn = () => {
    // 카카오 로그인 로직
    console.log('카카오 로그인');
    onSnsSignInButtonClickHandler('kakao');
  };

  const handleNaverSignIn = () => {
    // 네이버 로그인 로직
    console.log('네이버 로그인');
    onSnsSignInButtonClickHandler('naver');
  };

  return (
    <div className="auth-container">
      <div className="auth-header">
        <div className="home-icon"><HomeButton/></div>
        <h2 className="auth-title">로그인</h2>
        <div className="spacer"></div>
      </div>
      <Label text="아이디" />
      <Input 
        type="text" 
        placeholder="아이디를 입력하세요" 
        value={username} 
        onChange={(e) => handleUsernameChange(e, setUsername, setUsernameError)} 
        onKeyDown={(e) => handleUsernameKeyDown(e, username, setUsernameError, passwordRef)} 
        ref={usernameRef} 
      />
      <Label text="비밀번호" />
      <Input 
        type="password" 
        placeholder="비밀번호를 입력하세요" 
        value={password} 
        onChange={(e) => handlePasswordChange(e, setPassword, setPasswordError)} 
        onKeyDown={(e) => handlePasswordKeyDown(e, handleLogin)} 
        ref={passwordRef} 
      />
      <div className="auth-checkbox">
        <input type="checkbox" id="save-id" />
        <label htmlFor="save-id">아이디 저장</label>
      </div>
      <Button text="로그인" className="primary login-button" onClick={handleLogin} />
      <Button text="회원가입" className="secondary signup-button" onClick={navigateToSignUp} />
      <Divider text="OR" />
      <div className="sns-login">
        <Button text="카카오" className="sns-button kakao">
          <img src={kakaoSignInImage} alt="Kakao Sign In" onClick={handleKakaoSignIn}/>
        </Button>
        <Button text="네이버" className="sns-button naver">
          <img src={naverSignInImage} alt="Naver Sign In" onClick={handleNaverSignIn} />
        </Button>
      </div>
    </div>
  );
};

export default SignInComponent;