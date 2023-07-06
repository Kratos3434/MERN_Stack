import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { Navigate, Link, useParams } from "react-router-dom";
import Comments from "./Comments";
const UserPosts = () => {
    const { userName } = useParams();
    const [cookie] = useCookies();
    const [userPosts, setUserPosts] = useState();
    const [other, setOther] = useState();
    const [userPosts2, setUserPosts2] = useState([]);
    const [comment, setComment] = useState();
    const [other2, setOther2] = useState();
    const [postID, setPostID] = useState();
    const [commentingTo, setCommentingTo] = useState();
    const [id, setId] = useState();
    //Fix posting comment since posting comment to other posts it to self!
    const postComment = (e) => {
        e.preventDefault();
        console.log(postID)
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
                getPosts(setUserPosts2);
                getUser(setOther2);
            }).catch(err => console.log(err));
    }
    const getPosts = (setter) => {
        fetch('/api/getPosts',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "userName": cookie.user.userName,
            })
        }).then(res => res.json())
            .then(data => {
                setter(data);
                setUserPosts2(data);
            })
            .catch(err => { console.log(err) });
    }
    const getUser = (setter) => {
        fetch('/api/getUser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "userName": userName
            })
        }).then(res => res.json()).then(data => {
            setter(data);
            setOther2(data);
        }).catch(err => console.log(err));
    }
    const handleDelete = (e) => {
        e.preventDefault();
        fetch('/api/deletePost', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "userName": cookie.user.userName,
                "postID": id
            })
        }).then(res => res.json()).then(d => {
            getPosts(setUserPosts);
        }).catch(err => console.log(err));
    }
    useEffect(() => {
        //window.scrollTo(0, 0);
        if (typeof cookie.user !== 'undefined') {
            getPosts(setUserPosts);
            console.log(userPosts2.length)
        }
        if (userName !== cookie.user.userName) {
            getUser(setOther);
        }
    }, []);
    if (typeof cookie.user === 'undefined')
        return <Navigate to={'/login'} />

    return (
        <>
            {
                (typeof cookie.user === 'undefined') ?
                    (<></>) : (
                        <div className="container w-50 pt-4" id='index'>
                            {
                                (userName !== cookie.user.userName) ?
                                    (
                                        <>
                                            {
                                                (typeof other === 'undefined') ?
                                                    (
                                                        <div className="d-flex justify-content-center">
                                                            <div className="spinner-border" role="status">
                                                                <span className="visually-hidden">Loading...</span>
                                                            </div>
                                                        </div>
                                                    ) :
                                                    (
                                                        <>
                                                            <hr className="whiteline" />
                                                            {
                                                                (other.posts.length === 0) ?
                                                                    (<p>No Posts</p>) :
                                                                    (
                                                                        <>
                                                                            {
                                                                                other.posts.map(e => {
                                                                                    return (
                                                                                        <div className="card mb-3 shadow">
                                                                                            {
                                                                                                (e.featureImage.substring(e.featureImage.lastIndexOf('.'), e.featureImage.length) === '.mp4') ?
                                                                                                    (
                                                                                                        <video className="card-img-top" loop autoPlay muted controls>
                                                                                                            <source src={e.featureImage} type='video/mp4'></source>
                                                                                                        </video>
                                                                                                    ) :
                                                                                                    (<img src={e.featureImage} className="card-img-top img-fluid" alt="..." />)
                                                                                            }
                                                                                            <div className="card-body">
                                                                                                <Link to={'/' + other.userName} className='card-text'>
                                                                                                    <strong><small className="author">{other.firstName} {other.lastName}</small></strong>
                                                                                                </Link>
                                                                                                {
                                                                                                    (e.title !== 'undefined') ?
                                                                                                        (<h5 className="card-title">{e.title}</h5>) : (<></>)
                                                                                                }
                                                                                                <p className="card-text">{e.description}</p>
                                                                                                <p className="card-text"><small>Date Posted: {e.postDate}</small></p>
                                                                                                <form>
                                                                                                    <div>
                                                                                                        <textarea type="text" className="form-control" placeholder="add a comment..." name='userName'
                                                                                                            value={comment}
                                                                                                            onChange={(v) => {
                                                                                                                setComment(v.target.value)
                                                                                                                setPostID(e.postID);
                                                                                                                setCommentingTo(other.userName);
                                                                                                            }
                                                                                                            } required />
                                                                                                    </div>
                                                                                                    {
                                                                                                        (other2.length === 0) ?
                                                                                                            (<></>) : (
                                                                                                                <>
                                                                                                                    <br />
                                                                                                                    {
                                                                                                                        other2.posts.map(b => {
                                                                                                                            return (
                                                                                                                                (b.comment.length === 0) ?
                                                                                                                                    (<></>) :
                                                                                                                                    (
                                                                                                                                        (b.postID === e.postID) ?
                                                                                                                                            (<Comments comments={b.comment} userName={cookie.user.userName} description={e.description}
                                                                                                                                                postID={b.postID} />)
                                                                                                                                            : (<></>)
                                                                                                                                    )
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
                                                                                                                if (comment === '') return false;
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
                                                            }
                                                        </>
                                                    )
                                            }

                                        </>
                                    ) :
                                    (
                                        (typeof userPosts === 'undefined') ?
                                            (
                                                <div className="d-flex justify-content-center">
                                                    <div className="spinner-border" role="status">
                                                        <span className="visually-hidden">Loading...</span>
                                                    </div>
                                                </div>
                                            ) :
                                            (
                                                <>
                                                    <Link to={'/addPost'} className="btn btn-secondary">Add Post</Link>
                                                    <hr className="whiteline" />
                                                    {
                                                        (userPosts.length === 0) ?
                                                            (<p>No Posts</p>) :
                                                            (
                                                                <>
                                                                    {
                                                                        userPosts.map(e => {
                                                                            return (
                                                                                <div className="card mb-3 shadow">
                                                                                    {
                                                                                        (e.featureImage.substring(e.featureImage.lastIndexOf('.'), e.featureImage.length) === '.mp4') ?
                                                                                            (
                                                                                                <video className="card-img-top" src={e.featureImage} loop autoPlay muted controls>
                                                                                                </video>
                                                                                            ) :
                                                                                            (<img src={e.featureImage} className="card-img-top img-fluid" alt="..." />)
                                                                                    }
                                                                                    <div className="card-body">
                                                                                        <div>
                                                                                            <Link to={'/' + cookie.user.userName} className='card-text'>
                                                                                                <strong><small className="author">{cookie.user.firstName} {cookie.user.lastName}</small></strong>
                                                                                            </Link>
                                                                                            <div className="dropdown float-end">
                                                                                                <button className="btn btn-link dropdown-toggle" type="button" id="options" data-bs-toggle="dropdown" aria-expanded="false"
                                                                                                    onClick={(o) => {
                                                                                                        o.preventDefault();
                                                                                                        setId(e.postID);
                                                                                                    }}>
                                                                                                </button>
                                                                                                <ul className="dropdown-menu" aria-labelledby="options">
                                                                                                    <li><a className="dropdown-item" data-bs-toggle="modal" data-bs-target='#confirmation' href="/#">Delete</a></li>
                                                                                                </ul>
                                                                                            </div>
                                                                                            <div className="modal fade" id="confirmation" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                                                                                                <div className="modal-dialog modal-dialog-scrollable modal-dialog-centered">
                                                                                                    <div className="modal-content text-black">
                                                                                                        <div className="modal-header">
                                                                                                            <h5>Are you sure that you want to delete this post?</h5>
                                                                                                        </div>
                                                                                                        <div className="modal-body">
                                                                                                            <button type="button" className="btn btn-success" data-bs-dismiss="modal" onClick={handleDelete}>Confirm</button>
                                                                                                            &nbsp;
                                                                                                            <button type="button" className="btn btn-danger" data-bs-dismiss="modal">Cancel</button>
                                                                                                        </div>

                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                        {
                                                                                            (e.title !== 'undefined') ?
                                                                                                (<h5 className="card-title">{e.title}</h5>) : (<></>)
                                                                                        }
                                                                                        <p className="card-text">{e.description}</p>
                                                                                        <p className="card-text"><small>Date Posted: {e.postDate}</small></p>
                                                                                        <form>
                                                                                            <div>
                                                                                                <textarea type="text" className="form-control" placeholder="add a comment..." name='userName'
                                                                                                    value={comment}
                                                                                                    onChange={(v) => {
                                                                                                        setComment(v.target.value)
                                                                                                        setPostID(e.postID);
                                                                                                        setCommentingTo(cookie.user.userName);
                                                                                                    }
                                                                                                    } required />
                                                                                            </div>
                                                                                            {
                                                                                                (typeof userPosts2 === 'undefined') ?
                                                                                                    (<></>) :
                                                                                                    (
                                                                                                        <>
                                                                                                            <br />
                                                                                                            {
                                                                                                                userPosts2.map(b => {
                                                                                                                    return (
                                                                                                                        (b.comment.length === 0) ?
                                                                                                                            (<></>) :
                                                                                                                            (
                                                                                                                                (b.postID === e.postID) ?
                                                                                                                                    (<Comments comments={b.comment} userName={cookie.user.userName} description={e.description}
                                                                                                                                        postID={b.postID} />)
                                                                                                                                    : (<></>)
                                                                                                                            )
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
                                                                                                        if (comment === '') return false;
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

export default UserPosts;