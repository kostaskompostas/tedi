import React, { Component, useState, useEffect } from "react"
import profilePic from "../../icons/profile.png"
import { Avatar } from "../../util/util.js"
function Article(props) {
    const [comments, SetComments] = useState({
        show: false,
        data: null,
        num_comments: props.data.num_comments,
    })
    //refreshes comments
    useEffect(() => {
        if (comments.show) RefreshComments()
    }, [comments.show])

    const [likes, SetLikes] = useState(props.data.num_likes)
    useEffect(() => {
        CheckIfLiked()
    }, [])

    const [hasLiked, SetHasLiked] = useState()
    let client = props.myHelper.client
    let article = props.data

    const CheckIfLiked = () => {
        client
            .post(
                "api/articles/interact/",
                {
                    article_id: article.article_id,
                    like: true,
                    checkonly: true,
                },
                {
                    headers: {
                        Authorization: "Token " + props.myHelper.GetToken(),
                    },
                }
            )
            .then(
                (response) => {
                    let value
                    if (response.data.success == "false") {
                        value = false
                    } else if (response.data.success == "true") {
                        value = true
                    }

                    SetHasLiked(value)
                },
                (error) => console.log(error.data)
            )
    }

    //if article author is user, show delete button
    const articletyle = {
        width: "500px",
    }
    function RefreshComments() {}

    function RefreshComments() {
        FetchComments()
    }
    async function FetchComments() {
        console.log("fetching comments")

        const response = await client.get(
            "/api/articles/interact/" + "?article_id=" + article.article_id
        )

        let newcomments = response.data.comments
        SetComments({
            ...comments,
            data: newcomments,
            num_comments: newcomments.length,
        })
    }

    //check if post is already liked

    const FetchLikesAndCommentsNum = () => {
        client
            .get(
                "api/articles/interact/?article_id=" + article.article_id,
                {
                    article_id: article.article_id,
                },
                {
                    headers: {
                        Authorization: "Token " + props.myHelper.GetToken(),
                    },
                }
            )
            .then(
                (response) => {
                    if (response.data.successs == "false") return

                    SetLikes(response.data.likes)
                    SetComments({
                        ...comments,
                        num_comments: response.data.comments.length,
                    })
                },
                (error) => console.log(error.data)
            )
    }
    //fetch ammount of comments and likes

    const OnCommentSubmit = (e) => {
        e.preventDefault()
        if (e.target.myComment.value === "") return
        client
            .post(
                "/api/articles/interact/",
                {
                    article_id: article.article_id,
                    comment: "true",
                    comment_content: e.target.myComment.value,
                },
                {
                    headers: {
                        Authorization: "Token " + props.myHelper.GetToken(),
                    },
                }
            )
            .then(
                (response) => {
                    console.log("comment submitted")
                    e.target.myComment.value = ""
                    RefreshComments()
                },
                (error) => console.log(error.data)
            )
    }

    const OnLike = (e) => {
        e.preventDefault()

        client
            .post(
                "api/articles/interact/",
                {
                    article_id: article.article_id,
                    like: true,
                },
                {
                    headers: {
                        Authorization: "Token " + props.myHelper.GetToken(),
                    },
                }
            )
            .then(
                (response) => {
                    SetHasLiked((prevlikes) => !prevlikes)
                    FetchLikesAndCommentsNum()
                },
                (error) => console.log(error.data)
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
    let commentsInfo = (
        <div className="d-flex flex-column mt-2">
            <form className="d-flex " onSubmit={(e) => OnCommentSubmit(e)}>
                <input name="myComment" type="text"></input>
            </form>

            {comments.data != null ? (
                comments.data.map((comment) => (
                    <Comment
                        key={comment.comment_id}
                        data={comment}
                        myHelper={props.myHelper}
                    />
                ))
            ) : (
                <div className="mt-3">no comments yet</div>
            )}
        </div>
    )

    return (
        <div
            style={articletyle}
            className="d-flex flex-column  mt-5 border border-primary p-2 "
        >
            <div className="border-bottom border-dark ml-5 mr-5  d-flex flex-column align-items-start ">
                <div className="d-flex p-2 justify-content- ">
                    <div className="d-flex flex-column ">
                        <Avatar
                            myHelper={props.myHelper}
                            user_email={article.user_email}
                            userName={article.user_first_name}
                            width="30px"
                            height="30px"
                        />
                        <span className="ms-2">
                            posted on {article.created_on}
                        </span>
                    </div>
                    {article.user_email === props.userInfo.email ? (
                        <button
                            onClick={(e) =>
                                OnArticleDelete(e, article.article_id)
                            }
                            className="float-right btn-danger"
                        >
                            delete
                        </button>
                    ) : (
                        false
                    )}
                </div>
                <div className="m-4 d-flex flex-column">
                    <span>{article.article_content}</span>
                    {article.images !== undefined
                        ? article.images.map((image) => (
                              <img
                                  className="h-auto"
                                  width={"400px"}
                                  key={image}
                                  src={props.myHelper.GetBaseUrl() + image}
                              ></img>
                          ))
                        : ""}
                </div>
            </div>

            <div className="p-2">
                <div className="d-flex justify-content-between">
                    <span>{likes + " likes"}</span>
                    <span>{comments.num_comments + " comments"}</span>
                </div>
                <div className="d-flex ">
                    <button
                        className={
                            hasLiked == true
                                ? "btn btn-primary"
                                : "btn btn-secondary"
                        }
                        onClick={(e) => OnLike(e)}
                    >
                        like
                    </button>
                    <button
                        className=" ms-2"
                        onClick={() =>
                            SetComments({ ...comments, show: !comments.show })
                        }
                    >
                        comment
                    </button>
                </div>
                <div>{comments.show ? commentsInfo : null}</div>
            </div>
        </div>
    )
}

function Comment(props) {
    let comment = props.data
    //console.log(comment)
    return (
        <div className="p-2 mt-2 border border-secondary ">
            <Avatar
                user_email={comment.user_email}
                myHelper={props.myHelper}
                width="20px"
                height="20px"
            />

            <span>{comment.content}</span>
        </div>
    )
}

export default Article
