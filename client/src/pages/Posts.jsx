import { useEffect, useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { useCookies } from 'react-cookie';
import '../Index.css'
const Posts = () => {
    const [cookie] = useCookies();
    const [userPosts, setUserPosts] = useState();
    useEffect(() => {
        window.scrollTo(0, 0);
        if (typeof cookie.user !== 'undefined') {
            fetch('/api/getPosts').then(res => res.json())
                .then(data => { setUserPosts(data) })
                .catch(err => { console.log(err) });
        }
    }, [])

    if (typeof cookie.user === 'undefined')
        return <Navigate to={'/login'} />;
    return (
        <div className="container w-50 pt-5 text-white" id='index'>
            <div className="row">
                <div className="col-md-12">
                    <h2>Posts <Link to={'/addPost'} className="btn btn-success float-end">Add Post</Link></h2>
                    <hr />
                    <div>
                        <table className="table text-white">
                            {
                                (typeof userPosts === 'undefined') ?
                                    (
                                        <div className="d-flex justify-content-center">
                                            <div className="spinner-border" role="status">
                                                <span className="visually-hidden">Loading...</span>
                                            </div>
                                        </div>
                                    ) :
                                    (
                                        (userPosts.length === 0) ?
                                            (<p>No Posts</p>) :
                                            (
                                                <>
                                                    <thead>
                                                        <tr>
                                                            <th>Title</th>
                                                            <th>Date Posted</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            userPosts.map(e => {
                                                                return (
                                                                    <tr>
                                                                        <td>{e.title}</td>
                                                                        <td>{e.postDate.replace('T00:00:00.000Z', '')}</td>
                                                                    </tr>
                                                                )
                                                            })
                                                        }
                                                    </tbody>
                                                </>
                                            )
                                    )
                            }
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Posts;