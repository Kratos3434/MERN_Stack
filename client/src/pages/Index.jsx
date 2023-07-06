import { useEffect, useState } from "react";
import { Navigate, Link } from "react-router-dom";
//import { userContext } from "../App";
import { useCookies } from 'react-cookie';
import Comments from "./Comments";
import '../Index.css'
const Home = () => {
    const [cookie] = useCookies();
    const [posts, setPosts] = useState();
    const [comment, setComment] = useState();
    const [postID, setPostID] = useState();
    const [posts2, setPosts2] = useState([]);
    const [commentingTo, setCommentingTo] = useState();

    const postComment = (e) => {
        e.preventDefault();
        const com = comment;
        setComment('');
        fetch('/api/postComment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "postID": postID,
                "userName": commentingTo,
                "body": com,
                "firstName": cookie.user.firstName,
                "lastName": cookie.user.lastName
            })
        }).then(res => res.json())
            .then(data => {
                getPosts(setPosts2);
            }).catch(err => console.log(err));
    };
    const getPosts = async (setter) => {
        await fetch('/api/posts').then(res => res.json())
            .then(data => {
                setter(data);
                setPosts2(data);
            })
            .catch(err => { setter([]) });
    };
    useEffect(() => {
        window.scrollTo(0, 0);
        if (typeof cookie.user !== 'undefined') {
            getPosts(setPosts);
        }

    }, [])
    if (typeof cookie.user === 'undefined')
        return <Navigate to={'/login'} />;
    return (
        <>
            {
                (typeof cookie.user === 'undefined') ?
                    (<></>) : (
                        <div className="container w-50 pt-4" id='index'>
                            {
                                (typeof posts === 'undefined') ?
                                    (
                                        <div class="d-flex justify-content-center">
                                            <div class="spinner-border" role="status">
                                                <span class="visually-hidden">Loading...</span>
                                            </div>
                                        </div>
                                    ) :
                                    (
                                        (posts.length === 0) ?
                                            (<p>No Posts</p>) :
                                            (
                                                <>
                                                    {
                                                        posts.map(e => {
                                                            return (
                                                                <div class="card mb-3 shadow">
                                                                    {
                                                                        (e.featureImage.substring(e.featureImage.lastIndexOf('.'), e.featureImage.length) === '.mp4') ?
                                                                            (
                                                                                <video className="card-img-top" src={e.featureImage} loop controls>
                                                                                </video>
                                                                            ) :
                                                                            (<img src={e.featureImage} class="card-img-top img-fluid" alt="..." />)
                                                                    }
                                                                    <div class="card-body">
                                                                        <Link to={'/' + e.userName} className='card-text'><strong><small className="author">{e.author}</small></strong></Link>

                                                                        <p className="card-text">
                                                                            {e.description}
                                                                        </p>
                                                                        <p className="card-text"><small>Date Posted: {e.postDate}</small></p>
                                                                        <form>
                                                                            <div>
                                                                                <textarea type="text" className="form-control" placeholder="add a comment..." name='userName'
                                                                                    value={comment}
                                                                                    onChange={(v) => {
                                                                                        setComment(v.target.value)
                                                                                        setPostID(e.postID);
                                                                                        setCommentingTo(e.userName);
                                                                                    }
                                                                                    } required />
                                                                            </div>
                                                                            {
                                                                                (typeof posts2 === 'undefined') ?
                                                                                    (<></>) : (
                                                                                        <>
                                                                                            <br />
                                                                                            {

                                                                                                posts2.map(b => {
                                                                                                    return (
                                                                                                        (b.userName === e.userName) ?
                                                                                                            (
                                                                                                                (b.comment.length !== 0) ?
                                                                                                                    (
                                                                                                                        (b.postID === e.postID) ?
                                                                                                                            (<Comments comments={b.comment} userName={b.userName} description={b.description}
                                                                                                                                postID={b.postID} />)
                                                                                                                            : (<></>)
                                                                                                                    ) : (<></>)
                                                                                                            ) : (<></>)
                                                                                                    )
                                                                                                })
                                                                                            }
                                                                                        </>
                                                                                    )
                                                                            }
                                                                            <hr className="my-4" />
                                                                            <div className="d-grid">
                                                                                <button className="btn btn-primary btn-login text-uppercase fw-bold" type="submit"
                                                                                    onClick={(v) => {
                                                                                        v.preventDefault();
                                                                                        postComment(v);
                                                                                    }}>Add comment</button>
                                                                            </div>
                                                                        </form>
                                                                    </div>
                                                                </div>
                                                            )
                                                        })
                                                    }
                                                </>
                                            )
                                    )
                            }
                            <br />
                        </div>
                    )
            }
            <footer>

            </footer>
        </>
    )
}

export default Home;