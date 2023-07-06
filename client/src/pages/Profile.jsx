import { useEffect, useState } from "react";
import { Outlet, Link, Navigate, useParams } from "react-router-dom";
import { useCookies } from "react-cookie";
import '../Index.css';
const Profile = () => {
  const [cookie] = useCookies();
  const { userName } = useParams();
  const [other, setOther] = useState();

  useEffect(() => {
    window.scrollTo(0, 0);
    if (userName !== cookie.user.userName) {
      fetch('/api/getUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "userName": userName
        })
      }).then(res => res.json()).then(data => {
        setOther(data);
      }).catch(err => console.log(err));
    }
  }, []);
  if (typeof cookie.user === 'undefined')
    return <Navigate to={'/login'} />

  return (
    <>
      {
        (userName !== cookie.user.userName) ?
          (
            <>
              {
                (typeof other === 'undefined') ?
                  (
                    <div className="container w-50 pt-5 text-center" id='index'>
                    <div className="d-flex justify-content-center">
                      <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </div>
                    </div>
                  ) :
                  (
                    (typeof other.errMsg !== 'undefined') ?
                      (
                        <div className="container w-50 pt-5 text-center" id='index'>
                        <h1>We could not find this user or this user does not exist.</h1>
                        </div>
                      ) :
                      (
                        <>
                          <div className="profile-top">
                            <div className="container w-50 pt-5 text-center" id='index'>
                              <img src="https://www.stoutstreet.co.nz/wp-content/uploads/2018/08/placeholder-profile.jpg" class="rounded-circle mx-auto d-block img-fluid" alt="..." />
                              <h1>{other.firstName} {other.lastName}</h1>
                              <hr></hr>
                              <nav className="navbar navbar-expand-lg navbar-light bg-light profile-nav">
                                <div className="container-fluid profile-nav">
                                  <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                                    <span className="navbar-toggler-icon"></span>
                                  </button>
                                  <div className="collapse navbar-collapse" id="navbarNavDropdown">
                                    <ul className="navbar-nav">
                                      <li className="nav-item">
                                        <Link to={'/' + userName} className="nav-link" aria-current="page">Posts</Link>
                                      </li>
                                      <li class="nav-item">
                                        <Link to={'/' + userName + '/about'} className="nav-link" aria-current="page">About</Link>
                                      </li>
                                      <li className="nav-item">
                                        <a className="nav-link" href="#">Pricing</a>
                                      </li>
                                      <li className="nav-item dropdown">
                                        <a className="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                          Dropdown link
                                        </a>
                                        <ul className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                                          <li><a className="dropdown-item" href="#">Action</a></li>
                                          <li><a className="dropdown-item" href="#">Another action</a></li>
                                          <li><a className="dropdown-item" href="#">Something else here</a></li>
                                        </ul>
                                      </li> 
                                    </ul>
                                  </div>
                                </div>
                              </nav>
                            </div>
                          </div>
                          <Outlet />
                        </>
                      )
                  )
              }
              </>
          ) :
          (
            <>
              <div className="profile-top">
                <div className="container w-50 pt-5 text-center" id='index'>
                  <img src="https://www.stoutstreet.co.nz/wp-content/uploads/2018/08/placeholder-profile.jpg" class="rounded-circle mx-auto d-block img-fluid" alt="..." />
                  <h1>{cookie.user.firstName} {cookie.user.lastName}</h1>
                  <hr></hr>
                  <nav className="navbar navbar-expand-lg navbar-light bg-light profile-nav">
                    <div className="container-fluid profile-nav">
                      
                      <div>
                        <ul className="navbar-nav list-group-horizontal ">
                          <li className="nav-item">
                            <Link to={'/' + cookie.user.userName} className="nav-link" aria-current="page">Posts</Link>
                          </li>
                          &nbsp; &nbsp;
                          <li class="nav-item">
                            <Link to={'/' + cookie.user.userName + '/about'} className="nav-link" aria-current="page">About</Link>
                          </li>
                          &nbsp; &nbsp;
                          <li className="nav-item">
                            <a className="nav-link" href="#">Pricing</a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </nav>
                </div>
              </div>
              <Outlet />
            </>
          )
      }
    </>
  )
}

export default Profile;