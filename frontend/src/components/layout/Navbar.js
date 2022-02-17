import React, { useMemo, useEffect } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil';
import { allUserState, userState } from '../../recoil/user/userState';
import { Link } from 'react-router-dom';
import { API, graphqlOperation } from 'aws-amplify';
import { onCreateTutee, onDeleteTutee, onUpdateTutee } from '../../graphql/subscriptions';
import { listTutees } from '../../graphql/queries';

const Navbar  = (props) => {

    const user = useRecoilValue(userState);
    const [ allUsers, setAllUsers ] = useRecoilState(allUserState);

    useEffect(()=> {
        console.log("@ user > ", user);
        console.log("@ allUsers > ", allUsers);

        getAllUsers().then(res => setAllUsers(res));

        createSubscriptions();
    }, []);

    const menu = useMemo(()=> ([
        { menuName: 'Home', to:'/' },
        { menuName: 'Auditorium', to:'/auditorium' },
        { menuName: 'Classroom', to:'/classroom' },
        { menuName: 'VR Learning', to:'/vrlearning' },
        { menuName: 'Lounge', to:'/lounge' },
        { menuName: 'About', to:'/about' },
    ]), []);

    const createSubscriptions = ()=>{

        API.graphql(
          graphqlOperation(onCreateTutee)
        ).subscribe({
          next: async(subData) => {
            const all = await getAllUsers();
            setAllUsers(all);
          }
        });
    
        API.graphql(
          graphqlOperation(onDeleteTutee)
        ).subscribe({
          next: async(subData) => {
            const all = await getAllUsers();
            setAllUsers(all);
          }
        });
    }
      
    const getAllUsers = async () => {
        const allData = await API.graphql(graphqlOperation(listTutees));
        const allTutees = Array.from(allData.data.listTutees.items);
        
        return allTutees;
    }

    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <div className="container-fluid">
                    <a className="navbar-brand" href="/">
                        &nbsp;&nbsp;&nbsp;
                        <i className={props.icon} /> &nbsp;&nbsp;{props.title}
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    </a>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                
                    <div className="collapse navbar-collapse" id="navbarResponsive">
                        <ul className="navbar-nav ml-auto">
                            {menu.map((item, index) => 
                                <li key={index} className="nav-item">
                                    <Link className="nav-link" to={item.to}>{item.menuName}</Link>
                                </li>)}
                            <li className="nav-item dropdown mx-5">
                                <a className="nav-link dropdown-toggle" href="#" id="dropdown09" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><span className="flag-icon flag-icon-kr"> </span> 한국어</a>
                                <div className="dropdown-menu" aria-labelledby="dropdown09">
                                    <a className="dropdown-item" href="#fr"><span className="flag-icon flag-icon-us"> </span>  English</a>
                                    <a className="dropdown-item" href="#it"><span className="flag-icon flag-icon-es"> </span>  Spanish</a>
                                    <a className="dropdown-item" href="#ru"><span className="flag-icon flag-icon-cn"> </span>  Chinese</a>
                                    <a className="dropdown-item" href="#ru"><span className="flag-icon flag-icon-jp"> </span>  Japanese</a>
                                </div>
                            </li>
                            <li className="nav-item mx-5">
                                <a className="nav-link" href="#">현재 접속자 : {allUsers.length} 명</a>
                            </li>
                            <li className="nav-item mx-5">
                                <a className="nav-link" href="#">{ user && user.nickname ? <i className="far fa-user">{" "+user.nickname}</i> : ''}</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#">{ user && user.id ? 'Exit' : ''}</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </div>
    )
}

export default Navbar
