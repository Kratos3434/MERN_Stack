import React from "react";
import '../Index.css'
const Comments = (props) => {
    return (
        <>
            <button type="button" className="btn btn-link cButton" data-bs-toggle="modal" data-bs-target={'#'+props.postID}>
                View all {props.comments.length} comments
            </button>
            <div className="modal fade" id={props.postID} data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-scrollable modal-dialog-centered">
                    <div className="modal-content text-black">
                        <div className="modal-header">
                            <h5>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                Comments</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <strong>{props.userName}</strong>&nbsp;&nbsp;
                            <small>{props.description}</small>
                            <hr/>
                            {
                                props.comments.map(e=>{
                                    return(
                                        <>
                                            <p className="cName">{e.name}</p>
                                            <p>{e.body}</p>
                                        </>
                                    )
                                })
                            }
                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}

export default Comments;