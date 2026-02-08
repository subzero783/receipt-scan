'use client';

import { useState } from 'react';
import { FaTimes, FapaperPlane } from 'react-icons/fa';

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
        <div className="modal-overlay">
            <div className="modal-content" style={{ maxWidth: '500px' }}>
                <button className="close-btn" onClick={onClose}>
                    <FaTimes />
                </button>

                <h3>Email Selected Receipts</h3>
                <p style={{ marginBottom: '16px', color: '#64748b' }}>
                    Send the selected receipts to an email address. You can add an optional note below.
                </p>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Recipient Email</label>
                        <input
                            type="email"
                            value={recipientEmail}
                            onChange={(e) => setRecipientEmail(e.target.value)}
                            placeholder="Enter recipient email"
                            required
                            style={{
                                width: '100%',
                                padding: '10px',
                                borderRadius: '6px',
                                border: '1px solid #cbd5e1',
                                marginBottom: '10px'
                            }}
                        />
                    </div>

                    <div className="form-group">
                        <label>Message (Optional)</label>
                        <textarea
                            rows="4"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Add a note to your email..."
                            style={{
                                width: '100%',
                                padding: '10px',
                                borderRadius: '6px',
                                border: '1px solid #cbd5e1',
                                resize: 'vertical'
                            }}
                        />
                    </div>

                    <div className="form-group" style={{ display: 'flex', gap: '20px', marginTop: '10px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: '8px' }}>
                            <input
                                type="checkbox"
                                checked={includeZip}
                                onChange={(e) => setIncludeZip(e.target.checked)}
                            />
                            Attach Images (ZIP)
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: '8px' }}>
                            <input
                                type="checkbox"
                                checked={includeCsv}
                                onChange={(e) => setIncludeCsv(e.target.checked)}
                            />
                            Attach Data (CSV)
                        </label>
                    </div>

                    <div className="modal-actions" style={{ justifyContent: 'flex-end', gap: '10px', marginTop: '20px', display: 'flex' }}>
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={onClose}
                            disabled={isSending}
                            style={{ background: '#e2e8f0', color: '#475569', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer' }}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={isSending}
                        >
                            {isSending ? 'Sending...' : 'Send Email'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EmailModal;
