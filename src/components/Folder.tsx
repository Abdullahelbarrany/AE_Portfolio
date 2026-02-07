import React from 'react';

interface FolderProps {
    name: string;
    contents: string[];
    onOpen: () => void;
}

const Folder: React.FC<FolderProps> = ({ name, contents, onOpen }) => {
    return (
        <div className="folder" onClick={onOpen}>
            <div className="folder-icon">
                {/* Folder icon can be added here */}
            </div>
            <div className="folder-name">{name}</div>
            <div className="folder-contents">
                {contents.map((item, index) => (
                    <div key={index} className="folder-item">
                        {item}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Folder;