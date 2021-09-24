import React, { Component, useState, useeffect } from "react"
import { Redirect } from "react-router-dom"

import "./App.css"
import axios from "axios"

import LoggedOutRouter from "./LoggedOut/LoggedOutRouter"
import LoggedInRouter from "./LoggedIn/LoggedInRouter"
import Helper from "./util/Helper"
function App() {
    const [logged, setLogged] = useState(false)
    const [token, setToken] = useState("")

    let myHelper = new Helper()
    const SignIn = (newToken) => {
        setLogged(true)
        setToken(newToken)
        ;<Redirect push to="/home" />
    }

    const SignOut = () => {
        console.log(token)
        myHelper.client
            .post(
                "/api/auth/",
                {
                    logout: true,
                    format: "json",
                },
                { headers: { Authorization: "Token " + token } }
            )
            .then(
                (response) => {
                    console.log(response.data.message)
                    setToken("")
                    setLogged(false)
                },
                (error) => {
                    console.log(error)
                }
            )
        ;<Redirect push to="/" />
    }

    const GetContent = () => {
        let content = logged ? (
            <LoggedInRouter SignOut={SignOut} />
        ) : (
            <LoggedOutRouter SignIn={SignIn} />
        )

        return content
    }

    return GetContent()
}

export default App
