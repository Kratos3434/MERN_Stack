import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
const Login = () => {
    const navigate = useNavigate();
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [cookies, setCookie] = useCookies();
    const handleSubmit = (e) => {
        e.preventDefault();
        fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "userName": userName,
                "password": password,
            })
        }).then(res => res.json()).then(data => {
            if (typeof data.user !== 'undefined') {
                let now = new Date();
                now.setTime(now.getTime() + (100 * 60 * 1000));
                setCookie('user', {
                    userName: data.user.userName, firstName: data.user.firstName,
                    lastName: data.user.lastName, email: data.user.email, posts: data.user.posts, expire: now
                }, { path: '/', expires: now });
                setCookie('about', { aboutMe: data.user.aboutMe }
                    , { path: '/', expires: now });
                navigate('/');
            }
            else
                {
                    console.log('login error')
                    setMessage(data);
                }
        })
    }
    return (
        <div>
            <div className="container">
                <div className="row">
                    <div className="col-sm-9 col-md-7 col-lg-5 mx-auto">
                        <div className="card border-0 shadow rounded-3 my-5 login">
                            <div className="card-body p-4 p-sm-5">
                                <h5 className="card-title text-center mb-5 fw-light fs-5">Log In</h5>
                                {
                                    (typeof message.errorMessage === 'undefined') ?
                                        (<></>) : (<div className="alert alert-danger"> <strong>Error:</strong> {message.errorMessage}</div>)
                                }
                                <form onSubmit={handleSubmit}>
                                    <div className="form-floating mb-3">
                                        <input type="text" className="form-control" id="floatingInput" placeholder="Username" name='userName' onChange={(e) => setUserName(e.target.value)} required />
                                        <label htmlFor="floatingInput">Username</label>
                                    </div>
                                    <div className="form-floating mb-3">
                                        <input type="password" className="form-control" id="floatingPassword" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
                                        <label htmlFor="floatingPassword">Password</label>
                                    </div>
                                    <div className="d-grid">
                                        <button className="btn btn-primary btn-login text-uppercase fw-bold" type="submit">Log
                                            in</button>
                                    </div>
                                    <hr className="my-4" />
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login;