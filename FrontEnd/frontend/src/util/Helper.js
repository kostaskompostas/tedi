import React, { Component, useState } from "react"
import axios from "axios"

class Helper {
    base = "http://localhost:8000" //"http://192.168.1.1:8000"
    token = ""
    client = axios.create({
        //baseURL: "http://127.0.0.1:8000",

        baseURL: this.base,
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
    GetBaseUrl() {
        return this.base
    }
}

export default Helper
