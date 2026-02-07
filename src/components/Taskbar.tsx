import React from 'react';

const Taskbar: React.FC = () => {
    return (
        <div className="taskbar">
            <div className="taskbar-icons">
                <img src="/assets/icons/home.png" alt="Home" />
                <img src="/assets/icons/folder.png" alt="Folders" />
                <img src="/assets/icons/work.png" alt="Work Samples" />
                <img src="/assets/icons/cv.png" alt="CV" />
                <img src="/assets/icons/images.png" alt="Images" />
            </div>
        </div>
    );
};

export default Taskbar;