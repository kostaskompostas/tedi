import React, { Component, useState, useeffect } from "react"
import { Redirect } from "react-router-dom"

import "./App.css"
import axios from "axios"

import LoggedOutRouter from "./LoggedOut/LoggedOutRouter"
import LoggedInRouter from "./LoggedIn/LoggedInRouter"
import Helper from "./util/Helper"
import { render } from "@testing-library/react"
class App extends Component {
    state = { logged: false, token: true, helper: new Helper() }

    SignIn = (newToken) => {
        this.setState({ ...this.state, logged: true })

        const foo = (prevstate, newToken) => prevstate.helper.SetToken(newToken)
        foo(this.state, newToken)

        //auth and set user info
        this.state.helper.client
            .get("/api/auth/", {
                headers: { Authorization: "Token " + newToken },
            })
            .then((response) => {
                console.log("APP LOGIN RESPONSE")
                console.log(response.data.email)
                this.setState({ userInfo: response.data })
                console.log(this.state)
                ;<Redirect to="/home" />
            })
    }

    SignOut = () => {
        this.state.helper.client
            .post(
                "/api/auth/",
                {
                    logout: true,
                    format: "json",
                },
                {
                    headers: {
                        Authorization: "Token " + this.state.helper.GetToken(),
                    },
                }
            )
            .then(
                (response) => {
                    console.log(response.data.message)
                    this.setState({ ...this.state, token: "", logged: false })
                },
                (error) => {
                    console.log(error)
                }
            )
        ;<Redirect push to="/" />
    }

    GetContent() {
        let content = this.state.logged ? (
            <LoggedInRouter
                userInfo={this.state.userInfo}
                myHelper={this.state.helper}
                SignOut={this.SignOut}
            />
        ) : (
            <LoggedOutRouter
                myHelper={this.state.helper}
                SignIn={this.SignIn}
            />
        )

        return content
    }

    render() {
        return this.GetContent()
    }
}

export default App
