import "../App.css"
import {
    BrowserRouter as Router,
    Redirect,
    Switch,
    Route,
} from "react-router-dom"
import NavBar from "./NavBar"
import Welcome from "./Welcome"
import SignIn from "./SignIn"
import SignUp from "./SignUp"

const LoggedOutRouter = (props) => {
    return (
        <Router>
            <div>
                <NavBar />
                <Switch>
                    <Route exact path="/">
                        <Redirect to="/home" />
                    </Route>
                    <Route
                        path="/home"
                        render={() => <Welcome myHelper={props.myHelper} />}
                    />
                    <Route
                        path="/signup"
                        render={() => (
                            <SignUp
                                myHelper={props.myHelper}
                                SignIn={props.SignIn}
                            />
                        )}
                    />
                    <Route
                        path="/signin"
                        render={() => (
                            <SignIn
                                myHelper={props.myHelper}
                                SignIn={props.SignIn}
                            />
                        )}
                    />
                </Switch>
            </div>
        </Router>
    )
}
export default LoggedOutRouter
