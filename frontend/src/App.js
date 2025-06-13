import React from 'react';
import { auth } from './Firebase/Firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Auth from './Auth';
import Chatbot from './chatbot';

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
      {user ? <Chatbot /> : <Auth />}
    </div>
  );
}

export default App;
