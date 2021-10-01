import { React, useEffect, useState } from "react"
import axios from "axios"
import { Avatar } from "../util/util"
const Network = (props) => {
    const [users, SetUsers] = useState()
    const [searchString, SetSearchString] = useState("")
    const [searchResult, SetSearchResult] = useState()

    let client = props.myHelper.client
    console.log(props)

    useEffect(() => {
        client.get("/api/user/").then(
            (response) => {
                SetUsers(response.data.items)
                console.log(response.data.items)
            },
            (error) => console.log(error)
        )
    }, [])
    useEffect(() => {}, [])
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
                            <button className="ms-2  btn-sm btn btn-success">
                                connect
                            </button>
                        </div>
                    ))}
                </div>
            ) : null}
        </div>
    )
}
export default Network
