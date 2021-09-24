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
        this.setState({ logged: true })
        console.log(this.logged)
        this.state.helper.SetToken(newToken)
        ;<Redirect push to="/home" />
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
                    this.setState({ token: "" })
                    this.setState({ logged: false })
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
