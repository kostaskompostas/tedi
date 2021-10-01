import React, { Component, useState, usEffect } from "react"
import { Redirect } from "react-router-dom"

import "./App.css"
import axios from "axios"

import LoggedOutRouter from "./LoggedOut/LoggedOutRouter"
import LoggedInRouter from "./LoggedIn/LoggedInRouter"
import Helper from "./util/Helper"
import { render } from "@testing-library/react"
const App = (props) => {
    const [helper, SetHelper] = useState(new Helper())
    const [logged, SetLogged] = useState(false)
    const [userInfo, SetUserInfo] = useState()

    const FetchUserData = () => {
        helper.client
            .get("/api/auth/", {
                headers: { Authorization: "Token " + helper.GetToken() },
            })
            .then((response) => {
                console.log("APP LOGIN RESPONSE")
                console.log(response.data.email)
                SetUserInfo(response.data)
            })
    }

    const SignIn = (newToken) => {
        SetLogged(true)
        helper.SetToken(newToken)

        //auth and set user info
        helper.client
            .get("/api/auth/", {
                headers: { Authorization: "Token " + newToken },
            })
            .then((response) => {
                console.log("APP LOGIN RESPONSE")
                console.log(response.data.email)
                SetUserInfo(response.data)
                ;<Redirect to="/home" />
            })
    }

    const SignOut = () => {
        helper.client
            .post(
                "/api/auth/",
                {
                    logout: true,
                    format: "json",
                },
                {
                    headers: {
                        Authorization: "Token " + helper.GetToken(),
                    },
                }
            )
            .then(
                (response) => {
                    console.log(response.data.message)
                    SetLogged(false)
                },
                (error) => {
                    console.log(error)
                }
            )
        ;<Redirect push to="/" />
    }

    function GetContent() {
        let content = logged ? (
            <LoggedInRouter
                FetchUserData={FetchUserData}
                userInfo={userInfo}
                myHelper={helper}
                SignOut={SignOut}
            />
        ) : (
            <LoggedOutRouter myHelper={helper} SignIn={SignIn} />
        )

        return content
    }

    return GetContent()
}

export default App
