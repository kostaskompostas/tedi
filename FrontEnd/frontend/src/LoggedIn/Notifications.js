import { React, useEffect } from "react"
import axios from "axios"
import profilepic from "../icons/profile.png"

const Notifications = (props) => {
    const scrollstyle = {
        height: "200px",
        width: "600px",
        overflowY: "auto",
        position: "relative",
    }
    const requests = [
        { name: "olivia", surname: "pierce" },
        { name: "dutch", surname: "vanderlinde" },
        { name: "optimus", surname: "prime" },
        { name: "olivia", surname: "pierce" },
        { name: "dutch", surname: "vanderlinde" },
        { name: "optimus", surname: "prime" },
        { name: "olivia", surname: "pierce" },
        { name: "dutch", surname: "vanderlinde" },
        { name: "optimus", surname: "prime" },
        { name: "olivia", surname: "pierce" },
        { name: "dutch", surname: "vanderlinde" },
        { name: "optimus", surname: "prime" },
    ]
    const actionStyle = {
        width: "8rem",
    }
    const interests = [
        {
            name: "olivia",
            surname: "pierce",
            action: "liked",
            subject: "post1",
        },
        {
            name: "dutch",
            surname: "vanderlinde",
            action: "commented on",
            subject: "post2",
        },
        {
            name: "optimus",
            surname: "prime",
            action: "liked",
            subject: "post3",
        },

        {
            name: "optimus",
            surname: "prime",
            action: "commented on",
            subject: "post4",
        },
    ]
    return (
        <div className="d-flex flex-column align-items-center">
            <div className="d-flex flex-column align-items start">
                <h3>Connection Requests</h3>
                <ul style={scrollstyle} className="border border-primary">
                    {requests.map((request) => (
                        <li className="d-flex justify-content-between align-items-center m-1">
                            <img src={profilepic} height="30px" width="30px" />
                            {request.name + " " + request.surname}
                            <div className="ms-5 ">
                                <button className="btn btn-primary m-1 btn-sm">
                                    view profile
                                </button>
                                <button className="btn btn-success m-1 btn-sm">
                                    connect
                                </button>
                                <button className="btn btn-danger m-1 btn-sm">
                                    ignore
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="d-flex flex-column align-items start">
                <h3>Interest notifications</h3>
                <div
                    style={scrollstyle}
                    className="border border-primary d-flex flex-column"
                >
                    {interests.map((event) => (
                        <div className="d-flex justify-content-between align-items-center m-1">
                            <img src={profilepic} height="30px" width="30px" />
                            <div className=" text-left">
                                {event.name + " " + event.surname}
                            </div>
                            <div className=" text-left" style={actionStyle}>
                                {event.action}
                            </div>
                            <button>{event.subject}</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
export default Notifications
