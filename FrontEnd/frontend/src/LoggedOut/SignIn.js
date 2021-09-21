import React, { Component } from "react"
import { useEffect } from "react"

import axios from "axios"
import { NavLink, Link } from "react-router-dom"
import { propTypes } from "react-bootstrap/esm/Image"

const SignIn = (props) => {
    /*React.useEffect( ()=>{
        try{
          axios.get("http://192.168.1.7:8000/api/user/").then((response)=>{
            alert(response.data.user_number);
          })
    
        }catch(e){
          console.log(e);
        }
      },[])*/

    const submitForm = (e) => {
        e.preventDefault()
        axios
            .post("/api/user/", {
                email: e.target.email.value,
                password: e.target.password.value,
            })
            .then(
                (response) => {
                    console.log(response.data.status)
                },
                (error) => {
                    console.log(error)
                }
            )
    }

    const form = () => {
        return (
            <div className="d-flex flex-column align-items-center ">
                <div className="d-flex flex-column align-items-center bg-info p-5 border border-dark rounded">
                    <h1>Sign in </h1>
                    <form
                        className="form"
                        onSubmit={(e) => submitForm(e)}
                        noValidate
                    >
                        <div className="d-flex flex-column align-items-start">
                            <div className="form-inputs d-flex flex-column mt-1">
                                <label className="form-label">Email</label>
                                <input
                                    className="form-input"
                                    type="text"
                                    name="email"
                                    placeholder="Enter your email"
                                />
                            </div>
                            <div className="form-inputs d-flex flex-column mt-1">
                                <label className="form-label">Password</label>
                                <input
                                    className="form-input"
                                    type="password"
                                    name="password"
                                    placeholder="Enter your password"
                                />
                            </div>
                        </div>
                    </form>
                    <button
                        onClick={props.signin}
                        className="form-input-btn btn btn-primary btn-sm mt-3"
                        type="submit"
                    >
                        Log in
                    </button>
                </div>
                <div className="mt-3">
                    Already have an account?
                    <Link to="/signup" className="btn btn-secondary btn-sm">
                        Sign in
                    </Link>
                </div>
            </div>
        )
    }
    return form()
}

export default SignIn
