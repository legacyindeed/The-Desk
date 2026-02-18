import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Auth.css';

import { auth } from './firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

const Auth = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const isLogin = location.pathname === '/login'; // simplified logic

    // Logic to determine form type based on URL or prop could go here
    // For now, assuming the route handles it or we toggle state

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    // const [isLoginMode, setIsLoginMode] = useState(true); // If you want internal toggle

    const handleGoogleSignIn = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            localStorage.setItem('thedesk_user', JSON.stringify({
                email: user.email,
                name: user.displayName || 'Seeker',
                uid: user.uid
            }));

            navigate('/entrance');
        } catch (error) {
            console.error("Google Auth Error:", error);
            alert(error.message);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            let userCredential;
            if (isLogin) {
                userCredential = await signInWithEmailAndPassword(auth, email, password);
            } else {
                userCredential = await createUserWithEmailAndPassword(auth, email, password);
                if (name) {
                    await updateProfile(userCredential.user, { displayName: name });
                }
            }

            const user = userCredential.user;
            // Sync to local storage for existing components compatibility
            localStorage.setItem('thedesk_user', JSON.stringify({
                email: user.email,
                name: user.displayName || name || 'Seeker',
                uid: user.uid
            }));

            navigate('/entrance');
        } catch (error) {
            console.error("Auth Error:", error);
            alert(error.message);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-overlay"></div>

            <button className="btn-back-home" onClick={() => navigate('/')}>
                ← Return to Silence
            </button>

            <div className="auth-card animate-up">
                <h2>{isLogin ? 'Welcome Back.' : 'Join the Sanctuary.'}</h2>
                <p className="auth-subtitle">
                    {isLogin
                        ? 'Return to your workspace.'
                        : 'Claim your spot at The Desk.'}
                </p>

                <button type="button" className="btn-google animate-up" style={{ animationDelay: '0.1s' }} onClick={handleGoogleSignIn}>
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="" />
                    <span>Continue with Google</span>
                </button>

                <div className="auth-divider animate-up" style={{ animationDelay: '0.2s' }}>
                    <span>or use email</span>
                </div>

                <form className="auth-form animate-up" style={{ animationDelay: '0.3s' }} onSubmit={handleSubmit}>
                    {!isLogin && (
                        <div className="input-group">
                            <label>Full Name</label>
                            <input
                                type="text"
                                placeholder="Your Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                    )}

                    <div className="input-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            placeholder="email@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label>Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="btn-main-premium" style={{ width: '100%', marginTop: '1rem' }}>
                        {isLogin ? 'Sign In' : 'Create Account'}
                    </button>
                </form>

                <div className="auth-footer">
                    {isLogin ? (
                        <>
                            New seeker?
                            <span className="auth-link" onClick={() => navigate('/signup')}>Sign Up</span>
                        </>
                    ) : (
                        <>
                            Already a member?
                            <span className="auth-link" onClick={() => navigate('/login')}>Log In</span>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Auth;
