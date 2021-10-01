import { React, useEffect, useState } from "react"
import axios from "axios"
import { Avatar } from "../util/util"
const Network = (props) => {
    const [users, SetUsers] = useState()
    const [searchString, SetSearchString] = useState("")
    const [searchResult, SetSearchResult] = useState()

    const collaborators = props.userInfo.collaborators

    //console.log(collaborators)
    /*

        filter search results
        props.userinfo
        //if user_email is not in collaborators and is not in pending requests
            //show "connect"



    */
    let client = props.myHelper.client
    console.log(props)

    useEffect(() => {
        client
            .get("/api/user/", {
                headers: {
                    Authorization: "Token " + props.myHelper.GetToken(),
                },
            })
            .then(
                (response) => {
                    var temp = response.data.items
                    //add "isconnected" value so it can be checked later
                    //check if user is in collabs
                    /*temp = temp.map((user) => {
                    var flag = false
                    for (let i = 0; i < collaborators.length; i++) {
                        collaborators[i].email == user.email
                        flag = true
                        break
                    }
                    return { ...user, isConnected: flag }
                })*/
                    SetUsers(temp)
                },
                (error) => console.log(error)
            )
    }, [])

    useEffect(() => {
        console.log(users)
    }, [users])
    const OnSearchChange = (e) => {
        var value = e.target.value.toLowerCase()
        var searchLength = value.length

        e.preventDefault()
        SetSearchString(value)
        SetSearchResult(
            users.filter(
                (user) =>
                    user.first_name.substring(0, searchLength).toLowerCase() ===
                        value ||
                    user.last_name.substring(0, searchLength).toLowerCase() ===
                        value ||
                    (user.first_name + user.last_name)
                        .substring(0, searchLength)
                        .toLowerCase() === value
            )
        )
    }

    const OnConnect = (e, email) => {
        e.preventDefault()
        client
            .post(
                "api/collab/",
                { create: true, user_email: email },
                {
                    headers: {
                        Authorization: "Token " + props.myHelper.GetToken(),
                    },
                }
            )
            .then(
                (response) => console.log(response.data),
                (error) => console.log(error)
            )
    }

    return (
        <div className="d-flex flex-column justify-content-center">
            <input
                name="searchbar"
                onChange={(e) => OnSearchChange(e)}
                placeholder="search for new connections"
            ></input>
            {searchString != "" ? (
                <div>
                    {searchResult.map((user) => (
                        <div className="d-flex ">
                            <Avatar
                                myHelper={props.myHelper}
                                key={user.email}
                                user_email={user.email}
                                height={"40px"}
                                width={"40px"}
                            />
                            {!user.is_connected ? (
                                <button
                                    onClick={(e) => OnConnect(e, user.email)}
                                    className="ms-2  btn-sm btn btn-success"
                                >
                                    connect
                                </button>
                            ) : null}
                        </div>
                    ))}
                </div>
            ) : null}
        </div>
    )
}
export default Network
