import React from 'react';

interface FileViewerProps {
    fileType: string;
    filePath: string;
}

const FileViewer: React.FC<FileViewerProps> = ({ fileType, filePath }) => {
    const renderContent = () => {
        switch (fileType) {
            case 'image':
                return <img src={filePath} alt="File content" style={{ maxWidth: '100%', maxHeight: '100%' }} />;
            case 'pdf':
                return <iframe src={filePath} title="PDF Viewer" style={{ width: '100%', height: '100%' }} />;
            case 'doc':
            case 'docx':
                return <iframe src={`https://docs.google.com/gview?url=${filePath}&embedded=true`} title="Document Viewer" style={{ width: '100%', height: '100%' }} />;
            default:
                return <p>Unsupported file type.</p>;
        }
    };

    return (
        <div className="file-viewer">
            {renderContent()}
        </div>
    );
};

export default FileViewer;