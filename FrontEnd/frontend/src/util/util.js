import React, { Component } from "react"
const FormInput = (label, type, name, placeholder, extraclasses = "") => {
    let classes = "form-inputs d-flex flex-column mt-1 " + extraclasses
    return (
        <div className={classes}>
            <label className="form-label">{label}</label>
            <input
                className="form-input"
                type={type}
                name={name}
                placeholder={placeholder}
            />
        </div>
    )
}

export default FormInput
