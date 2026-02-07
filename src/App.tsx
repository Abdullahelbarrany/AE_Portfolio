import React from 'react';
import Desktop from './components/Desktop';
import Taskbar from './components/Taskbar';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';

const App: React.FC = () => {
    return (
        <Router>
            <div className="app">
                <Desktop />
                <Taskbar />
                <Switch>
                    <Route path="/" exact component={Home} />
                    <Route path="/about" component={About} />
                </Switch>
            </div>
        </Router>
    );
};

export default App;