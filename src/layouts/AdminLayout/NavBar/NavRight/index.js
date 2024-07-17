import React, { useState,useEffect } from 'react';
import { Card, ListGroup, Dropdown } from 'react-bootstrap';
import ChatList from './ChatList';
import { FaUser } from 'react-icons/fa';

const NavRight = () => {
  const [listOpen, setListOpen] = useState(false);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const userData = sessionStorage.getItem("userdata");
    if (userData) {
      const parsedData = JSON.parse(userData);
      if (parsedData && parsedData.username) {
        setUsername(parsedData.username);
      }
    }
  }, []);
  return (
    <React.Fragment>
      <ListGroup as="ul" bsPrefix=" " className="navbar-nav ml-auto" id="navbar-right">
        <ListGroup.Item as="li" bsPrefix=" ">
          <div className="username-container">
           
            <FaUser icon={FaUser} className="star-icon" />
            <span>{username}</span>
          </div>
        </ListGroup.Item>
      </ListGroup>
      <ChatList listOpen={listOpen} closed={() => setListOpen(false)} />
    </React.Fragment>
  );
};

export default NavRight;


// import React, { useState } from 'react';
// import { ListGroup, Dropdown } from 'react-bootstrap';
// import { Link } from 'react-router-dom';

// import ChatList from './ChatList';

// const NavRight = () => {
//   const [listOpen, setListOpen] = useState(false);

//   return (
//     <React.Fragment>
//       <ListGroup as="ul" bsPrefix=" " className="navbar-nav ml-auto" id="navbar-right">
//         <ListGroup.Item as="li" bsPrefix=" ">
//           <Dropdown align="start" className="drp-user">
//             <Dropdown.Toggle as={Link} variant="link" to="#" id="dropdown-basic">
//               <i className="feather icon-settings" />
//             </Dropdown.Toggle>
//             <Dropdown.Menu align="start" className="profile-notification">
//               <div className="pro-head">
//                 <span>John Doe</span>
//                 <Link to="#" className="dud-logout" title="Logout">
//                   <i className="feather icon-log-out" />
//                 </Link>
//               </div>
//               <ListGroup as="ul" bsPrefix=" " variant="flush" className="pro-body">
//                 <ListGroup.Item as="li" bsPrefix=" ">
//                   <Link to="#" className="dropdown-item">
//                     <i className="feather icon-settings" /> Settings
//                   </Link>
//                 </ListGroup.Item>
//                 <ListGroup.Item as="li" bsPrefix=" ">
//                   <Link to="#" className="dropdown-item">
//                     <i className="feather icon-user" /> Profile
//                   </Link>
//                 </ListGroup.Item>
//                 <ListGroup.Item as="li" bsPrefix=" ">
//                   <Link to="#" className="dropdown-item">
//                     <i className="feather icon-mail" /> My Messages
//                   </Link>
//                 </ListGroup.Item>
//                 <ListGroup.Item as="li" bsPrefix=" ">
//                   <Link to="#" className="dropdown-item">
//                     <i className="feather icon-lock" /> Lock Screen
//                   </Link>
//                 </ListGroup.Item>
//                 <ListGroup.Item as="li" bsPrefix=" ">
//                   <Link to="/login" className="dropdown-item" >
//                     <i className="feather icon-log-out" /> Logout
//                   </Link>
//                 </ListGroup.Item>
//               </ListGroup>
//             </Dropdown.Menu>
//           </Dropdown>
//         </ListGroup.Item>
//       </ListGroup>
//       <ChatList listOpen={listOpen} closed={() => setListOpen(false)} />
//     </React.Fragment>
//   );
// };

// export default NavRight;
