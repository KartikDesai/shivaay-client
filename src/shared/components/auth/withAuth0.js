import React, { useState, useEffect, useContext } from 'react';
export const AuthContext = React.createContext();
export const useAuth = () => useContext(AuthContext);

export function hookAuth(WrappedComponent) {
  return function HockComponent(props) {
    const auth = useAuth();
    return <WrappedComponent {...props} auth={auth} />;
  };
}

const AuthProvider = ({
  children
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState();
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);
  const [popupOpen, setPopupOpen] = useState(false);

  useEffect(() => {
    const initAuth = () => {
      const isAuth = true; // TODO: HARD CODED
      setIsAuthenticated(isAuth);

      if (isAuth) {
        setUser({ fullName: 'Taral Vaghasia', avatar: `${process.env.PUBLIC_URL}/img/ava.png` }); // TODO: HARD CODED
      }
      setLoading(false);
    };
    initAuth();
    // eslint-disable-next-line
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        loading,
        popupOpen,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
export default AuthProvider;
