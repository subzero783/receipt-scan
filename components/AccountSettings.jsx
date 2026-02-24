import React from 'react';
import { FiImage, FiMail, FiHelpCircle, FiChevronDown } from 'react-icons/fi';
import '@/assets/styles/account-settings.css';

const AccountSettings = () => {
    return (
        <section className="account-settings-section">
            <div className="account-settings-container">
                <form className="account-settings-form">

                    <div className="form-group mb-4">
                        <label className="form-label">Photo</label>
                        <div className="photo-upload-wrapper">
                            <div className="photo-avatar">
                                <FiImage className="photo-icon" />
                            </div>
                            <label className="upload-btn">
                                Upload photo
                                <input type="file" className="hidden-input" accept="image/*" />
                            </label>
                        </div>
                    </div>

                    <div className="form-group mb-4">
                        <label className="form-label" htmlFor="username">Username</label>
                        <input type="text" id="username" className="form-input" />
                    </div>

                    <div className="form-group mb-4">
                        <label className="form-label" htmlFor="website">Website</label>
                        <div className="input-with-prefix">
                            <span className="prefix">http://</span>
                            <input type="url" id="website" className="form-input" placeholder="www.relume.io" />
                        </div>
                    </div>

                    <div className="form-group mb-4">
                        <label className="form-label" htmlFor="email">Email address</label>
                        <div className="input-wrapper">
                            <FiMail className="input-icon-left" />
                            <input type="email" id="email" className="form-input with-icon-left with-icon-right" placeholder="email@example.com" />
                            <FiHelpCircle className="input-icon-right" />
                        </div>
                    </div>

                    <div className="form-group mb-4">
                        <label className="form-label" htmlFor="about">About</label>
                        <textarea id="about" className="form-textarea" placeholder="Type your message..."></textarea>
                        <div className="char-count">263 characters left</div>
                    </div>

                    <div className="form-group mb-4">
                        <label className="form-label">Password</label>
                        <div className="input-wrapper mb-3">
                            <input type="password" placeholder="Current password" className="form-input with-icon-right" />
                            <FiHelpCircle className="input-icon-right" />
                        </div>
                        <div className="input-wrapper">
                            <input type="password" placeholder="New password" className="form-input with-icon-right" />
                            <FiHelpCircle className="input-icon-right" />
                        </div>
                    </div>

                    <div className="form-group mb-5">
                        <label className="form-label" htmlFor="language">Language</label>
                        <div className="select-wrapper">
                            <select id="language" className="form-select" defaultValue="">
                                <option value="" disabled>Select one...</option>
                                <option value="en">English</option>
                                <option value="es">Spanish</option>
                                <option value="fr">French</option>
                            </select>
                            <FiChevronDown className="select-icon" />
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="button" className="action-btn cancel-btn">Cancel</button>
                        <button type="submit" className="action-btn save-btn">Save</button>
                    </div>
                </form>
            </div>
        </section>
    );
};

export default AccountSettings;