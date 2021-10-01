import { React, useEffect, useState } from "react"
import {
    BrowserRouter as Router,
    Redirect,
    Link,
    useHistory,
} from "react-router-dom"
import axios from "axios"

import autocomplete from "../../util/AutoComplete.js"
import { Avatar, FormInput } from "../../util/util.js"

const Account = (props) => {
    //if the account you are about to view is the authorized user, allow changes
    let isAuthorized = props.location.state.viewUser == props.userInfo.email
    //console.log(props)
    isAuthorized
        ? console.log("user is viewing his own account")
        : console.log("user is viewing someone elses account")
    let client = props.myHelper.client
    const listStyle = {
        overflowY: "auto",
        width: "300px",
        height: "200px",
        position: "relative",
    }

    const getPrevWork = () => {
        let prev = []
        return prev
    }
    const getEdu = () => {
        let edu = []
        return edu
    }
    const getSkills = () => {
        let skills = []
        return skills
    }

    //gets user info
    const [userInfo, setUserInfo] = useState()
    useEffect(() => {
        var token = props.myHelper.GetToken()
        client
            .get("/api/user/?user_email=" + props.location.state.viewUser, {
                headers: {
                    Authorization: "Token " + props.myHelper.GetToken(),
                },
            })
            .then(
                (response) => {
                    console.log(response.data)
                    setUserInfo(response.data)
                },
                (error) => console.log(error)
            )
        /*
        client
            .get("/api/auth/", {
                headers: { Authorization: "Token " + token },
            })
            .then(
                (response) => {
                    setUserInfo(response.data)
                },
                (error) => {
                    console.log(error)
                }
            )

        client.get("/api/skills/" + "?all").then((response) => {
            console.log(response.data.items)
            setAvailableSkills(response.data.items)

        })*/
    }, [])

    const [userPicture, SetUserPicture] = useState(
        props.userInfo.profile_picture
    )
    const OnPictureChange = (e) => {
        e.preventDefault()

        const formData = new FormData()
        formData.append(
            "user_profile_picture",
            e.target.files[0],
            e.target.files[0].name
        )

        client
            .put("api/user/", formData, {
                headers: {
                    Authorization: "Token " + props.myHelper.GetToken(),
                },
            })
            .then(
                (response) => {
                    var token = props.myHelper.GetToken()

                    //get user data again and change state
                    client
                        .get("/api/auth/", {
                            headers: { Authorization: "Token " + token },
                        })
                        .then(
                            (response) => {
                                setUserInfo(response.data)
                                props.FetchUserData()
                            },
                            (error) => {
                                console.log(error)
                            }
                        )
                },
                (error) => {
                    console.log(error)
                }
            )
    }

    const [namesChanged, setNamesChanged] = useState({
        first_name: false,
        last_name: false,
    })
    const OnNamesChange = (e) => {
        //detects a change in the names and sends a put request after a delay
        e.preventDefault()
        const timeDelay = 1000

        if (e.target.name == "first_name" && namesChanged.first_name == false) {
            setNamesChanged({ ...namesChanged, first_name: true })
            setTimeout(function () {
                let formData
                formData = { user_first_name: e.target.value }
                client
                    .put("/api/user/", formData, {
                        headers: {
                            Authorization: "Token " + props.myHelper.GetToken(),
                        },
                    })
                    .then(
                        (response) => {
                            console.log(response.data)
                        },
                        (error) => console.log(error)
                    )
                setNamesChanged({ ...namesChanged, first_name: false })
                props.FetchUserData()
            }, timeDelay)
        }
        if (e.target.name == "last_name" && namesChanged.last_name == false) {
            setNamesChanged({ ...namesChanged, last_name: true })
            setTimeout(function () {
                let formData
                formData = { user_last_name: e.target.value }
                client
                    .put("/api/user/", formData, {
                        headers: {
                            Authorization: "Token " + props.myHelper.GetToken(),
                        },
                    })
                    .then(
                        (response) => {
                            console.log(response.data)
                        },
                        (error) => console.log(error)
                    )
                setNamesChanged({ ...namesChanged, last_name: false })
                props.FetchUserData()
            }, timeDelay)
        }
        console.log("changed names")
    }

    const [availableSkills, setAvailableSkills] = useState()
    useEffect(() => {
        client
            .get("/api/skills/?all")
            .then((response) => console.log(response.data))
        client
            .get("/api/edu/?all")
            .then((response) => console.log(response.data))
    }, [])
    const OnSkillsSubmit = (e) => {
        e.preventDefault()
        //api/skills
        //api/edu
        client.get("/api/skills/" + "?all").then((response) => {
            console.log(response.data)
        })
        console.log("skill submit")
    }
    const OnFocus = (e) => {
        e.preventDefault()
        switch (e.target.name) {
            case "work":
                break
            case "edu":
                break
            case "skills":
                let skills

                break
        }
    }
    const displayInfo = (type, array, title) => {
        let counter = 0
        return (
            <div className="d-flex flex-column align-items-start ms-3 p-1">
                <h4>{title}</h4>
                <div className="border border-dark">
                    {isAuthorized ? (
                        <form
                            autoComplete="off"
                            className="d-flex align-items-center"
                            onSubmit={(e) => OnSkillsSubmit(e)}
                        >
                            {
                                <input
                                    className="m-3 p-3"
                                    type="text"
                                    name={type}
                                    placeholder="add new"
                                    onFocus={(e) => OnFocus(e)}
                                ></input>
                            }
                            <button
                                type="submit"
                                className="btn btn-primary p-1"
                            >
                                +
                            </button>
                        </form>
                    ) : null}
                    <ul style={listStyle} className="">
                        {array.map((entry) => (
                            <li key={type + counter++}>{entry}</li>
                        ))}
                    </ul>
                </div>
            </div>
        )
    }
    return userInfo != undefined ? (
        <div className="d-flex flex-column align-items-center">
            <div className="d-flex flex-column align-items-start">
                <h3>
                    {isAuthorized
                        ? "Your Personal Info"
                        : userInfo.first_name +
                          " " +
                          userInfo.last_name +
                          "'s profile"}
                </h3>

                <div className="border border-primary">
                    {isAuthorized ? (
                        <form>
                            <div className="d-flex p-2 align-items-end">
                                <div className="d-flex flex-column">
                                    <img
                                        src={
                                            props.myHelper.GetBaseUrl() +
                                            userInfo.profile_picture
                                        }
                                        width="200px"
                                        height="200px"
                                    />

                                    <input
                                        onChange={(e) => OnPictureChange(e)}
                                        className="mt-2 float-left"
                                        type="file"
                                        name="profilePicture"
                                        accept="image/*"
                                    ></input>
                                </div>
                                {
                                    <div
                                        className="ps-3 d-flex"
                                        onChange={(e) => OnNamesChange(e)}
                                    >
                                        {FormInput(
                                            "Name",
                                            "text",
                                            "first_name",
                                            userInfo.first_name,
                                            ""
                                        )}
                                        {FormInput(
                                            "Surname",
                                            "text",
                                            "last_name",
                                            userInfo.last_name,
                                            "ms-2"
                                        )}
                                    </div>
                                }
                            </div>
                        </form>
                    ) : (
                        <div>
                            <div className="d-flex p-2 align-items-end">
                                <div className="d-flex flex-column">
                                    <img
                                        src={
                                            props.myHelper.GetBaseUrl() +
                                            userInfo.profile_picture
                                        }
                                        width="200px"
                                        height="200px"
                                    />
                                </div>
                                <h3 className="ms-5">
                                    {userInfo.first_name +
                                        " " +
                                        userInfo.last_name}
                                </h3>
                                <h3>{userInfo.is_connected}</h3>
                            </div>
                        </div>
                    )}
                    <div className="d-flex mt-5">
                        {displayInfo(
                            "work",
                            getPrevWork(),
                            "Previous Work Experience"
                        )}
                        {displayInfo("edu", getEdu(), "Education")}
                        {displayInfo("skills", getSkills(), "Skills")}
                    </div>
                </div>
            </div>
        </div>
    ) : null
}
export default Account
