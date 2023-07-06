import {useState} from "react";

const Search = (props)=>{
    const [searchTerm,setSearchTerm] = useState();
    return(
        <div>
            <input placeholder='Search people you know'
                value={searchTerm} 
                onChange={e=>setSearchTerm(e.target.value)}
                onKeyUp={e=>{
                    props.set(props.Find.filter(e=>{
                        let fullName = e.fName + ' ' + e.lName;
                        return fullName.toUpperCase().includes(searchTerm.toUpperCase()) && searchTerm !== '' && searchTerm !== ' ' ;
                    }))  
                }}
                autoComplete='on' list='suggestions'
            >
            </input>
            {
                (props.result.length === 0)?
                (<></>):
                (
                    <div className="searchResult">
                        {
                            <div className="results">
                                <ul>
                                    {
                                        props.result.map(e=>{
                                            return <li className='result'><a href='/'>{e.fName + ' ' + e.lName}</a></li>
                                        })
                                    }
                                </ul>
                            </div>
                        }
                    </div>
                )
            }
        </div>
    )
}

export default Search;