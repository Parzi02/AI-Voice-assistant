import React, { useState } from 'react';
import { auth } from '../Firebase/Firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { FaGoogle, FaFacebook, FaGithub } from 'react-icons/fa';

const Signup = ({ onShowLogin }) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSignup = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            console.error("Passwords don't match");
            return;
        }
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            console.log('User created successfully!');
            onShowLogin(); // Switch to login view after successful signup
        } catch (error) {
            console.error('Signup error:', error.message);
        }
    };

    return (
        <>
            <div className="left-pane">
                <h1>Roll the Carpet.!</h1>
                <button>Skip the lag ?</button>
            </div>
            <div className="right-pane">
                <div className="form-container">
                    <h2>Signup</h2>
                    <p>Just some details to get you in.!</p>
                    <form onSubmit={handleSignup}>
                        <div className="input-group">
                            <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                        </div>
                        <div className="input-group">
                            <input type="email" placeholder="Email / Phone" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </div>
                        <div className="input-group">
                            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        </div>
                        <div className="input-group">
                            <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                        </div>
                        <button type="submit" className="submit-btn">Signup</button>
                    </form>
                    <div className="divider">Or</div>
                    <div className="social-login">
                        <FaGoogle className="social-icon" />
                        <FaFacebook className="social-icon" />
                        <FaGithub className="social-icon" />
                    </div>
                    <div className="form-footer">
                        Already Registered? <a href="#" onClick={(e) => { e.preventDefault(); onShowLogin(); }}>Login</a>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Signup;