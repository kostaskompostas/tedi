import React, { Component } from "react"
import { BrowserRouter as Router, Link } from "react-router-dom"
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
    const OnAvatarClick = (e) => {
        console.log("clicked avatar")
    }
    return (
        <div onClick={(e) => OnAvatarClick(e)} className="d-flex p-2">
            <img
                className="Avatar"
                src={props.avatarUrl}
                alt={props.userName}
                height={props.height}
                width={props.width}
            />
            <h5 className="ms-2">{props.userName}</h5>
        </div>
    )
}

export { FormInput, Avatar }
