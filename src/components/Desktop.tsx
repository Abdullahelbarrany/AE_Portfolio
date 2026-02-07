import React from 'react';
import Folder from './Folder';
import './Desktop.css';

const Desktop = () => {
    return (
        <div className="desktop">
            <Folder name="Images" path="/assets/folders/Images" />
            <Folder name="CV" path="/assets/folders/CV" />
            <Folder name="Work Samples" path="/assets/folders/WorkSamples" />
        </div>
    );
};

export default Desktop;