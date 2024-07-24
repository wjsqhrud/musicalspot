import React, { useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { HeaderProvider } from 'services/HeaderService/HeaderService';
import OAuth from 'services/OAuth2SignInService/oAuthResponseService';
import SignInPage from 'apages/auth/SignInPage';
import SignUpPage from 'apages/auth/SignUpPage';
import CreateNickNamePage from 'apages/auth/CreateNickNamePage';
import Mainpage from 'apages/main/Mainpage';
import ReviewList from 'apages/reviewList/ReviewList';
import TestPage from 'apages/test/TestPage';
import MusicalPage from 'apages/musical/MusicalPage';
import CategoryPage from 'apages/Category/CategoryPage';
import WebSocketConnect from 'components/websocket/WebsocketTest';
import ChatIconComponent from 'components/websocket/ChatBalloonIcon';

function App() {
  const [isChatVisible, setIsChatVisible] = useState<boolean>(false);

  const toggleChat = () => {
    setIsChatVisible(!isChatVisible);
  };

  return (
    <HeaderProvider>
       {isChatVisible ? <WebSocketConnect toggleChat={toggleChat} /> : <ChatIconComponent toggleChat={toggleChat} />}
      <Routes>
        <Route path='/auth'>
          <Route path='home' element={<Mainpage/>} />
          <Route path='category' element={<CategoryPage/>} />
          <Route path='musical' element={<MusicalPage/>} />
          <Route path='reviewlist' element={<ReviewList/>}/>
          <Route path='sign-in' element={<SignInPage/>} />
          <Route path='sign-up' element={<SignUpPage/>} />
          <Route path='create-nickname' element={<CreateNickNamePage/>} />
          <Route path='test' element={<TestPage/>} />          
          {/* <Route path='oauth-response/:token/:expirationTime/:refreshToken/:refreshExpirationTime' element={<OAuth />} /> */}
        </Route>
        <Route path='/auth/oauth-response/:token/:expirationTime/:refreshToken/:refreshExpirationTime' element={<OAuth />} />
        <Route path="*" element={<Navigate to="/auth/home" />} />
      </Routes>
    </HeaderProvider>
  );
}

export default App;
