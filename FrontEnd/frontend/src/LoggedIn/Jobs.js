import { React, useEffect } from "react"
import axios from "axios"

const Jobs = (props) => {
    return (
        <div className="d-flex flex-column jutify-content-between align-items-center">
            <form className="d-flex align-items-center">
                <div className="d-flex flex-column ">
                    <textarea
                        className="p-4"
                        type="text"
                        name="articleText"
                        placeholder="post a new offer"
                        defaultValue=""
                    ></textarea>
                    <input
                        name="articleFiles"
                        className="mt-1"
                        type="file"
                    ></input>
                </div>
                <button type="submit " className="ms-2 p-2 btn btn-primary">
                    Post
                </button>
            </form>
        </div>
    )
}
export default Jobs
