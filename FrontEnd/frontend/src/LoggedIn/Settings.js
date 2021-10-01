import { React, useEffect, useState } from "react"
import axios from "axios"

const Settings = (props) => {
    let client = props.myHelper.client
    let formok = true
    let emailHasChanged = false
    let passwordHasChanged = false

    const [userInfo, setUserInfo] = useState(props.userInfo)

    let profile = {
        email: userInfo.email,
        name: userInfo.first_name,
        surname: userInfo.last_name,
    }

    const SubmitForm = (e) => {
        e.preventDefault()
        formok = CheckForErrors(e)
        console.log(formok)
        if (!formok) return

        let formData = { user_old_password: e.target.password.value }

        //add data to form if it has changed
        if (emailHasChanged)
            formData = { ...formData, user_email: e.target.email.value }
        if (passwordHasChanged)
            formData = {
                ...formData,
                user_password: e.target.newPassword.value,
            }
        console.log(formData)
        client
            .put("/api/user/", formData, {
                headers: {
                    Authorization: "Token " + props.myHelper.GetToken(),
                },
            })
            .then(
                (response) => {
                    console.log(response.data)
                    if (response.data.changed == "true") {
                        console.log("changed!")
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

        if (emailValue != userInfo.email) emailHasChanged = true

        if (newPassValue != "") {
            passwordHasChanged = true
            formok = newPassValue != newPassConfValue ? false : true
        } else {
            passwordHasChanged = false
        }

        if (!passwordHasChanged && !emailHasChanged) {
            console.log("heheh")
            return false
        }

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
                            defaultValue={profile.email}
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
