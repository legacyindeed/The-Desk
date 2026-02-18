import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ReactQuill, { Quill } from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import './WritingStudio.css';
import BurgerMenu from './BurgerMenu';

import { auth, db, storage } from './firebase';
import { collection, addDoc, doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Register custom fonts
const Font = Quill.import('formats/font');
Font.whitelist = ['lora', 'jakarta', 'inter', 'outfit', 'montserrat', 'manrope'];
Quill.register(Font, true);

// Compress image via canvas before upload (speeds up uploads significantly)
const compressImage = (file, maxWidth = 1200, quality = 0.75) => {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let { width, height } = img;
                if (width > maxWidth) {
                    height = Math.round((height * maxWidth) / width);
                    width = maxWidth;
                }
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                canvas.toBlob((blob) => resolve(blob), 'image/jpeg', quality);
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    });
};

const WritingStudio = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const quillRef = useRef(null);

    // Check if we're editing an existing entry
    const editEntry = location.state?.entry || null;

    const [title, setTitle] = useState(editEntry?.title || '');
    const [content, setContent] = useState(editEntry?.content || '');
    const [mood, setMood] = useState(editEntry?.mood || 'Neutral');
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

    // Custom image handler — compresses then uploads to Firebase Storage
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
                // Compress before uploading — much faster for large photos
                const compressed = await compressImage(file);
                const storageRef = ref(storage, `users/${auth.currentUser.uid}/images/${Date.now()}.jpg`);
                await uploadBytes(storageRef, compressed);
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

        try {
            if (editEntry?.id) {
                // UPDATE existing entry
                const entryRef = doc(db, 'users', auth.currentUser.uid, 'entries', editEntry.id);
                await updateDoc(entryRef, {
                    title: title || 'Untitled Entry',
                    content,
                    wordCount,
                    charCount,
                    mood,
                    updatedAt: new Date().toISOString()
                });
            } else {
                // CREATE new entry
                const entry = {
                    type: 'writing',
                    title: title || 'Untitled Entry',
                    content,
                    wordCount,
                    charCount,
                    mood,
                    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                    timestamp: new Date().toISOString()
                };
                await addDoc(collection(db, 'users', auth.currentUser.uid, 'entries'), entry);
            }
            navigate('/analytics');
        } catch (e) {
            console.error("Error saving document: ", e);
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
                    <button className="btn-back-fancy" onClick={() => navigate('/analytics')} style={{ marginRight: '2rem' }}>
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
                    {editEntry && (
                        <div style={{ marginBottom: '0.5rem', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#3b82f6' }}>
                            ✏️ Editing Entry
                        </div>
                    )}
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
                        <div style={{ padding: '0.5rem 0', color: '#3b82f6', fontSize: '0.9rem', fontWeight: 600 }}>
                            ⚡ Compressing & uploading image...
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
                        <button className="btn-main-premium-lg" onClick={handleSave}>
                            {editEntry ? '✓ Save Changes' : 'Finish & Save Entry'}
                        </button>
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
                            {lastSaved && (
                                <div className="stat-row" style={{ marginTop: '0.5rem', opacity: 0.5 }}>
                                    <span style={{ fontSize: '0.8rem' }}>Auto-saved {lastSaved}</span>
                                </div>
                            )}
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
