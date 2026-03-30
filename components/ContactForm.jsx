'use client';

import { useState } from 'react';
import { FaRegEnvelope } from "react-icons/fa";
import Link from "next/link";
import siteData from "@/data/siteData.js";

const ContactForm = () => {

    const contactInfo = siteData.find(item => item.contact_info)?.contact_info;

    const { email } = contactInfo;

    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [status, setStatus] = useState({ submitting: false, success: false, error: null });

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ submitting: true, success: false, error: null });

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                setStatus({ submitting: false, success: true, error: null });
                setFormData({ name: '', email: '', message: '' });
            } else {
                const data = await res.json();
                setStatus({ submitting: false, success: false, error: data.message || 'Error submitting form' });
            }
        } catch (error) {
            setStatus({ submitting: false, success: false, error: 'An unexpected error occurred' });
        }
    };

    return (
        <section className="contact-form-section">
            <div className="container">
                <div className="row">
                    <div className="col contact-form-wrapper">
                        {status.success ? (
                            <div className="alert alert-success">
                                Thank you for your message! We will get back to you soon.
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit}>
                                {status.error && (
                                    <div className="alert alert-danger" style={{ color: 'red', marginBottom: '15px' }}>
                                        {status.error}
                                    </div>
                                )}
                                <div className="form-group">
                                    <label htmlFor="name">Name</label>
                                    <input type="text" id="name" name="name" className="form-control" required value={formData.name} onChange={handleChange} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="email">Email</label>
                                    <input type="email" id="email" name="email" className="form-control" required value={formData.email} onChange={handleChange} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="message">Message</label>
                                    <textarea id="message" name="message" className="form-control" rows="5" required value={formData.message} onChange={handleChange} placeholder="Type your message..."></textarea>
                                </div>
                                <button type="submit" className="btn btn-primary" disabled={status.submitting}>
                                    {status.submitting ? 'Submitting...' : 'Submit'}
                                </button>
                            </form>
                        )}
                    </div>
                    <div className="col">
                        <div className="contact-info">
                            <div className="icon-wrapper">
                                <FaRegEnvelope />
                            </div>
                            <div className="text-wrapper">
                                <h2>Email</h2>
                                <Link href={`mailto:${email}`}>{email}</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ContactForm;