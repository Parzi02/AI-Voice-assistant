import React, { useState } from 'react';
import { auth } from '../Firebase/Firebase';
import { sendPasswordResetEmail } from 'firebase/auth';

const ForgotPassword = ({ onShowLogin }) => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleReset = async (e) => {
        e.preventDefault();
        try {
            await sendPasswordResetEmail(auth, email);
            setMessage('Password reset link has been sent to your email!');
        } catch (error) {
            console.error('Password reset error:', error.message);
            setMessage('Failed to send password reset email.');
        }
    };

    return (
        <>
            <div className="left-pane">
                <h1>No Worries.!!</h1>
                <button onClick={onShowLogin}>Take me back.!</button>
            </div>
            <div className="right-pane">
                <div className="form-container">
                    <h2>Forgot Password ?</h2>
                    <p>Please enter you're email</p>
                    {message && <p style={{ color: 'lightgreen' }}>{message}</p>}
                    <form onSubmit={handleReset}>
                        <div className="input-group">
                            <input
                                type="email"
                                placeholder="example@mail.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="submit-btn">Reset Password</button>
                    </form>
                     <div className="form-footer">
                        Remember your password? <a href="#" onClick={(e) => { e.preventDefault(); onShowLogin(); }}>Login</a>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ForgotPassword;