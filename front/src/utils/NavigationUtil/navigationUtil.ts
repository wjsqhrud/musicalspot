// src/utils/navigationUtils.ts
import { useNavigate } from 'react-router-dom';

const useNavigateHelper = () => {
  const navigate = useNavigate();

  const navigateToHome = () => {
    navigate('/auth/home');
  };
  const navigateToMyblog = () => {
    navigate('/auth/my');
  };

  const navigateToLogin = () => {
    navigate('/auth/sign-in');
  };
  const navigateToSignUp = () => {
    navigate('/auth/sign-up');
  };
  const navigateToCreateNickname = () => {
    navigate('/auth/create-nickname');
  };
  
  const navigateToTest = () => {
    navigate('/auth/test');
  };  
  const navigateToUserBlog= (nickname: String) => {
    navigate(`/auth/user-blog/${nickname}`)
  };
  const navigateToEditPost = () => {
    navigate('/auth/edit-post')
  };
  const navigateToEditEditPost = (postId: string) => {
    navigate(`/auth/edit-post/${postId}`);
  };
  const navigateToPost = (postId: number, nickname: string) => {
    navigate(`/auth/post/${postId}/${nickname}`);
  };
  const navigateToDeleteAccount = () => {
    navigate('/auth/delete-account')
  };


  return { navigateToLogin, navigateToHome, navigateToSignUp, navigateToMyblog, navigateToTest, navigateToCreateNickname, navigateToUserBlog, navigateToCreatePost: navigateToEditPost, navigateToPost, navigateToDeleteAccount, navigateToEditEditPost};
};

export default useNavigateHelper;
