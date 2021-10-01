import { React, useEffect, useState } from "react"
import axios from "axios"
import profilepic from "../icons/profile.png"
import { Avatar } from "../util/util"
import Article from "./Home/Article"

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
                    setConRequests(response.data.items.reverse())
                    //console.log(response.data)
                },
                (error) => console
            )
    }

    const [notif, SetNotif] = useState()
    useEffect(() => {
        FetchNotif()
    }, [])
    const FetchNotif = () => {
        client
            .get("/api/notif/", {
                headers: {
                    Authorization: "Token " + props.myHelper.GetToken(),
                },
            })
            .then((response) => {
                console.log(response.data.items)
                SetNotif(response.data.items.reverse())
            })
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
    const [showPreview, SetShowPreview] = useState(false)
    function TogglePreview() {
        SetShowPreview((prev) => !prev)
    }
    const modalStyle = {
        display: "none",
        position: "fixed",
        zIndex: 1,
        "background-color": "rgba(0, 0, 0, 0.25)",
    }
    const modalContent = {
        backgroundColor: "white",
        position: "absolute",
    }
    const [previewArticle, SetPreviewArticle] = useState()
    const ViewNotifArticle = (e, article_id) => {
        e.preventDefault()
        client
            .get(
                "/api/articles/?user_email=" +
                    props.userInfo.email +
                    "&user=true",

                {
                    headers: {
                        Authorization: "Token " + props.myHelper.GetToken(),
                    },
                }
            )
            .then(
                (response) => {
                    console.log(response.data)
                    var flag = -1
                    for (var i = 0; i < response.data.items.length; i++) {
                        if (response.data.items[i].article_id == article_id)
                            flag = i
                    }
                    console.log(flag)
                    if (flag != -1) {
                        SetPreviewArticle(response.data.items[flag])
                        TogglePreview()
                    }
                },
                (error) => console.log(error)
            )
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
                    props.FetchUserData() //refresh user data so new collaborations can be shown
                },
                (error) => console.log(error)
            )
    }
    const OnConnectionDecline = (e, email) => {
        e.preventDefault()
        client
            .post(
                "/api/collab/",
                { decline: true, user_email: email },
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
                                      <button
                                          onClick={(e) =>
                                              OnConnectionDecline(
                                                  e,
                                                  request.user_from_email
                                              )
                                          }
                                          className="btn btn-danger m-1 btn-sm"
                                      >
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
                {showPreview ? (
                    <Article
                        style={modalStyle}
                        userInfo={props.userInfo}
                        myHelper={props.myHelper}
                        data={previewArticle}
                    />
                ) : null}
                <div
                    style={scrollstyle}
                    className="border border-primary d-flex flex-column "
                >
                    {notif != undefined
                        ? notif.map((event) => (
                              <div
                                  key={event.notification_ids}
                                  className="d-flex justify-content-between align-items-center m-1"
                              >
                                  <Avatar
                                      user_email={event.user_from_email}
                                      myHelper={props.myHelper}
                                      width="50px"
                                      height="50px"
                                      hideName={true}
                                  />
                                  <div className=" text-left">
                                      {event.message}
                                  </div>
                                  <div
                                      className=" text-left"
                                      style={actionStyle}
                                  >
                                      <span>{"on " + event.date}</span>
                                  </div>
                                  <button
                                      onClick={(e) =>
                                          ViewNotifArticle(e, event.article_id)
                                      }
                                  >
                                      {"view article"}
                                  </button>
                              </div>
                          ))
                        : null}
                </div>
            </div>
        </div>
    )
}
export default Notifications
