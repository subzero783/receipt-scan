import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { MdClose, MdZoomIn, MdZoomOut } from 'react-icons/md';

const ImageModal = ({ src, onClose }) => {
    const [scale, setScale] = useState(1);
    const [isClosing, setIsClosing] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Prevent body scroll when modal is open
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(onClose, 300); // Match animation duration
    };

    const handleZoomIn = (e) => {
        e.stopPropagation();
        setScale(prev => Math.min(prev + 0.25, 3));
    };

    const handleZoomOut = (e) => {
        e.stopPropagation();
        setScale(prev => Math.max(prev - 0.25, 0.5));
    };

    if (!mounted) return null;

    return createPortal(
        <div
            className={`image-modal-overlay ${isClosing ? 'closing' : ''}`}
            onClick={handleClose}
        >
            <button type="button" className="modal-close-btn" onClick={handleClose}>
                <MdClose size={32} />
            </button>

            <div
                className="image-modal-content"
                onClick={(e) => e.stopPropagation()} // Prevent close when clicking content area
            >
                <div className="image-wrapper" style={{ transform: `scale(${scale})` }}>
                    <img src={src} alt="Receipt" />
                </div>
            </div>

            <div className="modal-zoom-controls" onClick={(e) => e.stopPropagation()}>
                <button type="button" onClick={handleZoomOut} disabled={scale <= 0.5}>
                    <MdZoomOut size={24} />
                </button>
                <span className="zoom-level">{Math.round(scale * 100)}%</span>
                <button type="button" onClick={handleZoomIn} disabled={scale >= 3}>
                    <MdZoomIn size={24} />
                </button>
            </div>
        </div>,
        document.body
    );
};

export default ImageModal;
