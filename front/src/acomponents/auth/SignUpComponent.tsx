import React, { useRef, useState } from 'react';
import kakaoSignInImage from 'assets/images/kakao-sign-in.png';
import naverSignInImage from 'assets/images/naver-sign-in.png';
import Input from '../../acommons/Input';
import Label from '../../acommons/Label';
import Button from '../../acommons/Button';
import Divider from '../../acommons/Divider';
import '../../astyles/AuthComponent.css';

import { 
  
  onSignUpButtonClickHandler
} from 'services/SignUpService/signUpService';
import useNavigateHelper from 'utils/NavigationUtil/navigationUtil';
import { onIdChangeHandler, onIdButtonClickHandler, onIdKeyDownHandler, validateUsernameFormat } from 'services/SignUpService/checkUsernameService';
import { validPasswordFormat, onPasswordKeyDownHandler, onPasswordCheckKeyDownHandler, onPasswordCheckChangeHandler, onPasswordChangeHandler } from 'services/SignUpService/passwordService';
import { onEmailButtonClickHandler, onEmailChangeHandler, onEmailKeyDownHandler } from 'services/SignUpService/emailService';
import { onCertificationNumberButtonClickHandler, onCertificationNumberChangeHandler, onCertificationNumberKeyDownHandler } from 'services/SignUpService/certificationService';


const SignUpComponent: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [certificationNumber, setCertificationNumber] = useState('');
  const [idMessage, setIdMessage] = useState('');
  const [idError, setIdError] = useState(false);
  const [idCheck, setIdCheck] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState('');
  const [confirmPasswordMessage, setConfirmPasswordMessage] = useState('');
  const [emailMessage, setEmailMessage] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [certificationNumberMessage, setCertificationNumberMessage] = useState('');
  const [certificationNumberError, setCertificationNumberError] = useState(false);
  const [certificationCheck, setCertificationCheck] = useState(false);

  const usernameRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);
  const passwordCheckRef = useRef<HTMLInputElement | null>(null);
  const emailRef = useRef<HTMLInputElement | null>(null);
  const verificationCodeRef = useRef<HTMLInputElement | null>(null);

  const { navigateToLogin } = useNavigateHelper(); 

  // todo: 에러메세지도 다시 해줘야되고
  const usernameErrorType = !validateUsernameFormat(username) ? 'smallError' : idError ? 'error' : 'success';
  const passwordErrorType = !validPasswordFormat(password) ? 'smallError' : passwordMessage === '사용 가능한 비밀번호입니다.' ? 'success' : 'error';
  const passwordCheckErrorType = password !== confirmPassword ? 'error' : 'success';
  const emailErrorType = emailError ? 'error' : 'success';
  const certificationNumberErrorType = certificationNumberError ? 'error' : 'success';

  return (
    <div className="auth-container">
      <div className="auth-header">
        <div className="home-icon"></div>
        <h2 className="auth-title">회원가입</h2>
        <div className="spacer"></div>
      </div>
      <Label text="아이디 확인" />
      <Input 
        type="text" 
        placeholder="아이디를 입력하세요" 
        value={username} 
        onChange={(e) => onIdChangeHandler(e, setUsername, setIdMessage, setIdCheck, setIdError)} 
        onKeyDown={(e) => onIdKeyDownHandler(e, () => onIdButtonClickHandler(username, setIdError, setIdMessage, setIdCheck, usernameRef, passwordRef))} 
        ref={usernameRef}
      />
      <Button text="중복 확인" className="secondary" onClick={() => onIdButtonClickHandler(username, setIdError, setIdMessage, setIdCheck, usernameRef, passwordRef)} />
      <Label text="비밀번호" />
      <Input 
        type="password" 
        placeholder="비밀번호를 입력하세요" 
        value={password} 
        onChange={(e) => onPasswordChangeHandler(e, setPassword, setPasswordMessage)} 
        onKeyDown={(e) => onPasswordKeyDownHandler(e, passwordCheckRef, password, setPasswordMessage)} 
        ref={passwordRef} 
      />
      <Label text="비밀번호 확인" />
      <Input 
        type="password" 
        placeholder="비밀번호를 다시 입력하세요" 
        value={confirmPassword} 
        onChange={(e) => onPasswordCheckChangeHandler(e, setConfirmPassword, setConfirmPasswordMessage)} 
        onKeyDown={(e) => onPasswordCheckKeyDownHandler(e, emailRef, password, confirmPassword, setConfirmPasswordMessage)} 
        ref={passwordCheckRef} 
      />
      <Label text="이메일" />
      <Input 
        type="email" 
        placeholder="이메일 주소를 입력하세요" 
        value={email} 
        onChange={(e) => onEmailChangeHandler(e, setEmail, setEmailMessage, setEmailError)} 
        onKeyDown={(e) => onEmailKeyDownHandler(e, () => onEmailButtonClickHandler(username, email, setEmailError, setEmailMessage, setIdError, setIdMessage, setIdCheck, verificationCodeRef))} 
        ref={emailRef} 
      />
      <Button text="이메일 인증" className="secondary" onClick={() => onEmailButtonClickHandler(username, email, setEmailError, setEmailMessage, setIdError, setIdMessage, setIdCheck, verificationCodeRef)} />
      <Label text="인증번호" />
      <Input 
        type="text" 
        placeholder="인증번호 4자리를 입력하세요" 
        value={certificationNumber} 
        onChange={(e) => onCertificationNumberChangeHandler(e, setCertificationNumber, setCertificationNumberMessage, setCertificationCheck)} 
        onKeyDown={(e) => onCertificationNumberKeyDownHandler(e, () => onCertificationNumberButtonClickHandler(username, email, certificationNumber, setCertificationNumberMessage, setCertificationNumberError, setCertificationCheck))} 
        ref={verificationCodeRef} 
      />
      <Button text="인증 확인" className="secondary" onClick={() => onCertificationNumberButtonClickHandler(username, email, certificationNumber, setCertificationNumberMessage, setCertificationNumberError, setCertificationCheck)} />
      <Button text="회원가입" className="primary" onClick={() => onSignUpButtonClickHandler(
        username,
        password,
        confirmPassword,
        email,
        certificationNumber,
        idCheck,
        certificationCheck,
        setIdMessage,
        setIdError,
        setIdCheck,
        setPasswordMessage,
        setConfirmPasswordMessage,
        setEmailMessage,
        setEmailError,
        setCertificationNumberMessage,
        setCertificationNumberError,
        setCertificationCheck,
        navigateToLogin
      )} />
      <Button text="로그인" className="secondary" onClick={navigateToLogin} />
      <Divider text="OR" />
      <div className="sns-login">
        <Button text="카카오" className="sns-button kakao">
          <img src={kakaoSignInImage} alt="Kakao Sign In" />
        </Button>
        <Button text="네이버" className="sns-button naver">
          <img src={naverSignInImage} alt="Naver Sign In" />
        </Button>
      </div>
    </div>
  );
};

export default SignUpComponent;