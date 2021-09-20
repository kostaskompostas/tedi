import React,{Component,useState,useeffect} from "react";
import {Redirect } from "react-router-dom";

import './App.css';
import  axios from "axios";

import LoggedOutRouter  from './LoggedOut/LoggedOutRouter';
import LoggedInRouter  from './LoggedIn/LoggedInRouter';


axios.defaults.baseURL = "http://192.168.1.7:8000"

function App() {
  const [logged,setLogged] = useState(false);

  const LogIn = () =>{
    console.log("logging in");
    setLogged(true);
    <Redirect push to="/home"/>;
  }

  const LogOut = () =>{
    console.log("logging out");
    setLogged(false);
    <Redirect push to ="/welcome"/>;
  }
  
  const GetContent = () =>{
    let content = logged ?(
      <LoggedInRouter logout={LogOut}/> 
    ):(
      <LoggedOutRouter login = {LogIn}/>
    )

    return content;
  }

  return GetContent();
  
}

export default App;
