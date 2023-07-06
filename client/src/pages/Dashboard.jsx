import { Link,Outlet } from 'react-router-dom';
import { useEffect } from 'react';

const Dashboard = ()=>{
    useEffect(()=>{
        window.scrollTo(0,0);
    },[]);
    return(
        <>
            <div>
                <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                    <a className="navbar-brand" href="#">&nbsp;Welcome</a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNavDropdown">
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <Link to={'/register'} className='nav-link'>&nbsp;Register</Link>
                            </li>
                            <li className="nav-item">
                                <Link to={'/login'} className='nav-link'>&nbsp;Log in</Link>
                            </li>
                        </ul>
                    </div>
                </nav>
            </div>
            <Outlet/>
        </>
    )
}

export default Dashboard;