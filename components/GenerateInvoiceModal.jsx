'use client';

import { useState, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { FaPrint } from 'react-icons/fa';

const GenerateInvoiceModal = ({ isOpen, onClose, selectedReceipts = [] }) => {

    const { data: session } = useSession();
    const printRef = useRef();

    const [invoiceDetails, setInvoiceDetails] = useState({
        invoiceNumber: `INV-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}`,
        date: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // +14 days
        clientName: '',
        clientAddress: '',
        senderName: session?.user?.name || '',
        senderAddress: '',
        notes: 'Thank you for your business!',
        vatRate: 0,
        logo: null,
        // --- NEW: Freelance Labor Fields ---
        laborDescription: 'Freelance Services',
        hoursWorked: 0,
        hourlyRate: 0

    });

    const handleLogoChange = (e) => {

        const MAX_FILE_SIZE = 5 * 1024 * 1024;
        const file = e.target.files[0];
        const validMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic'];

        if (!validMimeTypes.includes(file.type)) {
            setError("Invalid file type. Only images are allowed.");
            return;
        }

        if (file.size > MAX_FILE_SIZE) {
            setError("File exceeds 5MB limit.");
            return;
        }
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setInvoiceDetails(prev => ({ ...prev, logo: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    if (!isOpen) return null;

    // Calculate Totals
    const laborTotal = (invoiceDetails.hoursWorked || 0) * (invoiceDetails.hourlyRate || 0);
    const receiptsSubtotal = selectedReceipts.reduce((sum, r) => sum + r.totalAmount, 0);
    const subtotal = laborTotal + receiptsSubtotal;
    const vatAmount = subtotal * (invoiceDetails.vatRate / 100);
    const total = subtotal + vatAmount;

    const handlePrint = async () => {
        try {
            const res = await fetch('/api/user/track-invoice', { method: 'POST' });
            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                alert(errData.message || 'Failed to generate invoice due to usage limits.');
                return;
            }
        } catch (error) {
            console.error('Invoice tracking error:', error);
            alert('An error occurred. Please try again.');
            return;
        }

        const printContent = printRef.current.innerHTML;
        const printWindow = window.open('', '', 'height=900,width=900');
        printWindow.document.write('<html><head><title>Invoice</title>');
        // Add simple styles for printing
        printWindow.document.write(`
      <style>
        body { font-family: 'Helvetica', sans-serif; padding: 40px; color: #333; }
        .invoice-header { display: flex; justify-content: space-between; margin-bottom: 40px; border-bottom: 2px solid #eee; padding-bottom: 20px; }
        .invoice-title { font-size: 32px; font-weight: bold; color: #2c3e50; }
        .meta-group { text-align: right; }
        .addresses { display: flex; justify-content: space-between; margin-bottom: 40px; }
        .address-block h3 { font-size: 14px; text-transform: uppercase; color: #7f8c8d; border-bottom: 1px solid #eee; padding-bottom: 5px; margin-bottom: 10px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
        th { text-align: left; padding: 12px; background: #f8f9fa; border-bottom: 2px solid #ddd; font-size: 12px; text-transform: uppercase; }
        td { padding: 12px; border-bottom: 1px solid #eee; }
        .labor-row { background-color: #f8fbff; } /* Light blue highlight for labor */
        .totals { margin-left: auto; width: 300px; }
        .total-row { display: flex; justify-content: space-between; padding: 8px 0; }
        .total-final { font-weight: bold; font-size: 18px; border-top: 2px solid #333; padding-top: 10px; }
        .notes { margin-top: 50px; padding: 20px; background: #f9f9f9; border-radius: 5px; font-size: 14px; }
        img { max-width: 100%; }
      </style>
    `);
        printWindow.document.write('</head><body>');
        printWindow.document.write(printContent);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 250);
    };

    return (
        <div className="modal-overlay-invoice" id="invoice-modal">
            <div className="modal-content-invoice">
                <div className="top-text">
                    <h2 className="title">Generate Invoice</h2>
                </div>
                <div className="edit-and-preview-container">

                    {/* LEFT: EDIT PANEL */}
                    <div className="invoice-edit">
                        <h3 className="edit-invoice-title">Edit Invoice</h3>

                        <div className="form-group">
                            <label>Logo</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleLogoChange}
                            />
                        </div>

                        {/* --- NEW: Freelance Section --- */}
                        <div style={{ background: '#f1f5f9', padding: '15px', borderRadius: '8px', marginBottom: '15px', border: '1px solid #e2e8f0' }}>
                            <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#334155' }}>Freelance Services (Optional)</h4>

                            <div className="form-group">
                                <label>Description of Work</label>
                                <input
                                    type="text"
                                    value={invoiceDetails.laborDescription}
                                    placeholder="e.g., Web Development"
                                    onChange={(e) => setInvoiceDetails({ ...invoiceDetails, laborDescription: e.target.value })}
                                />
                            </div>

                            <div style={{ display: 'flex', gap: '10px' }}>
                                <div className="form-group" style={{ flex: 1, margin: 0 }}>
                                    <label>Hours</label>
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.5"
                                        value={invoiceDetails.hoursWorked}
                                        onChange={(e) => setInvoiceDetails({ ...invoiceDetails, hoursWorked: parseFloat(e.target.value) || 0 })}
                                    />
                                </div>
                                <div className="form-group" style={{ flex: 1, margin: 0 }}>
                                    <label>Rate ($)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        step="1"
                                        value={invoiceDetails.hourlyRate}
                                        onChange={(e) => setInvoiceDetails({ ...invoiceDetails, hourlyRate: parseFloat(e.target.value) || 0 })}
                                    />
                                </div>
                            </div>
                        </div>
                        {/* ------------------------------ */}

                        <div className="form-group">
                            <label>Invoice #</label>
                            <input
                                type="text"
                                value={invoiceDetails.invoiceNumber}
                                onChange={(e) => setInvoiceDetails({ ...invoiceDetails, invoiceNumber: e.target.value })}
                            />
                        </div>

                        <div className='dates-container'>
                            <div className="form-group" style={{ flex: 1 }}>
                                <label>Date</label>
                                <input
                                    type="date"
                                    value={invoiceDetails.date}
                                    onChange={(e) => setInvoiceDetails({ ...invoiceDetails, date: e.target.value })}
                                />
                            </div>
                            <div className="form-group" style={{ flex: 1 }}>
                                <label>Due Date</label>
                                <input
                                    type="date"
                                    value={invoiceDetails.dueDate}
                                    onChange={(e) => setInvoiceDetails({ ...invoiceDetails, dueDate: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Client Name</label>
                            <input
                                type="text"
                                value={invoiceDetails.clientName}
                                placeholder="Client Name"
                                onChange={(e) => setInvoiceDetails({ ...invoiceDetails, clientName: e.target.value })}
                            />
                        </div>

                        <div className="form-group">
                            <label>Client Address</label>
                            <textarea
                                value={invoiceDetails.clientAddress}
                                placeholder="123 Business Rd..."
                                onChange={(e) => setInvoiceDetails({ ...invoiceDetails, clientAddress: e.target.value })}
                            />
                        </div>

                        <div className="form-group">
                            <label>VAT Rate (%)</label>
                            <input
                                type="number"
                                value={invoiceDetails.vatRate}
                                onChange={(e) => setInvoiceDetails({ ...invoiceDetails, vatRate: parseFloat(e.target.value) || 0 })}
                            />
                        </div>

                        <div className="form-group">
                            <label>Notes</label>
                            <textarea
                                value={invoiceDetails.notes}
                                placeholder="Add any additional notes or instructions..."
                                onChange={(e) => setInvoiceDetails({ ...invoiceDetails, notes: e.target.value })}
                            />
                        </div>

                        <button className="btn btn-primary full-width save-pdf-btn" onClick={handlePrint}>
                            <FaPrint style={{ marginRight: '8px' }} /> Print / Save PDF
                        </button>
                    </div>

                    {/* RIGHT: PREVIEW PANEL */}
                    <div className="invoice-preview">

                        <div ref={printRef}>
                            {/* --- INVOICE DOCUMENT START --- */}
                            <div className="invoice-header">
                                <div>
                                    {invoiceDetails.logo && (
                                        <img
                                            src={invoiceDetails.logo}
                                            alt="Logo"
                                            style={{ maxWidth: '150px', maxHeight: '80px', marginBottom: '10px', display: 'block' }}
                                        />
                                    )}
                                    <div className="invoice-title">INVOICE</div>
                                    <div style={{ marginTop: '10px', color: '#666' }}>#{invoiceDetails.invoiceNumber}</div>
                                </div>
                                <div className="meta-group">
                                    <div><strong>Date:</strong> {invoiceDetails.date}</div>
                                    <div><strong>Due Date:</strong> {invoiceDetails.dueDate}</div>
                                </div>
                            </div>

                            <div className="addresses">
                                <div className="address-block">
                                    <h3>From:</h3>
                                    <div>{invoiceDetails.senderName}</div>
                                    <div style={{ whiteSpace: 'pre-wrap' }}>{invoiceDetails.senderAddress || session?.user?.email}</div>
                                </div>
                                <div className="address-block">
                                    <h3>Bill To:</h3>
                                    <div>{invoiceDetails.clientName || '[Client Name]'}</div>
                                    <div style={{ whiteSpace: 'pre-wrap' }}>{invoiceDetails.clientAddress || '[Client Address]'}</div>
                                </div>
                            </div>

                            <table>
                                <thead>
                                    <tr>
                                        <th>Description</th>
                                        <th>Date / Qty</th>
                                        <th>Category / Rate</th>
                                        <th style={{ textAlign: 'right' }}>Amount</th>
                                    </tr>
                                </thead>
                                <tbody>

                                    {/* --- NEW: Render Labor Row if Hours exist --- */}
                                    {invoiceDetails.hoursWorked > 0 && (
                                        <tr className="labor-row">
                                            <td><strong>{invoiceDetails.laborDescription}</strong></td>
                                            <td>{invoiceDetails.hoursWorked} hrs</td>
                                            <td>${invoiceDetails.hourlyRate.toFixed(2)}/hr</td>
                                            <td style={{ textAlign: 'right' }}><strong>${laborTotal.toFixed(2)}</strong></td>
                                        </tr>
                                    )}

                                    {/* Existing Receipts Rendering */}

                                    {selectedReceipts.map((receipt, index) => (
                                        <tr key={index}>
                                            <td>{receipt.merchantName}</td>
                                            <td>{new Date(receipt.transactionDate).toLocaleDateString()}</td>
                                            <td>{receipt.category}</td>
                                            <td style={{ textAlign: 'right' }}>${receipt.totalAmount.toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <div className="totals">
                                <div className="total-row">
                                    <span>Subtotal:</span>
                                    <span>${subtotal.toFixed(2)}</span>
                                </div>
                                {invoiceDetails.vatRate > 0 && (
                                    <div className="total-row">
                                        <span>VAT ({invoiceDetails.vatRate}%):</span>
                                        <span>${vatAmount.toFixed(2)}</span>
                                    </div>
                                )}
                                <div className="total-row total-final">
                                    <span>Total:</span>
                                    <span>${total.toFixed(2)}</span>
                                </div>
                            </div>

                            {invoiceDetails.notes && (
                                <div className="notes">
                                    <strong>Notes:</strong><br />
                                    {invoiceDetails.notes}
                                </div>
                            )}
                            {/* --- INVOICE DOCUMENT END --- */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GenerateInvoiceModal;