import NavBar from "./NavBar"

import Home from "./Home/Home"
import Network from "./Network"
import Jobs from "./Jobs"
import Conversations from "./Conversations"

import Notifications from "./Notifications"
import Account from "./Account/Account"
import Settings from "./Settings"

import React, { Component, useState, Children } from "react"

import "../App.css"
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useParams,
    useRouteMatch,
    Redirect,
} from "react-router-dom"

const LoggedInRouter = (props) => {
    console.log(props.myHelper.GetToken())

    let url = window.location.href
    let path = window.location.pathname
    return (
        <Router>
            <div>
                <NavBar SignOut={props.SignOut} />
                <Switch>
                    <Route exact path="/">
                        <Redirect to={"/home"}></Redirect>
                    </Route>
                    <Route
                        path={`/home`}
                        render={() => <Home myHelper={props.myHelper} />}
                    />
                    <Route
                        path={`/network`}
                        render={() => <Network myHelper={props.myHelper} />}
                    />
                    <Route
                        path={"/jobs"}
                        render={() => <Jobs myHelper={props.myHelper} />}
                    />
                    <Route
                        path={"/conversations"}
                        render={() => (
                            <Conversations myHelper={props.myHelper} />
                        )}
                    />

                    <Route
                        path={"/notifications"}
                        render={() => (
                            <Notifications myHelper={props.myHelper} />
                        )}
                    />
                    <Route
                        path={"/account"}
                        render={() => <Account myHelper={props.myHelper} />}
                    />
                    <Route
                        path={"/settings"}
                        render={() => <Settings myHelper={props.myHelper} />}
                    />
                </Switch>
            </div>
        </Router>
    )
}
/*
 */
export default LoggedInRouter
