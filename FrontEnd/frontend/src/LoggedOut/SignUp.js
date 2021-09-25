import React, { Component } from "react"
import axios from "axios"
import { NavLink, Link } from "react-router-dom"
import { propTypes } from "react-bootstrap/esm/Image"
import Helper from "../util/Helper"

const SignUp = (props) => {
    /*React.useEffect(() => {
        try {
            axios.get("http://192.168.1.35:8000/api/user/").then((response) => {
                alert(response.data.user_number)
            })
        } catch (e) {
            console.log(e)
        }
    }, [])*/

    const submitForm = (e) => {
        console.log("papopepo")
        e.preventDefault()
        Helper.client
            .post("/api/user", {
                user_email: e.target.email.value,
                user_first_name: e.target.first_name.value,
                user_last_name: e.target.last_name.value,
                user_phone: e.target.phone.value,
                user_password: e.target.password.value,
                format: "json",
            })
            .then(
                (response) => {
                    console.log(response.data)
                    props.SignIn()
                },
                (error) => {
                    console.log(error)
                }
            )
    }
    /*

    confirm password 
    */
    const form = () => {
        return (
            <div className="d-flex flex-column align-items-center">
                <div className="d-flex flex-column align-items-center  bg-info p-4 border border-dark rounded">
                    <h1>Sign Up Now! </h1>
                    <form
                        className="form mt-5"
                        onSubmit={(e) => submitForm(e)}
                        noValidate
                    >
                        <div className="d-flex flex-column  ">
                            <div className="d-flex flex-column">
                                <label className="form-label">Email</label>
                                <input
                                    className="form-input d-flex"
                                    type="text"
                                    name="email"
                                    placeholder="example@email.com"
                                />
                            </div>
                            <div className="d-flex flex-column mt-3">
                                <label className="form-label">Password</label>

                                <input
                                    className="form-input"
                                    type="password"
                                    name="password"
                                    placeholder=""
                                />
                            </div>
                            <div className="d-flex flex-column">
                                <label className="form-label">
                                    Confirm your Password
                                </label>

                                <input
                                    className="form-input"
                                    type="password"
                                    name="passwordconf"
                                    placeholder="Re-Enter your password"
                                />
                            </div>
                            <div className="d-flex mt-4">
                                <div className="d-flex flex-column">
                                    <label className="form-label">
                                        First Name
                                    </label>

                                    <input
                                        className="form-input"
                                        type="text"
                                        name="first_name"
                                        placeholder="John"
                                    />
                                </div>
                                <div className="d-flex flex-column ms-3">
                                    <label className="form-label">
                                        Last Name
                                    </label>

                                    <input
                                        className="form-input"
                                        type="text"
                                        name="last_name"
                                        placeholder="Wick"
                                    />
                                </div>
                            </div>
                            {/*
                                <div className="mt-4 d-flex flex-column">
                                    <label className="form-label">
                                        Upload a profile Picture
                                    </label>

                                    <input
                                        className="form-input"
                                        type="file"
                                        name="picture"
                                    />
                                </div>
                            
                            */}

                            <div className="d-flex flex-column mt-4">
                                <label className="form-label">
                                    Phone Number
                                </label>

                                <input
                                    className="form-input"
                                    type="number"
                                    name="phone"
                                    placeholder="1234567890"
                                />
                            </div>
                        </div>
                        <button
                            className="form-input-btn btn btn-primary mt-2 "
                            type="submit"
                        >
                            Confirm
                        </button>
                    </form>
                </div>
                <div>
                    Aready have an account?
                    <Link
                        to="/signin"
                        className="btn btn-secondary btn-small btn-sm"
                    >
                        SignIn
                    </Link>
                </div>
            </div>
        )
    }

    return form()
}

export default SignUp
