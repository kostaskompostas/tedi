import logo from './logo.svg';
import './App.css';
import  axios from "axios";
import Welcome  from './LoggedOut/Welcome';
import React from 'react';

axios.defaults.baseURL = "http://192.168.1.7:8000"
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
