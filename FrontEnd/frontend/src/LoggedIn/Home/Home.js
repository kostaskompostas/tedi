import { React, useEffect, useState } from "react"
import axios from "axios"
import profilePic from "../../icons/profile.png"
import Helper from "../../util/Helper"
import { Avatar } from "../../util/util.js"
import Profile from "./Profile"
import TimeLine from "./TimeLine.js"

function Home(props) {
    let client = props.myHelper.client

    const [userInfo, setUserInfo] = useState("")
    useEffect(() => {
        var token = props.myHelper.GetToken()
        console.log(token)
        client
            .get("/api/auth/", {
                headers: { Authorization: "Token " + token },
            })
            .then(
                (response) => {
                    console.log(response.data)
                    setUserInfo(response.data)
                },
                (error) => {
                    console.log(error)
                }
            )
    }, [])

    return (
        <div className="d-flex m-4">
            <Profile myHelper={props.myHelper} userInfo={userInfo} />
            <TimeLine myHelper={props.myHelper} userInfo={userInfo} />
        </div>
    )
}
export default Home
