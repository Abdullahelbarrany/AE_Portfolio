import React from 'react';

interface WindowProps {
    title: string;
    content: React.ReactNode;
    onClose: () => void;
}

const Window: React.FC<WindowProps> = ({ title, content, onClose }) => {
    return (
        <div className="window">
            <div className="window-header">
                <span>{title}</span>
                <button className="close-button" onClick={onClose}>X</button>
            </div>
            <div className="window-content">
                {content}
            </div>
        </div>
    );
};

export default Window;