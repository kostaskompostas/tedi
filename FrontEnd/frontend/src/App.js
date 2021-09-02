import logo from './logo.svg';
import './App.css';
import  axios from "axios";
import Welcome  from './LoggedOut/Welcome';
import React from 'react';

function App() {

  return (
    <div className="App">
      <header className="App-header">
        <Welcome>hello</Welcome>
      </header>
    </div>
  );
}

export default App;
