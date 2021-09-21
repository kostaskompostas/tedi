import { React, useEffect } from "react"
import axios from "axios"
import samuel from "../icons/samuel.jpg"
import profilePic from "../icons/profile.png"
const Home = (props) => {
    const getConnections = () => {
        let connections = [
            { name: "Johnathan", surname: "Joestar" },
            { name: "Jotaro", surname: "kujo" },
            { name: "Dio", surname: "Brando" },
            { name: "Arthur", surname: "Morgan" },
            { name: "Johnathan", surname: "Joestar" },
            { name: "Jotaro", surname: "kujo" },
            { name: "Dio", surname: "Brando" },
            { name: "Arthur", surname: "Morgan" },
            { name: "Johnathan", surname: "Joestar" },
            { name: "Jotaro", surname: "kujo" },
            { name: "Dio", surname: "Brando" },
            { name: "Arthur", surname: "Morgan" },
            { name: "Johnathan", surname: "Joestar" },
            { name: "Jotaro", surname: "kujo" },
            { name: "Dio", surname: "Brando" },
            { name: "Arthur", surname: "Morgan" },
        ]
        return connections
    }
    const profile = () => {
        const connStyle = {
            overflowY: "auto",
            border: "3px solid black",
            width: "300px",
            height: "400px",
            position: "relative",
        }
        return (
            <div className="d-flex flex-column align-items-start">
                <div className="d-flex flex-column bg-info p-3 border border-dark rounded">
                    <div className=" border-dark border-bottom">
                        <div className="d-flex p-2">
                            <img src={samuel} width="80px" height="80px" />
                            <div className="ps-3">
                                <h4>Welcome,</h4>
                                <h3>Samuel Hayden</h3>
                            </div>
                        </div>
                        <div>
                            <h5>Current position</h5>
                            <h4>CFO UAC Mars facility</h4>
                        </div>
                    </div>
                    <div className="d-flex flex-column mt-4">
                        <h2>Connections</h2>
                        <div style={connStyle} className="">
                            {getConnections().map((person) => (
                                <div className="d-flex p-2">
                                    <img
                                        src={profilePic}
                                        width="40px"
                                        height="40px"
                                    />
                                    <h4 className="ms-2">
                                        {person.name + " " + person.surname}
                                    </h4>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    const timeLine = () => {
        const postStyle = {
            width: "500px",
        }
        const timeLineStyle = {
            width: "700px",
        }
        return (
            <div
                style={timeLineStyle}
                className="d-flex flex-column ms-5 align-items-center "
            >
                <h1></h1>

                <div className="d-flex align-items-center">
                    <div className="d-flex flex-column ">
                        <input
                            className="p-4"
                            type="text"
                            value="Whats on your mind?"
                        ></input>
                        <input className="mt-1" type="file"></input>
                    </div>
                    <button className="ms-2 p-2">post</button>
                </div>

                {getPosts().map((post) => (
                    <div
                        style={postStyle}
                        className="d-flex flex-column  mt-5 border border-primary  "
                    >
                        <div className="border-bottom border-dark ml-5 mr-5 mt-5 d-flex flex-column align-items-start ">
                            <div className="d-flex p-2">
                                <img
                                    src={profilePic}
                                    width="30px"
                                    height="30px"
                                />
                                <div>
                                    <h4 className="ms-2">
                                        {post.name + " " + post.surname}
                                    </h4>
                                    <span className="ms-2">
                                        posted {post.date} days ago
                                    </span>
                                </div>
                            </div>
                            <div className="m-4">
                                <span>{post.text}</span>
                            </div>
                        </div>
                        <div>
                            {post.likes + " likes"}
                            <div className="d-flex ">
                                <button>like</button>
                                <button>comment</button>
                                <button>share</button>
                            </div>
                            <input type="text"></input>
                            {post.comments.map((comment) => (
                                <div className="m-1">
                                    <div className="d-flex">
                                        <img
                                            src={profilePic}
                                            width="20px"
                                            height="20px"
                                        />

                                        <h5 className="ms-2">
                                            {comment.name +
                                                " " +
                                                comment.surname}
                                        </h5>
                                    </div>
                                    <span>{comment.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        )
    }
    const getPosts = () => {
        const posts = [
            {
                name: "Johnathan",
                surname: "Joestar",
                text: "Cairo is kinda nice tbh , but i feel like im being watched ",
                date: 2,
                likes: 25,
                comments: [
                    { name: "joseph", surname: "joestar", text: "NICE" },
                    {
                        name: "dio",
                        surname: "brando",
                        text: "MUDAMUDAMUDAMUDA",
                    },
                    { name: "joseph", surname: "joestar", text: "OH MY GOD" },
                ],
            },
            {
                name: "Johnathan",
                surname: "Joestar",
                text: "Cairo is kinda nice tbh",
                date: 2,
                likes: 25,
                comments: [
                    { name: "joseph", surname: "joestar", text: "OH MY GOD" },
                    { name: "joseph", surname: "joestar", text: "NICE" },
                ],
            },
            {
                name: "Johnathan",
                surname: "Joestar",
                text: "Cairo is kinda nice tbh",
                date: 2,
                likes: 25,
                comments: [
                    { name: "joseph", surname: "joestar", text: "OH MY GOD" },
                    { name: "joseph", surname: "joestar", text: "NICE" },
                ],
            },
        ]
        return posts
    }
    return (
        <div className="d-flex m-4">
            {profile()}
            {timeLine()}
        </div>
    )
}
export default Home
