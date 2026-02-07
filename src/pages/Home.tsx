import React from 'react';

const Home: React.FC = () => {
    return (
        <div className="home">
            <h1>Welcome to My Portfolio</h1>
            <p>This is a simulated Windows desktop environment showcasing my work.</p>
            <div className="portfolio-overview">
                <h2>Portfolio Contents</h2>
                <ul>
                    <li><strong>Images:</strong> A collection of my photography and artwork.</li>
                    <li><strong>CV:</strong> My professional resume and qualifications.</li>
                    <li><strong>Work Samples:</strong> Examples of my projects and contributions.</li>
                </ul>
            </div>
        </div>
    );
};

export default Home;