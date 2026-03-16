'use client';

import { useState } from 'react';
import { FaTimes } from 'react-icons/fa';

const EmailModal = ({ isOpen, onClose, onSend, isSending, defaultEmail = '' }) => {
    const [message, setMessage] = useState('');
    const [recipientEmail, setRecipientEmail] = useState(defaultEmail);
    const [includeZip, setIncludeZip] = useState(false);
    const [includeCsv, setIncludeCsv] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSend(message, recipientEmail, includeZip, includeCsv);
    };

    return (
        <div className="email-modal-overlay">
            <div className="modal-content">
                <button className="close-btn" onClick={onClose}>
                    <FaTimes />
                </button>

                <h3 className="modal-title">Email Selected Receipts</h3>
                <p className="modal-description">Send the selected receipts to an email address. You can add an optional note below.</p>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Recipient Email</label>
                        <input
                            type="email"
                            value={recipientEmail}
                            onChange={(e) => setRecipientEmail(e.target.value)}
                            placeholder="Enter recipient email"
                            className="email-input"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Message (Optional)</label>
                        <textarea
                            rows="6"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Add a note to your email..."
                        />
                    </div>

                    <div className="checkboxes-and-actions">

                        <div className="form-group checkbox-group">
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={includeZip}
                                    onChange={(e) => setIncludeZip(e.target.checked)}
                                />
                                <div>Attach Images (ZIP)</div>
                            </label>
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={includeCsv}
                                    onChange={(e) => setIncludeCsv(e.target.checked)}
                                />
                                <div>Attach Data (CSV)</div>
                            </label>
                        </div>

                        <div className="modal-actions">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={onClose}
                                disabled={isSending}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn btn-secondary"
                                disabled={isSending}
                            >
                                {isSending ? 'Sending...' : 'Send Email'}
                            </button>
                        </div>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default EmailModal;
