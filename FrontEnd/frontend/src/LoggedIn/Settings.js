import { React, useEffect } from "react"
import axios from "axios"

const Settings = (props) => {
    let profile = { email: "lol@jk.com", name: "John", surname: "Wick" }

    return (
        <div className="d-flex flex-column align-items-center">
            <h3>Your account settings</h3>
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
                        placeholder=""
                    />
                </div>
                <div className="d-flex flex-column">
                    <label className="form-label">New Password</label>

                    <input
                        className="form-input"
                        type="password"
                        name="passwordconf"
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
                        name="passwordconf"
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
        </div>
    )
}
export default Settings
