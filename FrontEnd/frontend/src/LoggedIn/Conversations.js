import { React, useEffect, useState } from "react"
import axios from "axios"
import { Avatar } from "../util/util.js"
const Conversations = (props) => {
    let client = props.myHelper.client
    let temp =
        props.userInfo.collaborators.length > 0
            ? props.userInfo.collaborators[0].email
            : undefined
    const [connections, SetConnections] = useState(props.userInfo.collaborators)
    const [selectedUser, SetSelectedUser] = useState(temp)
    const contactsStyle = {
        overflowY: "auto",
        border: "3px solid black",
        width: "200px",
        height: "400px",
        position: "relative",
    }

    const messageTabStyle = {
        border: "3px solid black",
        width: "800px",
        height: "400px",
    }
    const messagesStyle = {
        overflowY: "auto",
        position: "relative",
    }

    const [messages, SetMessages] = useState()

    console.log(props.userInfo.collaborators.length)
    const Refresh = () => {
        //check for connections to  see if someone new has started talking
        props.myHelper.client
            .get("/api/auth/", {
                headers: {
                    Authorization: "Token " + props.myHelper.GetToken(),
                },
            })
            .then((response) => {
                SetConnections(response.data.collaborators)
                if (response.data.collaborators.length > 0) {
                    SetSelectedUser(response.data.collaborators[0].email)
                    FetchMessages(response.data.collaborators[0].email) //check for messages on selected user
                }
            })
    }

    useEffect(() => {
        var handle = setInterval(Refresh, 5000)
        return () => {
            clearInterval(handle)
        }
    })
    useEffect(() => {
        Refresh()
    }, [])
    const FetchMessages = (other_user_email) => {
        console.log(other_user_email)
        if (selectedUser === undefined) return
        SetSelectedUser(other_user_email)
        //teleutaio id=next conversation from
        client
            .get(
                "/api/message/" +
                    "?user_email=" +
                    other_user_email +
                    "&conversation_from=" +
                    0,
                {
                    headers: {
                        Authorization: "Token " + props.myHelper.GetToken(),
                    },
                }
            )
            .then((response) => {
                if (response.data.items == undefined) return
                SetMessages(
                    response.data.items.sort((a, b) =>
                        a.order_id > b.order_id ? 1 : -1
                    )
                )
                console.log(response.data.items)
            })
    }
    const OnMessageSubmit = (e, other_user_email) => {
        e.preventDefault()
        console.log(other_user_email + " " + e.target.messageText.value)
        client
            .post(
                "/api/message/",
                {
                    user_email: other_user_email,
                    content: e.target.messageText.value,
                },
                {
                    headers: {
                        Authorization: "Token " + props.myHelper.GetToken(),
                    },
                }
            )
            .then(
                (response) => {
                    FetchMessages(other_user_email)
                    e.target.messageText.value = ""
                },
                (error) => console.log(error)
            )
    }

    return (
        <div className="d-flex flex-column justify-content-between align-items-center">
            <h3>Conversations</h3>
            <div className="d-flex justify-content-between">
                <div className="">
                    <h4>Your contacts</h4>
                    <div className="bg-info" style={contactsStyle}>
                        <div key="connections" className="">
                            {connections != undefined
                                ? connections.map((person) => (
                                      <div
                                          key={person.email}
                                          onClick={(e) =>
                                              FetchMessages(person.email)
                                          }
                                          className={
                                              "d-flex p-2" + person.email ===
                                              selectedUser
                                                  ? "border border-primary"
                                                  : ""
                                          }
                                      >
                                          <Avatar
                                              className={
                                                  person.email === selectedUser
                                                      ? "border border-primary"
                                                      : ""
                                              }
                                              user_email={person.email}
                                              myHelper={props.myHelper}
                                              width="50px"
                                              height="50px"
                                              disableOnClick={true}
                                          />
                                      </div>
                                  ))
                                : null}
                        </div>
                    </div>
                </div>
                <div className="">
                    <h4>Your conversation</h4>
                    <div
                        className="d-flex flex-column justify-content-between"
                        style={messageTabStyle}
                    >
                        <div style={messagesStyle}>
                            {messages != undefined
                                ? messages.map((message) => (
                                      <div
                                          key={message.message_id}
                                          className="d-flex align-items-center"
                                      >
                                          <Avatar
                                              user_email={
                                                  message.user_from_email
                                              }
                                              disableOnClick={true}
                                              width={"30px"}
                                              height={"30px"}
                                              hideName={true}
                                              myHelper={props.myHelper}
                                          />

                                          <h6>{message.content}</h6>
                                      </div>
                                  ))
                                : null}
                        </div>
                        <form
                            className="form"
                            onSubmit={(e) => OnMessageSubmit(e, selectedUser)}
                        >
                            <div className="row">
                                <div className="col-xs-12">
                                    <div className="input-group input-group-lg"></div>
                                </div>
                            </div>
                            <input
                                type="text"
                                class="form-control"
                                name={"messageText"}
                                defaultValue=""
                            />
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Conversations
