import React from "react";
import {NavLink, Link } from "react-router-dom";
import "../App.css"

const navStyle = {
  color: "white",
  textDecoration: "none",
};
const NavBar = () => {
  return (
        <nav>
          <NavLink to="/home">
            Home
          </NavLink>
          <NavLink to="/signup">
            signup
          </NavLink>
          <NavLink to="/signin">
            signin
          </NavLink>
        </nav>

  );
};

export default NavBar;
