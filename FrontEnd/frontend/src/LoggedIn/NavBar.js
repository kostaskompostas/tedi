import React, { Children } from "react"
import "../App.css"
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useParams,
    useRouteMatch,
} from "react-router-dom"

import home from "../icons/home.png"
import jobs from "../icons/briefcase.png"
import network from "../icons/network.png"
import conversations from "../icons/chat.png"

import notifications from "../icons/notifications.png"
import profile from "../icons/profile.png"
import fix from "../icons/fix.png"

const NavBar = (props) => {
    let { path, url } = useRouteMatch()

    const pages = [
        {
            url: `/home`,
            name: "home",
            icon: home,
        },
        {
            url: "/network",
            name: "network",
            icon: network,
        },
        {
            url: "jobs",
            name: "jobs",
            icon: jobs,
        },
        {
            url: `/conversations`,
            name: "conversations",
            icon: conversations,
        },
    ]

    const personalPages = [
        { url: "/notifications", name: "notifications", icon: notifications },

        { url: "/settings", name: "settings", icon: fix },
    ]

    const navStyle = {
        color: "white",
        textDecoration: "none",
    }

    return props.userInfo != undefined ? (
        <nav>
            <ul className="nav-links" key="bazinga">
                <Link key={"logoicon"} style={navStyle} to={"/home"}>
                    <li className="Logo " key="logo">
                        <h3>jobo</h3>
                    </li>
                </Link>

                <li key="pages">
                    <ul key="generalpages" className="d-flex ms-5 me-5">
                        {pages.map((page) => (
                            <Link
                                key={page.name}
                                style={navStyle}
                                to={page.url}
                            >
                                <li
                                    className="d-flex align-items-center badge rounded-pill bg-primary"
                                    id={page.name}
                                    key={page.name}
                                >
                                    <img
                                        alt="empty img"
                                        width="40px"
                                        height="40px"
                                        src={page.icon}
                                    />
                                    {page.name}{" "}
                                </li>
                            </Link>
                        ))}
                    </ul>
                </li>

                {personalPages.map((page) => (
                    <Link key={page.name} style={navStyle} to={page.url}>
                        <li
                            className="d-flex align-items-center badge rounded-pill bg-primary"
                            id={page.name}
                            key={page.name}
                        >
                            <img
                                alt="empty img"
                                width="40px"
                                height="40px"
                                src={page.icon}
                            />
                            {page.name}{" "}
                        </li>
                    </Link>
                ))}
                <Link
                    key={"account"}
                    style={navStyle}
                    to={{
                        pathname: "/account",
                        state: { viewUser: props.userInfo.email },
                    }}
                >
                    <li className="d-flex align-items-center badge rounded-pill bg-primary">
                        <img
                            alt="empty img"
                            width="40px"
                            height="40px"
                            src={profile}
                        />
                        {"account"}{" "}
                    </li>
                </Link>
                <li key="logout">
                    <button
                        onClick={props.SignOut}
                        value="log out"
                        className="btn btn-danger "
                    >
                        <h6>Log out</h6>
                    </button>
                </li>
            </ul>
        </nav>
    ) : null
}

export default NavBar
