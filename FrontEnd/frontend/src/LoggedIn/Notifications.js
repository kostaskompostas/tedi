import { React, useEffect, useState } from "react"
import axios from "axios"
import profilepic from "../icons/profile.png"
import { Avatar } from "../util/util"

const Notifications = (props) => {
    const [conRequests, setConRequests] = useState()
    useEffect(() => {
        FetchRequests()
    }, [])
    const FetchRequests = () => {
        client
            .get("api/collab/?incoming=true", {
                headers: {
                    Authorization: "Token " + props.myHelper.GetToken(),
                },
            })
            .then(
                (response) => {
                    setConRequests(response.data.items)
                    console.log(response.data)
                },
                (error) => console
            )
    }

    let client = props.myHelper.client
    const scrollstyle = {
        height: "200px",
        width: "600px",
        overflowY: "auto",
        position: "relative",
    }

    const actionStyle = {
        width: "8rem",
    }

    const OnConnectionAccept = (e, email) => {
        e.preventDefault()
        client
            .post(
                "/api/collab/",
                { accept: true, user_email: email },
                {
                    headers: {
                        Authorization: "Token " + props.myHelper.GetToken(),
                    },
                }
            )
            .then(
                (response) => {
                    console.log(response.data)
                    FetchRequests()
                },
                (error) => console.log(error)
            )
    }

    return (
        <div className="d-flex flex-column align-items-center">
            <div className="d-flex flex-column align-items start">
                <h3>Connection Requests</h3>
                <ul
                    key="connections"
                    style={scrollstyle}
                    className="border border-primary"
                >
                    {conRequests !== undefined
                        ? conRequests.map((request) => (
                              <li
                                  className="d-flex justify-content-between align-items-center m-1"
                                  key={request.request_id}
                              >
                                  <Avatar
                                      user_email={request.user_from_email}
                                      myHelper={props.myHelper}
                                      height="40px"
                                      width="40px"
                                  />
                                  <div className="ms-5 ">
                                      <button className="btn btn-primary m-1 btn-sm">
                                          View profile
                                      </button>
                                      <button
                                          onClick={(e) =>
                                              OnConnectionAccept(
                                                  e,
                                                  request.user_from_email
                                              )
                                          }
                                          className="btn btn-success m-1 btn-sm"
                                      >
                                          Accept
                                      </button>
                                      <button className="btn btn-danger m-1 btn-sm">
                                          Ignore
                                      </button>
                                  </div>
                              </li>
                          ))
                        : null}
                </ul>
            </div>
            <div className="d-flex flex-column align-items start">
                <h3>Interest notifications</h3>
                <div
                    style={scrollstyle}
                    className="border border-primary d-flex flex-column"
                >
                    {/*interests.map((event) => (
                        <div
                            key={"notif" + notifCounter++}
                            className="d-flex justify-content-between align-items-center m-1"
                        >
                            <img src={profilepic} height="30px" width="30px" />
                            <div className=" text-left">
                                {event.name + " " + event.surname}
                            </div>
                            <div className=" text-left" style={actionStyle}>
                                {event.action}
                            </div>
                            <button>{event.subject}</button>
                        </div>
                    ))*/}
                </div>
            </div>
        </div>
    )
}
export default Notifications
