import { React, useEffect, useState } from "react"
import axios from "axios"
import FormInput from "../util/util.js"
import samuel from "../icons/samuel.jpg"
const Account = (props) => {
    let client = props.myHelper.client
    let profile = { name: "Samuel", surname: "Hayden" }
    const listStyle = {
        overflowY: "auto",
        width: "300px",
        height: "200px",
        position: "relative",
    }
    const displayList = (type, array, title) => {
        let counter = 0
        return (
            <div className="d-flex flex-column align-items-start ms-3">
                <h4>{title}</h4>
                <div className="border border-dark">
                    <div className="d-flex align-items-center">
                        <input
                            className="m-3 p-3"
                            type="text"
                            defaultValue="add new"
                        ></input>
                        <span className="btn btn-primary">+</span>
                    </div>
                    <ul style={listStyle} className="">
                        {array.map((entry) => (
                            <li key={type + counter++}>{entry}</li>
                        ))}
                    </ul>
                </div>
            </div>
        )
    }
    const getPrevWork = () => {
        let prev = [
            "spambot at twich",
            "music bot at discord",
            "champion bot in league",
            "apex legends dummy target in practice range",
            "dummy target in valorant target practice",
            "punchbag in super smash bros",
            "tutorial enemy in metal gear rising revengeance",
            "mechon in xenoblade chronicles 1,X,2",
        ]
        return prev
    }
    const getEdu = () => {
        let edu = [
            "pepega primary school",
            "pogchamp junior high",
            "omegalul high school",
            "kekw college",
        ]
        return edu
    }
    const getSkills = () => {
        let skills = ["video editing", "music producing", "meme making"]
        return skills
    }

    const [userInfo, setUserInfo] = useState({
        first_name: "",
        last_name: "",
        profile_picture: "",
    })
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

    const [userPicture, SetUserPicture] = useState()
    const onPictureChange = (e) => {
        e.preventDefault()
        console.log(e.target.files[0])
        console.log(e.target.value)

        const formData = new FormData()
        formData.append(
            "user_profile_picture",
            e.target.files[0],
            e.target.files[0].name
        )

        console.log(formData)
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
                                console.log(response.data)
                                setUserInfo(response.data)
                            },
                            (error) => {
                                console.log(error)
                            }
                        )
                    console.log(userInfo)
                },
                (error) => {
                    console.log(error)
                }
            )
    }
    return (
        <div className="d-flex flex-column align-items-center">
            <div className="d-flex flex-column align-items-start">
                <h3>Your Personal Info</h3>
                <div className="border border-primary">
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
                                    onChange={(e) => onPictureChange(e)}
                                    className="mt-2 float-left"
                                    type="file"
                                    name="profilePicture"
                                    accept="image/*"
                                ></input>
                            </div>
                            <div className="ps-3 d-flex">
                                {FormInput(
                                    "Name",
                                    "text",
                                    "name",
                                    userInfo.first_name
                                )}
                                {FormInput(
                                    "Surname",
                                    "text",
                                    "surname",
                                    userInfo.last_name,
                                    "ms-2"
                                )}
                            </div>
                        </div>
                    </form>
                    <div className="d-flex mt-5">
                        {displayList(
                            "work",
                            getPrevWork(),
                            "Previous Work Experience"
                        )}
                        {displayList("edu", getEdu(), "Education")}
                        {displayList("skills", getSkills(), "Skills")}
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Account