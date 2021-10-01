import React, { Component, useEffect, useState } from "react"
import {
    BrowserRouter as Router,
    Redirect,
    Link,
    useHistory,
} from "react-router-dom"
import defaultpic from "../icons/profile.png"
const FormInput = (label, type, name, placeholder, extraclasses = "") => {
    let classes = "form-inputs d-flex flex-column mt-1 " + extraclasses
    return (
        <div className={classes}>
            <label className="form-label">{label}</label>
            <input
                className="form-input"
                type={type}
                name={name}
                defaultValue={placeholder}
                placeholder={placeholder}
            />
        </div>
    )
}

function Avatar(props) {
    const [userInfo, SetUserInfo] = useState()
    const history = useHistory()
    const client = props.myHelper.client
    const OnAvatarClick = (e) => {
        console.log("clicked avatar")
        history.push("/viewaccount/" + userInfo.email)
    }
    //fetch user profile picture
    //props.user_email
    //get picture form user email
    //get first name and last name from user email
    //display that
    useEffect(() => {
        client.get("/api/user/" + "?user_email=" + props.user_email).then(
            (response) => {
                SetUserInfo(response.data)
                console.log(response.data)
            },
            (error) => console.log(error)
        )
    }, [])

    function GetPicture() {
        if (props.avatarUrl === undefined) {
            if (userInfo.profile_picture == "") return defaultpic
            else return props.myHelper.GetBaseUrl() + userInfo.profile_picture
        } else return props.myHelper.GetBaseUrl() + props.avatarUrl
    }
    return userInfo !== undefined ? (
        <Link
            className="d-flex p-2 align-items-center"
            to={{
                pathname: "/account",
                state: { viewUser: userInfo.email },
            }}
        >
            <img
                className={"rounded-circle"}
                src={GetPicture()}
                height={props.height}
                width={props.width}
            />
            {props.hideName == undefined ? (
                <h5 className="ms-2">
                    {userInfo.first_name + " " + userInfo.last_name}
                </h5>
            ) : null}
        </Link>
    ) : null
}
/*
        <div onClick={(e) => OnAvatarClick(e)} className="d-flex p-2">
        </div>
        */
export { FormInput, Avatar }
