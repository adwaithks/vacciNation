import React from 'react';
import './App.css';
import { Switch, Route, BrowserRouter as Router } from 'react-router-dom';
//import Auth from './components/Auth';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          {/*<Route exact path="/" component={Auth} />*/}
          <Route exact path="/" component={Dashboard} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
