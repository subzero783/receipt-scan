'use client';

import { useState, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { FaTimes, FaPrint } from 'react-icons/fa';

const GenerateInvoiceModal = ({ isOpen, onClose, selectedReceipts }) => {
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
        taxRate: 0,
        logo: null
    });

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
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
    const subtotal = selectedReceipts.reduce((sum, r) => sum + r.totalAmount, 0);
    const taxAmount = subtotal * (invoiceDetails.taxRate / 100);
    const total = subtotal + taxAmount;

    const handlePrint = () => {
        const printContent = printRef.current.innerHTML;
        const originalContent = document.body.innerHTML;

        // Create a print window or replace body content temporarily
        // A safer way for single page apps:
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
                    <h2 className="title">Invoice Settings</h2>
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

                        <div className="form-group">
                            <label>Invoice #</label>
                            <input
                                type="text"
                                value={invoiceDetails.invoiceNumber}
                                onChange={(e) => setInvoiceDetails({ ...invoiceDetails, invoiceNumber: e.target.value })}
                            />
                        </div>

                        <div className="form-group">
                            <label>Date</label>
                            <input
                                type="date"
                                value={invoiceDetails.date}
                                onChange={(e) => setInvoiceDetails({ ...invoiceDetails, date: e.target.value })}
                            />
                        </div>

                        <div className="form-group">
                            <label>Due Date</label>
                            <input
                                type="date"
                                value={invoiceDetails.dueDate}
                                onChange={(e) => setInvoiceDetails({ ...invoiceDetails, dueDate: e.target.value })}
                            />
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
                            <label>Tax Rate (%)</label>
                            <input
                                type="number"
                                value={invoiceDetails.taxRate}
                                onChange={(e) => setInvoiceDetails({ ...invoiceDetails, taxRate: parseFloat(e.target.value) || 0 })}
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

                        <button className="btn btn-primary full-width" style={{ marginTop: '20px' }} onClick={handlePrint}>
                            <FaPrint /> Print / Save PDF
                        </button>
                    </div>

                    {/* RIGHT: PREVIEW PANEL */}
                    <div className="invoice-preview">
                        <button className="close-btn" onClick={onClose}><FaTimes /></button>

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
                                        <th>Description / Merchant</th>
                                        <th>Date</th>
                                        <th>Category</th>
                                        <th style={{ textAlign: 'right' }}>Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
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
                                {invoiceDetails.taxRate > 0 && (
                                    <div className="total-row">
                                        <span>Tax ({invoiceDetails.taxRate}%):</span>
                                        <span>${taxAmount.toFixed(2)}</span>
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