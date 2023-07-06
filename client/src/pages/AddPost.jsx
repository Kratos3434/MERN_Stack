import { useState } from "react";
import { useCookies } from 'react-cookie';
import { Navigate, useNavigate } from "react-router-dom";
import '../addPost.css'
const AddPost = () => {
  const navigate = useNavigate();
  const [cookie] = useCookies();
  const [body, setBody] = useState();
  const [featureImage, setImage] = useState();
  const [submitting, setSubmitting] = useState(false);
  const [err,setErr] = useState(false);
  const validateFile = (e)=>{
    let file = e.target.files[0];
    let convertBtoMB = (bytes)=>{
      return bytes/(1024*1024);
    }
    if(convertBtoMB(file.size) > 100){
      setErr(true);
    }
    else{
      setErr(false);
      setImage(e.target.files[0]);
    }
  }
  const handlePost = (e) => {
    e.preventDefault();
    if (typeof cookie.user === 'undefined') {
      navigate('/login');
      return false;
    }
    else {
      if(err){
        return;
      }
      setSubmitting(true);
      const formData = new FormData();
      formData.append('userName', cookie.user.userName);
      formData.append('body', body);
      formData.append('featureImage', featureImage);
      fetch('/api/add/post', {
        method: 'POST',
        body: formData
      }).then(res => res.json()).then(data => {
        cookie.user.posts = data;
        navigate('/');
      })
        .catch(err => { console.log(err) });
    }
  }
  //const [message,setMessage] = useState(undefined);
  if (typeof cookie.user === 'undefined')
    return <Navigate to={'/login'} />;

  return (
    <>
      <div className="container text-center" id='index'>
        <div className="row">
          <div className="col-sm-9 col-md-7 col-lg-5 mx-auto">
            <div className="card border-0 shadow rounded-3 my-5">
              <div className="card-body p-4 p-sm-5">
                <h5 className="card-title text-center mb-5 fw-light fs-5">Post Content</h5>
                {
                  (err)?
                  (<div className="alert alert-danger"> <strong>Error:</strong> File size must be less than or equal to 100MB</div>):(<></>)
                }
                <form onSubmit={handlePost}>
                  <div class="input-group">
                    <input filename={featureImage} class="form-control" id="inputGroupFile04" aria-describedby="inputGroupFileAddon04" aria-label="Upload"
                      onChange={validateFile} type="file" required />
                  </div>
                  <br />
                  <div >
                    <textarea className="form-control" id="exampleFormControlTextarea1" rows="10"
                      placeholder="Description" onChange={e => setBody(e.target.value)} required></textarea>
                  </div>
                  <br />
                  {
                    (submitting) ?
                      (
                        <div className="d-grid">
                          <button className="btn btn-primary btn-login text-uppercase fw-bold" type="submit">
                            <div class="spinner-border spinner-border-sm" role="status">
                              <span class="visually-hidden">Loading...</span>
                            </div>&nbsp;&nbsp;
                            Processing Post... (Please wait)
                          </button>
                        </div>
                      ) :
                      (
                        <div className="d-grid">
                          <button className="btn btn-primary btn-login text-uppercase fw-bold" type="submit">
                            Add Post
                          </button>
                        </div>
                      )
                  }
                  <hr className="my-4" />
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default AddPost;