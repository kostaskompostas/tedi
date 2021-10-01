import { React, useEffect, useState } from "react"
import axios from "axios"
import profilePic from "../../icons/profile.png"
import Helper from "../../util/Helper"
import { Avatar } from "../../util/util.js"
import Profile from "./Profile"
import TimeLine from "./TimeLine.js"

function Home(props) {
    let client = props.myHelper.client

    return (
        <div className="d-flex m-4">
            <Profile
                FetchUserData={props.FetchUserData}
                myHelper={props.myHelper}
                userInfo={props.userInfo}
            />
            <TimeLine
                FetchUserData={props.FetchUserData}
                myHelper={props.myHelper}
                userInfo={props.userInfo}
            />
        </div>
    )
}
export default Home
