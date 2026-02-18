import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactQuill, { Quill } from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import './WritingStudio.css';
import BurgerMenu from './BurgerMenu';

import { auth, db, storage } from './firebase';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Register custom fonts
const Font = Quill.import('formats/font');
Font.whitelist = ['lora', 'jakarta', 'inter', 'outfit', 'montserrat', 'manrope'];
Quill.register(Font, true);

const WritingStudio = () => {
    const navigate = useNavigate();
    const quillRef = useRef(null);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [mood, setMood] = useState('Neutral');
    const [isZen, setIsZen] = useState(false);
    const [lastSaved, setLastSaved] = useState(null);
    const [uploading, setUploading] = useState(false);

    const [wordCount, setWordCount] = useState(0);
    const [charCount, setCharCount] = useState(0);

    // Enable spellcheck on Quill editor after mount
    useEffect(() => {
        if (quillRef.current) {
            const editor = quillRef.current.getEditor();
            if (editor && editor.root) {
                editor.root.setAttribute('spellcheck', 'true');
                editor.root.setAttribute('autocorrect', 'on');
                editor.root.setAttribute('autocapitalize', 'sentences');
            }
        }
    }, []);

    // Custom image handler — uploads to Firebase Storage instead of base64
    const imageHandler = useCallback(() => {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();

        input.onchange = async () => {
            const file = input.files[0];
            if (!file || !auth.currentUser) return;

            setUploading(true);
            try {
                const storageRef = ref(storage, `users/${auth.currentUser.uid}/images/${Date.now()}_${file.name}`);
                await uploadBytes(storageRef, file);
                const url = await getDownloadURL(storageRef);

                const editor = quillRef.current.getEditor();
                const range = editor.getSelection(true);
                editor.insertEmbed(range.index, 'image', url);
                editor.setSelection(range.index + 1);
            } catch (e) {
                console.error('Image upload failed:', e);
                alert('Image upload failed. Please try again.');
            } finally {
                setUploading(false);
            }
        };
    }, []);

    const handleSave = async () => {
        if (!auth.currentUser) {
            alert('You must be logged in to save entries.');
            return;
        }

        const entry = {
            id: Date.now(),
            type: 'writing',
            title: title || 'Untitled Entry',
            content: content,
            wordCount: wordCount,
            charCount: charCount,
            mood: mood,
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            timestamp: new Date().toISOString()
        };

        try {
            await addDoc(collection(db, 'users', auth.currentUser.uid, 'entries'), entry);
            navigate('/analytics');
        } catch (e) {
            console.error("Error adding document: ", e);
            alert("Failed to save entry. Please try again.");
        }
    };

    useEffect(() => {
        const doc = new DOMParser().parseFromString(content, 'text/html');
        const text = doc.body.innerText || doc.body.textContent || "";
        const words = text.trim() ? text.trim().split(/\s+/).filter(w => w.length > 0).length : 0;
        const chars = text.length;

        setWordCount(words);
        setCharCount(chars);

        const timer = setTimeout(() => {
            setLastSaved(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        }, 1000);
        return () => clearTimeout(timer);
    }, [content, title]);

    const modules = {
        toolbar: {
            container: [
                ['bold', 'italic', 'blockquote'],
                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                ['link', 'image'],
                ['clean']
            ],
            handlers: {
                image: imageHandler
            }
        },
    };

    return (
        <div className={`studio-page ${isZen ? 'zen-mode' : ''}`}>

            {isZen && (
                <button className="zen-exit-btn animate-up" onClick={() => setIsZen(false)}>
                    Exit Zen Mode
                </button>
            )}

            <header className="sanctuary-nav">
                <div className="nav-left">
                    <button className="btn-back-fancy" onClick={() => navigate('/dashboard')} style={{ marginRight: '2rem' }}>
                        <span>←</span> Back
                    </button>
                    <span className="sanctuary-brand" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
                        The Desk
                    </span>
                </div>
                <div className="nav-right">
                    {!isZen && (
                        <button className="btn-secondary-fancy" onClick={() => setIsZen(true)}>
                            Zen Focus
                        </button>
                    )}
                    <BurgerMenu />
                </div>
            </header>

            <main className="container studio-layout animate-up">
                <section className="editor-section glass-blur">
                    <input
                        type="text"
                        className="title-input-fancy"
                        placeholder="Enter a Heading..."
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        spellCheck={true}
                        autoCorrect="on"
                        autoCapitalize="sentences"
                    />
                    {uploading && (
                        <div style={{ padding: '0.5rem 0', color: '#64748b', fontSize: '0.9rem' }}>
                            ⏳ Uploading image...
                        </div>
                    )}
                    <div className="quill-wrapper">
                        <ReactQuill
                            ref={quillRef}
                            theme="snow"
                            value={content}
                            onChange={setContent}
                            modules={modules}
                            placeholder="Begin your story here..."
                        />
                    </div>
                    <div className="editor-footer-action">
                        <button className="btn-main-premium-lg" onClick={handleSave}>Finish & Save Entry</button>
                    </div>
                </section>

                {!isZen && (
                    <aside className="studio-sidebar">
                        <div className="glass-blur sidebar-card">
                            <h4>Session Stats</h4>
                            <div className="stat-row">
                                <span>Words Written</span>
                                <strong>{wordCount}</strong>
                            </div>
                            <div className="stat-row">
                                <span>Characters</span>
                                <strong>{charCount}</strong>
                            </div>
                        </div>

                        <div className="glass-blur sidebar-card">
                            <h4>Vibe</h4>
                            <div className="mood-selector">
                                {['Creative', 'Focused', 'Reflective', 'Neutral'].map(m => (
                                    <button
                                        key={m}
                                        className={`mood-tag ${mood === m ? 'active' : ''}`}
                                        onClick={() => setMood(m)}
                                    >
                                        {m}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="glass-blur sidebar-card tips-card">
                            <h4>Writer's Tip</h4>
                            <p>"Don't get it right, get it written." — James Thurber</p>
                        </div>
                    </aside>
                )}
            </main>
        </div>
    );
};

export default WritingStudio;
