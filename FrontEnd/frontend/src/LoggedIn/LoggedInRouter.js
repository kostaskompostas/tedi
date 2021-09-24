import NavBar from "./NavBar"

import Home from "./Home"
import Network from "./Network"
import Jobs from "./Jobs"
import Conversations from "./Conversations"

import Notifications from "./Notifications"
import Account from "./Account"
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
    const [projectId, setProjectId] = useState(0)
    const [sprintId, setSprintId] = useState(0)

    //get default: gets first available project and first available sprint
    //so it can display something by default

    // path : project/0/settings
    //path : project/0/sprint/5/retro
    // path : project/newproject
    /*
/project/newproject
`/project/:projectid/settings`
/project/:projectid/sprint/:sprintid
/project/:projectid/sprint/retro
*/
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
                        render={() => (
                            <Home peos={"big"} myHelper={props.myHelper} />
                        )}
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
