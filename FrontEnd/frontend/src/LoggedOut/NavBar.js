import React from "react"
import { NavLink, Link } from "react-router-dom"
import "../App.css"

const navStyle = {
    color: "black",
    textDecoration: "none",
}
const NavBar = () => {
    return (
        <nav className="m-3">
            <ul className="nav-links">
                <Link style={navStyle} to={"/home"}>
                    <li className="Logo " key="logo">
                        <h3>jobo</h3>
                    </li>
                </Link>
                <li>
                    <NavLink style={navStyle} to="/home">
                        Home
                    </NavLink>
                </li>
                <ul className="d-flex align-items-center">
                    <li className="m-2">
                        <NavLink style={navStyle} to="/signup">
                            Sign Up
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            className="btn btn-primary"
                            style={navStyle}
                            to="/signin"
                        >
                            Sign In
                        </NavLink>
                    </li>
                </ul>
            </ul>
        </nav>
    )
}

export default NavBar
