import React, { useState } from 'react';
import { auth } from '../Firebase/Firebase';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { FaGoogle, FaFacebook, FaGithub } from 'react-icons/fa';

const Login = ({ onShowSignup, onShowForgotPassword }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            console.log('User logged in successfully!');
            // You can add redirection logic here
        } catch (error) {
            console.error('Login error:', error.message);
        }
    };

    const handleGoogleSignIn = async () => {
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
            console.log('Google sign-in successful!');
        } catch (error) {
            console.error('Google sign-in error:', error.message);
        }
    };

    return (
        <>
            <div className="left-pane">
                <h1>Welcome Back .!</h1>
                <button>Skip the lag ?</button>
            </div>
            <div className="right-pane">
                <div className="form-container">
                    <h2>Login</h2>
                    <p>Glad you're back.!</p>
                    <form onSubmit={handleLogin}>
                        <div className="input-group">
                            <input
                                type="email"
                                placeholder="Username" // The image says "Username", but Firebase uses email
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="input-group">
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="options">
                            <label><input type="checkbox" /> Remember me</label>
                            <a href="#" onClick={(e) => { e.preventDefault(); onShowForgotPassword(); }}>Forgot password?</a>
                        </div>
                        <button type="submit" className="submit-btn">Login</button>
                    </form>
                    <div className="divider">Or</div>
                    <div className="social-login">
                        <FaGoogle className="social-icon" onClick={handleGoogleSignIn} />
                        <FaFacebook className="social-icon" />
                        <FaGithub className="social-icon" />
                    </div>
                    <div className="form-footer">
                        Don't have an account ? <a href="#" onClick={(e) => { e.preventDefault(); onShowSignup(); }}>Signup</a>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;