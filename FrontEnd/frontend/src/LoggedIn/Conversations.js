import { React, useEffect, useState } from "react"
import axios from "axios"
import { Avatar } from "../util/util.js"
const Conversations = (props) => {
    let client = props.myHelper.client
    const [connections, SetConnections] = useState(props.userInfo.collaborators)

    const contactsStyle = {
        overflowY: "auto",
        border: "3px solid black",
        width: "300px",
        height: "400px",
        position: "relative",
    }

    const [messages, SetMessages] = useState()
    let messagesCheckpoint = 0
    const FetchMessages = (e, other_user_email) => {
        e.preventDefault()

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
            .then((response) => console.log(response.data))
    }

    return (
        <div className="d-flex flex-column justify-content-between align-items-center">
            <h3>Conversations</h3>
            <div className="d-flex justify-content-between">
                <div style={contactsStyle} className="bg-info m-5">
                    <h4>Your contacts</h4>
                    <ul key="connections" className="">
                        {connections != undefined
                            ? connections.map((person) => (
                                  <li
                                      key={person.email}
                                      onClick={(e) =>
                                          FetchMessages(e, person.email)
                                      }
                                      className="d-flex p-2"
                                  >
                                      <Avatar
                                          user_email={person.email}
                                          myHelper={props.myHelper}
                                          width="50px"
                                          height="50px"
                                          disableOnClick={true}
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
                <div className="m-5">
                    <h4>Your conversation</h4>
                    {messages != undefined ? "messages" : null}
                </div>
            </div>
        </div>
    )
}
export default Conversations
