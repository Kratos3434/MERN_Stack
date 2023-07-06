import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
    const navigate = useNavigate();
    const [userName, setUserName] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitting(true);
        fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "userName": userName,
                "firstName": firstName,
                "lastName": lastName,
                "password": password,
                "password2": password2,
                "email": email
            })
        }).then(res => res.json()).then(data => {
            if (data.successMessage) {
                navigate('/login');
            }
            else {
                setSubmitting(false);
                setMessage(data);
            }
        })
    }
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    return (
        <div>
            {
                (typeof message.successMessage === 'undefined') ?
                    (
                        <div className="container">
                            <div className="row">
                                <div className="col-sm-9 col-md-7 col-lg-5 mx-auto">
                                    <div className="card border-0 shadow rounded-3 my-5 login">
                                        <div className="card-body p-4 p-sm-5">
                                            <h5 className="card-title text-center mb-5 fw-light fs-5">Register</h5>
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
                                                    <input type="text" className="form-control" id="floatingInput" placeholder="First Name" name='firstName' onChange={(e) => setFirstName(e.target.value)} required />
                                                    <label htmlFor="floatingInput">First Name</label>
                                                </div>
                                                <div className="form-floating mb-3">
                                                    <input type="text" className="form-control" id="floatingInput" placeholder="Last Name" name='lastName' onChange={(e) => setLastName(e.target.value)} required />
                                                    <label htmlFor="floatingInput">Last Name</label>
                                                </div>
                                                <div className="form-floating mb-3">
                                                    <input type="password" className="form-control" id="floatingPassword" placeholder="Password" name="password" onChange={(e) => setPassword(e.target.value)} required />
                                                    <label htmlFor="floatingPassword">Password</label>
                                                </div>
                                                <div className="form-floating mb-3">
                                                    <input type="password" className="form-control" id="floatingPassword" placeholder="Confirm Password" name="password2" onChange={(e) => setPassword2(e.target.value)} required />
                                                    <label htmlFor="floatingPassword">Confirm Password</label>
                                                </div>
                                                <div className="form-floating mb-3">
                                                    <input type="email" className="form-control" id="floatingPassword" placeholder="Email" name="email" onChange={(e) => setEmail(e.target.value)} required />
                                                    <label htmlFor="floatingPassword">Email</label>
                                                </div>
                                                {
                                                    (submitting) ?
                                                        (
                                                            <div className="d-grid">
                                                                <button className="btn btn-primary btn-login text-uppercase fw-bold" type="submit">
                                                                    <div class="spinner-border spinner-border-sm" role="status">
                                                                        <span class="visually-hidden">Loading...</span>
                                                                    </div>&nbsp;&nbsp;
                                                                    Please wait...
                                                                </button>
                                                            </div>
                                                        ) :
                                                        (
                                                            <div className="d-grid">
                                                                <button className="btn btn-primary btn-login text-uppercase fw-bold" type="submit">Register</button>
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
                    )
                    :
                    (<h1>{message.successMessage}</h1>)
            }
        </div>
    )
}

export default Register;