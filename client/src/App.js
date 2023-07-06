import {createContext} from 'react';
import { Routes,Route, BrowserRouter } from 'react-router-dom';
import Layout from './pages/Layout';
import Home from './pages/Index';
import Login from './pages/Login';
import Register from './pages/register';
import Dashboard from './pages/Dashboard';
import AddPost from './pages/AddPost';
import Profile from './pages/Profile';
import UserPosts from './pages/UserPosts';
import About from './pages/About';

export const userContext = createContext();
const App = ()=>{
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<Layout/>}>
                    <Route index element={<Home/>}/>
                    <Route path='/addPost' element={<AddPost/>}/>
                    <Route path='/:userName' element={<Profile/>}>
                        <Route index element={<UserPosts/>}/>
                        <Route path='about' element={<About/>}/>
                    </Route>
                </Route>
                <Route path='/login' element={<Dashboard/>}>
                    <Route index element={<Login/>}/>
                </Route>
                <Route path='/register' element={<Dashboard/>}>
                    <Route index element={<Register/>}/>
                </Route>
            </Routes>
    </BrowserRouter>
    ) 
}

export default App;