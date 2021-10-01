import NavBar from "./NavBar"

import Home from "./Home/Home"
import Network from "./Network"
import Jobs from "./Jobs"
import Conversations from "./Conversations"

import Notifications from "./Notifications"
import Account from "./Account/Account"
import Settings from "./Settings"

import Admin from "./Admin"

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
    console.log(props.userInfo)
    let url = window.location.href
    let path = window.location.pathname
    let myprops = {
        userInfo: props.userInfo,
        myHelper: props.myHelper,
        FetchUserData: props.FetchUserData,
    }
    return (
        <Router>
            <div>
                <NavBar
                    SignOut={props.SignOut}
                    userInfo={props.userInfo}
                    myHelper={props.myHelper}
                />
                <Switch>
                    <Route exact path="/">
                        <Redirect to={"/home"}></Redirect>
                    </Route>
                    <Route
                        path={`/home`}
                        render={() => (
                            <Home
                                userInfo={props.userInfo}
                                myHelper={props.myHelper}
                                FetchUserData={props.FetchUserData}
                            />
                        )}
                    />
                    <Route
                        path={`/network`}
                        render={() => (
                            <Network
                                userInfo={props.userInfo}
                                myHelper={props.myHelper}
                                FetchUserData={props.FetchUserData}
                            />
                        )}
                    />
                    <Route
                        path={"/jobs"}
                        render={() => (
                            <Jobs
                                userInfo={props.userInfo}
                                myHelper={props.myHelper}
                                FetchUserData={props.FetchUserData}
                            />
                        )}
                    />
                    <Route
                        path={"/conversations"}
                        render={() => (
                            <Conversations
                                userInfo={props.userInfo}
                                myHelper={props.myHelper}
                                FetchUserData={props.FetchUserData}
                            />
                        )}
                    />

                    <Route
                        path={"/notifications"}
                        render={() => (
                            <Notifications
                                userInfo={props.userInfo}
                                myHelper={props.myHelper}
                                FetchUserData={props.FetchUserData}
                            />
                        )}
                    />
                    <Route
                        path={`/account`}
                        render={(exampleprops) => (
                            <Account
                                {...exampleprops}
                                userInfo={props.userInfo}
                                myHelper={props.myHelper}
                                FetchUserData={props.FetchUserData}
                            />
                        )}
                    />
                    <Route
                        path={"/settings"}
                        render={() => (
                            <Settings
                                userInfo={props.userInfo}
                                myHelper={props.myHelper}
                                FetchUserData={props.FetchUserData}
                            />
                        )}
                    />
                    {
                        <Route
                            path={"/admin"}
                            render={() => (
                                <Admin
                                    userInfo={props.userInfo}
                                    myHelper={props.myHelper}
                                    FetchUserData={props.FetchUserData}
                                />
                            )}
                        />
                    }
                </Switch>
            </div>
        </Router>
    )
}
/*
 */
export default LoggedInRouter
