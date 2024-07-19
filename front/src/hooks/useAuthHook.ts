

// src/hooks/useAuthHook.ts
import { useState, useEffect, useCallback } from 'react';
import { authCheck } from 'services/Auth/test_authCheckService';
import { nicknameCheck } from 'services/Auth/test_nicknameCheckService';

// export const useAuth = (onAuthSuccess?: (nickname: string) => void) => {
//   const [hasNickname, setHasNickname] = useState(false);
//   const [myNickname, setMyNickname] = useState<string | null>(null);
//   const [nicknameModalOpen, setNicknameModalOpen] = useState(false);

//   useEffect(() => {
//     authCheck(
//       () => {
//         nicknameCheck(
//           (nickname) => {
//             setHasNickname(true);
//             setMyNickname(nickname);
//             if (onAuthSuccess) {
//               onAuthSuccess(nickname);
//             }
//           },
//           () => {
//             setNicknameModalOpen(true);
//           }
//         );
//       },
//       () => {}
//     );
//   }, [onAuthSuccess]);

//   return { hasNickname, myNickname, nicknameModalOpen, setNicknameModalOpen };
// };

// export const useAuth = () => {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [myNickname, setMyNickname] = useState<string | null>(null);
//   const [nicknameModalOpen, setNicknameModalOpen] = useState(false);

//   const checkAuthStatus = useCallback((onSuccess?: (myNickname: string) => void, onFailure?: () => void) => {
//     authCheck(
//       () => {
//         nicknameCheck(
//           (myNickname) => {
//             setIsAuthenticated(true);
//             setMyNickname(myNickname);
//             if (onSuccess) {
//               onSuccess(myNickname);
//             }
//           },
//           () => {
//             setNicknameModalOpen(true);
//           }
//         );
//       },
//       () => {
//         setIsAuthenticated(false);
//         setMyNickname(null);
//         if (onFailure) {
//           onFailure();
//         }
//       }
//     );
//   }, []);

//   return { isAuthenticated, myNickname, nicknameModalOpen, setNicknameModalOpen, checkAuthStatus };
// };


type AuthCheck = (onSuccess: () => void, onFailure: () => void) => void;
type NicknameCheck = (onSuccess: (nickname: string) => void, onFailure: () => void) => void;

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [myNickname, setMyNickname] = useState<string | null>(null);
  const [nicknameModalOpen, setNicknameModalOpen] = useState(false);

  useEffect(() => {
    const authCheckHandler: AuthCheck = authCheck;
    const nicknameCheckHandler: NicknameCheck = nicknameCheck;
    authCheckHandler(
      () => {
        nicknameCheckHandler(
          (nickname) => {
            setIsAuthenticated(true);
            setMyNickname(nickname);
          },
          () => {
            setNicknameModalOpen(true);
          }
        );
      },
      () => {
        setIsAuthenticated(false);
        setMyNickname(null);
      }
    );
  }, []);

  const checkAuthStatus = (onSuccess: (nickname: string) => void, onFailure: () => void) => {
    const authCheckHandler: AuthCheck = authCheck;
    const nicknameCheckHandler: NicknameCheck = nicknameCheck;
    authCheckHandler(
      () => {
        nicknameCheckHandler(
          (nickname) => {
            setIsAuthenticated(true);
            setMyNickname(nickname);
            onSuccess(nickname);
          },
          onFailure
        );
      },
      onFailure
    );
  };

  return { isAuthenticated, myNickname, nicknameModalOpen, setNicknameModalOpen, checkAuthStatus };
};