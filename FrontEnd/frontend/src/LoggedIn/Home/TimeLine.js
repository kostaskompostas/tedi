import React, { Component, useState, useEffect } from "react"
import profilePic from "../../icons/profile.png"
import { Avatar } from "../../util/util.js"
import Article from "./Article"

function TimeLine(props) {
    const [newarticle, setNewarticle] = useState()
    const [articles, setArticles] = useState(false)
    let client = props.myHelper.client
    const timeLineStyle = {
        width: "700px",
    }

    const OnArticleInteract = (e) => {}

    const OnImageAdd = (e, article_id) => {
        const formData = new FormData()

        if (e.target.articleFiles.files.length > 0) {
            formData.append(
                "image_file",
                e.target.articleFiles.files[0],
                e.target.articleFiles.files[0].name
            )
            formData.append("add_image", true)
            formData.append("article_id", article_id)

            console.log("inside image add " + article_id)
            console.log("attaching file")

            client
                .post("/api/articles/", formData, {
                    headers: {
                        Authorization: "Token " + props.myHelper.GetToken(),
                    },
                })
                .then(
                    (response) => {
                        console.log("attached file successfully")
                        console.log(response.data)
                        FinilizeArticle(e, article_id)
                    },
                    (error) => console.log(error)
                )
        } else {
            console.log("no files attached")
        }
    }
    const FinilizeArticle = (e, article_id) => {
        client
            .post(
                "/api/articles/",
                {
                    finalize: "finalize",
                    article_id: article_id,
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
                    console.log("article created")
                    RefreshTimeline()
                },
                (error) => console.log(error)
            )
    }
    const OnArticleSubmit = (e) => {
        e.preventDefault()

        const formData = new FormData()
        let article_id

        formData.append("create", true)
        formData.append("content", e.target.articleText.value)

        //create article
        const promise = client
            .post("/api/articles/", formData, {
                headers: {
                    Authorization: "Token " + props.myHelper.GetToken(),
                },
            })
            .then(
                (response) => {
                    if (response.data.success == "false") {
                        console.log(response.data)
                        return
                    }
                    let articleId = response.data.article_id
                    console.log("after create " + articleId)
                    if (e.target.articleFiles.files.length > 0) {
                        OnImageAdd(e, articleId)
                    } else {
                        if (e.target.articleText.value == "") {
                            //article is empty, delete it and dont post it
                            OnArticleDelete(e, articleId)
                            return
                        }
                        FinilizeArticle(e, articleId)
                    }
                },
                (error) => console.log(error)
            )
    }
    const OnArticleDelete = (e, article_id) => {
        console.log(article_id)
        client
            .delete("api/articles/", {
                headers: {
                    Authorization: "Token " + props.myHelper.GetToken(),
                },
                data: {
                    article_id: article_id,
                },
            })
            .then(
                (response) => {
                    console.log(response.data)
                    if (props.RefreshTimeline != undefined)
                        props.RefreshTimeline()
                },
                (error) => console.log(error.data)
            )
        //delete this
    }
    function RefreshTimeline() {
        FetchArticles()
    }
    async function FetchArticles() {
        console.log("fetching article")

        const response = await client.get("/api/articles/" + "?all")
        /*const dataPromise = promise.then(
            (response) => {
                let myarray = response.data.items
                myarray = myarray.reverse()
                setArticles(myarray)
                return myarray
                //console.log(newarticle)
            },
            (error) => console.log("error")
        )*/
        let newarticles = response.data.items.reverse()
        console.log(newarticles[0])
        setArticles(newarticles)
    }

    useEffect(() => {
        RefreshTimeline()
    }, [])

    return (
        <div
            style={timeLineStyle}
            className="d-flex flex-column ms-5 align-items-center "
        >
            <h1>TimeLine</h1>

            <form
                className="d-flex align-items-center"
                onSubmit={(e) => OnArticleSubmit(e)}
            >
                <div className="d-flex flex-column ">
                    <textarea
                        className="p-4"
                        type="text"
                        name="articleText"
                        placeholder="Whats on your mind?"
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
            <button
                className="mt-5 btn btn-secondary "
                type="submit"
                onClick={FetchArticles}
            >
                Refresh
            </button>
            {articles == false
                ? "loading article"
                : articles.map((article) => (
                      <Article
                          key={article.article_id}
                          userInfo={props.userInfo}
                          data={article}
                          myHelper={props.myHelper}
                          RefreshTimeline={RefreshTimeline}
                      />
                  ))}
        </div>
    )
}
export default TimeLine
