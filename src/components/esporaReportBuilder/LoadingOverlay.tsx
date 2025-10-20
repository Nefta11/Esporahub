import React from 'react';

interface LoadingOverlayProps {
    isVisible: boolean;
    message?: string;
    submessage?: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
    isVisible,
    message = "Construyendo reporte...",
    submessage = "Por favor espera un momento"
}) => {
    if (!isVisible) return null;

    return (
        <div className="loading-overlay">
            <div className="loading-content">
                <div className="loading-spinner">
                    <div className="spinner-ring"></div>
                    <div className="spinner-ring"></div>
                    <div className="spinner-ring"></div>
                </div>
                <p className="loading-message">{message}</p>
                {submessage && <p className="loading-submessage">{submessage}</p>}
            </div>
        </div>
    );
};

export default LoadingOverlay;