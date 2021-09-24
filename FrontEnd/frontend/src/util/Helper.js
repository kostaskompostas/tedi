import React, { Component, useState } from "react"
import axios from "axios"

class Helper {
    token = ""
    client = axios.create({
        baseURL: "http://127.0.0.1:8000",

        //baseURL: "http://192.168.1.35:8000",
    })
    SetToken(newToken) {
        localStorage.setItem("token", newToken)
        console.log("setting token")
        this.token = newToken
        console.log(this.token)
    }
    GetToken() {
        return this.token
    }
}

export default Helper
