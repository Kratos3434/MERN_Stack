import {useCookies} from 'react-cookie';
import { Link,Outlet,useNavigate,Navigate } from 'react-router-dom';

const Layout = ()=>{
    const navigate = useNavigate();
    const [cookie,setCookie,removeCookie] = useCookies();
    //const [active,setActive] = useState(false);
    const handleLogout = (e)=>{
        e.preventDefault();
        fetch('/api/logout').then(res=>res.json())
        .then(data=>{
            removeCookie('user');
            removeCookie('about');
            navigate('/login');
        })
        .catch(err=>{
            removeCookie('user');
            removeCookie('about');
            navigate('/login');
        });
    }
    
    if(typeof cookie.user === 'undefined')
        return <Navigate to={'/login'}/>
    return(
        <>
            <div>
                <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-2 fixed-top text-white">
                <div className="dropdown">
                    <a className="btn btn-secondary dropdown-toggle" href="/#" role="button" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false">
                        <span className="glyphicon glyphicon-user"></span>&nbsp;&nbsp;{cookie.user.firstName} {cookie.user.lastName}&nbsp;&nbsp;<span
                        className="caret"></span>
                    </a>

                    <ul className="dropdown-menu" aria-labelledby="dropdownMenuLink">
                        <li><Link to={'/' + cookie.user.userName} className='dropdown-item'>Profile</Link></li>
                        <li className='nav-item'>
                            <Link to={'/logout'} className='dropdown-item' onClick={handleLogout}>Log Out</Link>
                        </li>
                    </ul>
                </div>

                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" data-toggle='collapse' id="navbarNavDropdown">
                        <ul className="navbar-nav">
                            <li className='nav-item'>
                                <Link to={'/'} className='nav-link'>Home</Link>
                            </li>
                        </ul>
                    </div>
                </nav>
            </div>
            <Outlet/>
        </>
    )
}

export default Layout;