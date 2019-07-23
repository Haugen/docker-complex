import React from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import SamplePage from './SamplePage';
import Fib from './Fib';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <Link to="/">Home</Link>
          <Link to="sample-page">Sample page</Link>
        </header>
        <div>
          <Route exact path="/" component={Fib} />
          <Route path="/sample-page" component={SamplePage} />
        </div>
      </div>
    </Router>
  );
}

export default App;
