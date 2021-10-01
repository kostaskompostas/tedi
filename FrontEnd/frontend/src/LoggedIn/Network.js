import { React, useEffect, useState } from "react"
import axios from "axios"
import { Avatar } from "../util/util"
const Network = (props) => {
    const [users, SetUsers] = useState()
    const [searchString, SetSearchString] = useState("")
    const [searchResult, SetSearchResult] = useState()
    useEffect(() => {
        props.FetchUserData()
    }, [])
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
                    console.log(response.data.items)
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
    const OnConnectionDelete = (e, email) => {
        console.log(email)
        e.preventDefault()
        client
            .post(
                "/api/collab/",
                { uncollab: "true", user_email: email },
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
    const Connection = (props) => {
        return (
            <div className="d-flex align-items-center ">
                <Avatar
                    myHelper={props.myHelper}
                    user_email={props.user_email}
                    height={"40px"}
                    width={"40px"}
                />
                {props.is_connected == false ? (
                    <button
                        onClick={(e) => OnConnect(e, props.user_email)}
                        className="ms-2  btn-sm btn btn-success"
                    >
                        connect
                    </button>
                ) : (
                    <button
                        onClick={(e) => OnConnectionDelete(e, props.user_email)}
                        className="ms-2   btn btn-danger btn-sm ms-5"
                    >
                        delete connection
                    </button>
                )}
            </div>
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
                <div className="border border-primary">
                    {searchResult.map((user) => (
                        <Connection
                            key={props.user_email}
                            myHelper={props.myHelper}
                            user_email={user.email}
                            is_connected={user.is_connected}
                        />
                    ))}
                </div>
            ) : null}

            <div className="d-flex flex-column">
                <h2>Your network</h2>
                <div>
                    {props.userInfo.collaborators.map((user) => (
                        <Connection
                            key={user.email + 1}
                            myHelper={props.myHelper}
                            user_email={user.email}
                            is_connected={true}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}
export default Network
