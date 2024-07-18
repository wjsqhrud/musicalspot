// src/App.tsx// src/App.tsx
import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { HeaderProvider } from 'services/HeaderService/HeaderService';
import OAuth from 'services/OAuth2SignInService/oAuthResponseService';
import SignInPage from 'apages/auth/SignInPage';
import SignUpPage from 'apages/auth/SignUpPage';
import CreateNickNamePage from 'apages/auth/CreateNickNamePage';
import HomePage from 'apages/auth/MainPage';
import JMainpage from 'apages/auth/JMainpage';
import ReviewList from 'apages/reviewList/ReviewList';
import './font.css';

function App() {
  return (
    <HeaderProvider>
      <Routes>
        <Route path='/auth'>
          <Route path='bo-test' element={<JMainpage/>} />
          <Route path='reviewlist' element={<ReviewList/>}/>
          <Route path='sign-in' element={<SignInPage/>} />
          <Route path='sign-up' element={<SignUpPage/>} />
          <Route path='create-nickname' element={<CreateNickNamePage/>} />
          <Route path='home' element={<HomePage/>} />
          <Route path='oauth-response/:token/:expirationTime/:refreshToken/:refreshExpirationTime' element={<OAuth />} />
        </Route>
        <Route path="*" element={<Navigate to="/auth/home" />} />
      </Routes>
    </HeaderProvider>
  );
}

export default App;
