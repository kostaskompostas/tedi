import { Avatar } from "../../util/util.js"
import profilePic from "../../icons/profile.png"
import { propTypes } from "react-bootstrap/esm/Image"
import { React, useEffect, useState } from "react"
export default function Profile(props) {
    const [connections, SetConnections] = useState(props.userInfo.collaborators)
    useEffect(() => {
        props.FetchUserData()
    }, [])

    const connStyle = {
        overflowY: "auto",
        border: "3px solid black",
        width: "300px",
        height: "400px",
        position: "relative",
    }

    //connections should also be buttons that take you to their profile page

    return (
        <div className="d-flex flex-column align-items-start">
            <div className="d-flex flex-column bg-info p-3 border border-dark rounded">
                <div className=" border-dark border-bottom">
                    <div className="d-flex flex-column p-2">
                        <h2>Welcome,</h2>
                        {props.userInfo !== "" ? (
                            <Avatar
                                user_email={props.userInfo.email}
                                myHelper={props.myHelper}
                                width="80px"
                                height="80px"
                            />
                        ) : null}
                    </div>
                    <div>
                        <h5>Current position</h5>
                        <h4>CFO UAC Mars facility</h4>
                    </div>
                </div>
                <div className="d-flex flex-column mt-4">
                    <h2>Connections</h2>
                    <ul key="connections" style={connStyle} className="">
                        {connections != undefined
                            ? connections.map((person) => (
                                  <li key={person.email} className="d-flex p-2">
                                      <Avatar
                                          user_email={person.email}
                                          myHelper={props.myHelper}
                                          width="80px"
                                          height="80px"
                                          userName={
                                              person.first_name +
                                              " " +
                                              person.last_name
                                          }
                                      />
                                  </li>
                              ))
                            : null}
                    </ul>
                </div>
            </div>
        </div>
    )
}
