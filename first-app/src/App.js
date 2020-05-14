import React from 'react';
import logo from './logo.svg';
import './App.css';
import Test from './components/Test';
import 'bootstrap/dist/css/bootstrap.min.css';
import Symbol from './components/Symbol';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>

      <p>
        Helelo
      </p>
      <Test></Test>
      <Symbol></Symbol>
      </header>

    </div>
  );
}

export default App;
