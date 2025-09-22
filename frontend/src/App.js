import React from 'react';
import { auth } from './Firebase/Firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Auth from './components/AuthPage';
import Chatbot from './chatbot';
import AuthPage from './components/AuthPage';

function App() {
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="App">
      {user ? <Chatbot /> : <AuthPage />}
    </div>
  );
}

export default App;
