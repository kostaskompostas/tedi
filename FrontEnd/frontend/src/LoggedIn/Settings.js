import { React, useEffect, useState } from "react"
import axios from "axios"

const Settings = (props) => {
    let client = props.myHelper.client
    let formok = false

    const [userInfo, setUserInfo] = useState("")
    useEffect(() => {
        var token = props.myHelper.GetToken()
        console.log(token)
        client
            .get("/api/auth/", {
                headers: { Authorization: "Token " + token },
            })
            .then(
                (response) => {
                    console.log(response.data)
                    setUserInfo(response.data)
                },
                (error) => {
                    console.log(error)
                }
            )
    }, [])

    let profile = {
        email: userInfo.email,
        name: userInfo.first_name,
        surname: userInfo.last_name,
    }
    const SubmitForm = (e) => {
        e.preventDefault()
        formok = CheckForErrors(e)
        if (!formok) return

        client
            .put(
                "/api/user/",
                {
                    user_email: e.target.email.value,
                    user_password: e.target.password.value,
                },
                {
                    headers: {
                        Authorization: "Token " + props.myHelper.GetToken(),
                    },
                }
            )
            .then(
                (response) => {
                    console.log(response.data)
                    if (response.data.success == "true") {
                    }
                },
                (error) => {
                    console.log(error)
                }
            )
    }
    const CheckForErrors = (e) => {
        let form = e.target
        let emailValue = form.email.value.trim()
        let passValue = form.password.value.trim()
        let newPassValue = form.newPassword.value.trim()
        let newPassConfValue = form.newPasswordConf.value.trim()

        if (passValue)
            console.log(emailValue + " " + passValue + " " + newPassValue)
        return formok
    }

    return (
        <div className="d-flex flex-column align-items-center">
            <h3>Your account settings</h3>
            <form onSubmit={(e) => SubmitForm(e)}>
                <div className="d-flex flex-column border border-dark p-3">
                    <div className="d-flex flex-column">
                        <label className="form-label">Email</label>
                        <input
                            className="form-input"
                            type="text"
                            name="email"
                            placeholder={profile.email}
                        />
                    </div>
                    <div className="d-flex flex-column mt-3">
                        <label className="form-label">Password</label>

                        <input
                            className="form-input"
                            type="password"
                            name="password"
                        />
                    </div>
                    <div className="d-flex flex-column">
                        <label className="form-label">New Password</label>

                        <input
                            className="form-input"
                            type="password"
                            name="newPassword"
                            placeholder="Enter your new password"
                        />
                    </div>
                    <div className="d-flex flex-column">
                        <label className="form-label">
                            Confirm your new Password
                        </label>

                        <input
                            className="form-input"
                            type="password"
                            name="newPasswordConf"
                            placeholder="Re-Enter your new password"
                        />
                    </div>
                    <button
                        className="form-input-btn btn btn-primary mt-2"
                        type="submit"
                    >
                        Confirm changes
                    </button>
                </div>
            </form>
        </div>
    )
}
export default Settings
