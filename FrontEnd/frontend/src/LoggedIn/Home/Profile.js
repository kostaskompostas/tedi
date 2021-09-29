import { Avatar } from "../../util/util.js"
import profilePic from "../../icons/profile.png"

export default function Profile(props) {
    let connectionCounter = 0
    const connStyle = {
        overflowY: "auto",
        border: "3px solid black",
        width: "300px",
        height: "400px",
        position: "relative",
    }

    //connections should also be buttons that take you to their profile page
    const getConnections = () => {
        let connections = [
            { first_name: "Johnathan", last_name: "Joestar" },
            { first_name: "Jotaro", last_name: "kujo" },
            { first_name: "Dio", last_name: "Brando" },
            { first_name: "Arthur", last_name: "Morgan" },
            { first_name: "Johnathan", last_name: "Joestar" },
            { first_name: "Jotaro", last_name: "kujo" },
            { first_name: "Dio", last_name: "Brando" },
            { first_name: "Arthur", last_name: "Morgan" },
            { first_name: "Johnathan", last_name: "Joestar" },
            { first_name: "Jotaro", last_name: "kujo" },
            { first_name: "Dio", last_name: "Brando" },
            { first_name: "Arthur", last_name: "Morgan" },
            { first_name: "Johnathan", last_name: "Joestar" },
            { first_name: "Jotaro", last_name: "kujo" },
            { first_name: "Dio", last_name: "Brando" },
            { first_name: "Arthur", last_name: "Morgan" },
        ]
        return connections
    }
    return (
        <div className="d-flex flex-column align-items-start">
            <div className="d-flex flex-column bg-info p-3 border border-dark rounded">
                <div className=" border-dark border-bottom">
                    <div className="d-flex p-2">
                        <Avatar
                            avatarUrl={
                                props.myHelper.GetBaseUrl() +
                                props.userInfo.profile_picture
                            }
                            userName={props.userInfo.first_name}
                            width="80px"
                            height="80px"
                        />
                        <div className="ps-3">
                            <h4>Welcome,</h4>
                            <h3>
                                {props.userInfo == ""
                                    ? "loading"
                                    : props.userInfo.first_name +
                                      " " +
                                      props.userInfo.last_name}
                            </h3>
                        </div>
                    </div>
                    <div>
                        <h5>Current position</h5>
                        <h4>CFO UAC Mars facility</h4>
                    </div>
                </div>
                <div className="d-flex flex-column mt-4">
                    <h2>Connections</h2>
                    <ul key="connections" style={connStyle} className="">
                        {getConnections().map((person) => (
                            <li
                                key={"person" + connectionCounter++}
                                className="d-flex p-2"
                            >
                                <Avatar
                                    avatarUrl={profilePic}
                                    width="40px"
                                    height="40px"
                                    userName={
                                        person.first_name +
                                        " " +
                                        person.last_name
                                    }
                                />
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    )
}
