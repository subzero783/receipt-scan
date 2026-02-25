import React, { useState, useEffect } from 'react';
import { FiMail, FiHelpCircle, FiChevronDown } from 'react-icons/fi';
import '@/assets/styles/account-settings.css';
import profileDefault from "@/assets/images/profile.png";
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { toast } from "react-toastify";

const AccountSettings = () => {

    const { data: session, status } = useSession();

    const [formData, setFormData] = useState({
        username: '',
        website: '',
        email: '',
        about: '',
        currentPassword: '',
        newPassword: '',
        language: '',
        image: ''
    });
    const [loading, setLoading] = useState(true);
    const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        const fetchUserData = async () => {
            if (status === 'authenticated') {
                try {
                    const res = await fetch('/api/user/settings');
                    if (res.ok) {
                        const data = await res.json();
                        setFormData({
                            username: data.username || '',
                            website: data.website || '',
                            email: data.email || '',
                            about: data.about || '',
                            currentPassword: '',
                            newPassword: '',
                            language: data.language || 'en',
                            image: data.image || ''
                        });
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error);
                } finally {
                    setLoading(false);
                }
            } else if (status === 'unauthenticated') {
                setLoading(false);
            }
        };
        fetchUserData();
    }, [status]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatusMessage({ type: '', text: '' });

        try {
            const res = await fetch('/api/user/settings', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                setStatusMessage({ type: 'success', text: 'Settings updated successfully!' });
                toast.success("Settings updated successfully!");
                setFormData({ ...formData, currentPassword: '', newPassword: '' });
            } else {
                const text = await res.text();
                setStatusMessage({ type: 'error', text: text || 'Error updating settings.' });
                toast.error("Error updating settings.");
            }
        } catch (error) {
            console.error("Error updating settings:", error);
            setStatusMessage({ type: 'error', text: 'Error updating settings.' });
            toast.error("Error updating settings.");
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <section className="account-settings-section">
            <div className="container">
                <div className="row">
                    <div className="col">
                        <div className="account-settings-container">
                            <form className="account-settings-form" onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label className="form-label">Photo</label>
                                    <div className="photo-upload-wrapper">
                                        <div className="photo-avatar">
                                            {
                                                session?.user?.image ? (
                                                    <img src={session.user.image} alt="" />
                                                ) : (
                                                    <Image
                                                        src={profileDefault}
                                                        alt=""
                                                        width={40}
                                                        height={40}
                                                    />
                                                )
                                            }
                                        </div>
                                        <label className="upload-profile-btn btn btn-primary">
                                            Upload photo
                                            <input type="file" className="hidden-input" accept="image/*" />
                                        </label>
                                    </div>
                                </div>

                                <div className="form-group username-form-group">
                                    <label className="form-label" htmlFor="username">Username</label>
                                    <input type="text" id="username" className="form-input" value={formData.username} onChange={handleChange} required />
                                </div>

                                <div className="form-group">
                                    <label className="form-label" htmlFor="website">Website</label>
                                    <div className="input-with-prefix">
                                        <span className="prefix">http://</span>
                                        <input type="url" id="website" className="form-input" placeholder="www.receiptscan.com" value={formData.website} onChange={handleChange} />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="form-label" htmlFor="email">Email address</label>
                                    <div className="input-wrapper">
                                        <FiMail className="input-icon-left" />
                                        <input type="email" id="email" className="form-input with-icon-left with-icon-right" placeholder="email@example.com" value={formData.email} onChange={handleChange} required />
                                        <FiHelpCircle className="input-icon-right" />
                                    </div>
                                </div>

                                <div className="form-group about-form-group">
                                    <label className="form-label" htmlFor="about">About</label>
                                    <textarea id="about" className="form-textarea" placeholder="Type your message..." value={formData.about} onChange={handleChange}></textarea>
                                    <div className="char-count">{263 - formData.about.length} characters left</div>
                                </div>

                                <div className="form-group password-form-group">
                                    <label className="form-label">Password</label>
                                    <div className="passwords-container">
                                        <div className="input-wrapper password-input">
                                            <input type="password" id="currentPassword" placeholder="Current password" className="form-input with-icon-right" value={formData.currentPassword} onChange={handleChange} />
                                            <FiHelpCircle className="input-icon-right" />
                                        </div>
                                        <div className="input-wrapper">
                                            <input type="password" id="newPassword" placeholder="New password" className="form-input with-icon-right" value={formData.newPassword} onChange={handleChange} />
                                            <FiHelpCircle className="input-icon-right" />
                                        </div>
                                    </div>
                                </div>

                                <div className="form-group last-form-group">
                                    <label className="form-label" htmlFor="language">Language</label>
                                    <div className="select-wrapper">
                                        <select id="language" className="form-select" value={formData.language} onChange={handleChange}>
                                            <option value="" disabled>Select one...</option>
                                            <option value="en">English</option>
                                            <option value="es">Spanish</option>
                                            <option value="fr">French</option>
                                        </select>
                                        <FiChevronDown className="select-icon" />
                                    </div>
                                </div>

                                <div className="form-actions">
                                    <button type="button" className="cancel-btn btn btn-secondary" onClick={() => window.location.reload()}>Cancel</button>
                                    <button type="submit" className="save-btn btn btn-primary">Save</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AccountSettings;