import "../App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import NavBar from "./NavBar";
import Welcome from "./Welcome"
import SignIn from "./SignIn";
import SignUp from "./SignUp";

const LoggedOutRouter = (props) => {
  return (
    <Router>
      <div>
        
        <NavBar />
        <Switch>
          <Route path="/home" render={()=><Welcome/>} />
          <Route path="/signup" render={()=><SignUp/>}/>
          <Route path="/signin" render={() => <SignIn login={props.login} />} />
        </Switch>
      </div>
    </Router>
  );
};
export default LoggedOutRouter;
