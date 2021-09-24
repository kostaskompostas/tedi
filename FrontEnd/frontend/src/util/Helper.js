import React, { Component, useState } from "react"
import axios from "axios"

class Helper extends Component {
    client = axios.create({
        baseURL: "http://127.0.0.1:8000",

        //baseURL: "http://192.168.1.35:8000",
    })
}

export default Helper
