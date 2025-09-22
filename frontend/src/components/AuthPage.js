// import React, { useState } from 'react';
// import { auth } from '../Firebase/Firebase';
// import { createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
// import './Auth.css';

// const Auth = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [isLogin, setIsLogin] = useState(true);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       if (isLogin) {
//         await signInWithEmailAndPassword(auth, email, password);
//       } else {
//         await createUserWithEmailAndPassword(auth, email, password);
//       }
//     } catch (error) {
//       console.error('Authentication error:', error.message);
//     }
//   };

//   const handleGoogleSignIn = async () => {
//     const provider = new GoogleAuthProvider();
//     try {
//       await signInWithPopup(auth, provider);
//     } catch (error) {
//       console.error('Google sign-in error:', error.message);
//     }
//   };

//   return (
//     <div className="auth-container">
//       <h2>{isLogin ? 'Login' : 'Register'}</h2>
//       <form onSubmit={handleSubmit}>
//         <input
//           type="email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           placeholder="Email"
//           required
//         />
//         <input
//           type="password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           placeholder="Password"
//           required
//         />
//         <button type="submit">{isLogin ? 'Login' : 'Register'}</button>
//       </form>
//       <button onClick={handleGoogleSignIn}>Sign in with Google</button>
//       <button onClick={() => setIsLogin(!isLogin)}>
//         {isLogin ? 'Need to create an account?' : 'Already have an account?'}
//       </button>
//     </div>
//   );
// };

// export default Auth;

import React, { useState } from 'react';
import Login from './Login';
import Signup from './Signup';
import ForgotPassword from './ForgotPassword';
import '../Auth.css';

const AuthPage = () => {
    const [currentView, setCurrentView] = useState('login'); // 'login', 'signup', 'forgotPassword'

    // Functions to switch between views
    const showLogin = () => setCurrentView('login');
    const showSignup = () => setCurrentView('signup');
    const showForgotPassword = () => setCurrentView('forgotPassword');

    const renderView = () => {
        switch (currentView) {
            case 'signup':
                return <Signup onShowLogin={showLogin} />;
            case 'forgotPassword':
                return <ForgotPassword onShowLogin={showLogin} />;
            case 'login':
            default:
                return <Login onShowSignup={showSignup} onShowForgotPassword={showForgotPassword} />;
        }
    };

    return (
        <div className="auth-page-container">
            {renderView()}
        </div>
    );
};

export default AuthPage;