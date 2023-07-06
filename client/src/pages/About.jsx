import {useEffect,useState} from "react";
import { useParams } from "react-router-dom";
import { useCookies } from "react-cookie";
import '../Index.css';

const About = ()=>{
    const {userName} = useParams();
    const [cookie,setCookie] = useCookies();
    const [editMode,setEditMode] = useState(false);
    const [aboutMe,setAboutMe] = useState();
    const [other,setOther] = useState();
    const handleEdit = (e)=>{
        e.preventDefault();
        setEditMode(true);
    }
    const handleSubmit = (e)=>{
        e.preventDefault();
        fetch('/api/setAbout',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "userName": cookie.user.userName,
                "aboutMe": aboutMe
            })
        }).then(res=>res.json())
        .then(data=>{
            cookie.about.aboutMe = aboutMe;
            setCookie('about',{aboutMe:aboutMe});
            setEditMode(false);
        }).catch(err=>console.log(err));
    }
    const handleCancel = (e)=>{
        e.preventDefault();
        setEditMode(false);
    }
    useEffect(()=>{
        if(userName !== cookie.user.userName){
            fetch('/api/getUser',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "userName": userName
                })
            }).then(res=>res.json()).then(data=>{
                setOther(data);
            }).catch(err=>console.log(err));
        }
    },[]);
    return(
        <>
            <div className="container w-50 pt-4 about">
                <h1>
                    About me&nbsp;&nbsp; 
                    {
                        (userName === cookie.user.userName)?
                        (<button className="btn btn-success" onClick={handleEdit}>Edit</button>):
                        (<></>)
                    }
                </h1>
                <hr/>
                {
                    (editMode)?
                    (
                        <>
                            <div className="mb-3">
                                <label htmlFor="exampleFormControlTextarea1" className="form-label">Tell others about yourself:</label>
                                <textarea className="form-control" id="exampleFormControlTextarea1" rows="8" 
                                onChange={e=>setAboutMe(e.target.value)}></textarea>
                                <br/>
                                <span>
                                    <button className="btn btn-success" onClick={handleSubmit}>Confirm</button>
                                    &nbsp;&nbsp;&nbsp;&nbsp;
                                    <button className="btn btn-danger" onClick={handleCancel}>Cancel</button>
                                </span>
                                <br/><br/>
                            </div>
                        </>
                    ):
                    (
                        (userName === cookie.user.userName)?
                        (
                            (cookie.about.aboutMe === null)?
                            (<p>No information yet.</p>):
                            (<p>{cookie.about.aboutMe}</p>)
                        ):
                        (
                            (typeof other === 'undefined')?
                            (
                                <div className="container w-50 pt-5 text-center" id='index'>
                                    <div className="d-flex justify-content-center">
                                        <div className="spinner-border" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                    </div>
                                </div>
                            ):
                            (
                                (other.aboutMe === null)?
                                (<p>No information yet.</p>):
                                (<p>{other.aboutMe}</p>)
                            )
                        )
                    )
                }
            </div>
        </>
    )
}

export default About;