// import {useContext} from 'react'
// import jwt_decode from "jwt-decode"
// import AuthContext from '../context/AuthContext'
// import { Link } from 'react-router-dom'

// function Navbar() {

//   const {user, logoutUser} = useContext(AuthContext)
//   const token = localStorage.getItem("authTokens")

//   if (token){
//     const decoded = jwt_decode(token) 
//     var user_id = decoded.user_id
//   }

//   return (
//     <div>
//         <nav class="navbar navbar-expand-lg navbar-dark fixed-top bg-dark">
//         <div class="container-fluid">
//           {/* <a class="navbar-brand" href="#"> */}
//           <a class="navbar-brand" href="#">
//             {/* <img style={{width:"120px", padding:"6px"}} src="https://i.imgur.com/juL1aAc.png" alt="" /> */}
//             <img style={{width:"120px", padding:"6px"}} src="..\src\views\style\logo.png" alt="ChatWeb" />

//           </a>
//           <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
//             <span class="navbar-toggler-icon"></span>
//           </button>
//           <div class="collapse navbar-collapse" id="navbarNav">
//             <ul class="navbar-nav ">
//               <li class="nav-item">
//                 {/* <a class="nav-link active" aria-current="page" href="#"> <i className='fas fa-home'></i> Home</a> */}
//                 <Link class="nav-link"  to="/"> <i className='fas fa-home'></i> Home</Link>
//               </li>
//               {token === null && 
//               <>
//                 <li class="nav-item">
//                   <Link class="nav-link" to="/login"><i className='fas fa-sign-in-alt'></i> Login</Link>
//                 </li>
//                 <li class="nav-item">
//                   <Link class="nav-link" to="/register"><i className='fas fa-user-plus'></i> Register</Link>
//                 </li>
//               </>
//               }

//             {token !== null && 
//               <>
//                 {/* <li class="nav-item">
//                   <Link class="nav-link" to="/dashboard"> <i className='fas fa-th'></i> Dashboard</Link>
//                 </li>
//                 <li class="nav-item">
//                   <Link class="nav-link" to="/todo"> <i className='fas fa-pen'></i> Todo</Link>
//                 </li> */}
//                 <li class="nav-item">
//                   <Link class="nav-link" to="/inbox"> <i className='fas fa-envelope'></i> Inbox</Link>
//                 </li>
//                 {/* Added for qr scanner */}
//                 {/* <li className="nav-item">
//                     <Link className="nav-link" to="/qr-scanner">
//                       <i className="fas fa-qrcode"></i> QR Scanner
//                     </Link>
//                   </li> */}
                  
//                 <li class="nav-item">
//                   <a class="nav-link" onClick={logoutUser} style={{cursor:"pointer"}}> <i className='fas fa-sign-out-alt'></i>Logout</a>
//                 </li>
//               </>
//               }   
              
//             </ul>
//           </div>
//         </div>
//       </nav>
//     </div>
//   )
// }

// export default Navbar



import React, { useContext, useEffect, useState } from 'react';
import jwt_decode from 'jwt-decode';
import AuthContext from '../context/AuthContext';
import useAxios from '../utils/useAxios';
import { Link } from 'react-router-dom';



function Navbar() {
  const { user, logoutUser } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const axios = useAxios();
  const token = localStorage.getItem('authTokens');

  const [showModal, setShowModal] = useState(false); // State for modal visibility
  const handleShowModal = () => setShowModal(true); // Function to show the modal
  const handleCloseModal = () => setShowModal(false); // Function to close the modal
  const baseURL = 'http://127.0.0.1:8000/api/profile/'

  useEffect(() => {
    const fetchProfile = async () => {
      if (token) {
        const decoded = jwt_decode(token);
        const user_id = decoded.user_id;
        try {
          const response = await axios.get(`${baseURL}${user_id}/`);
          setProfile(response.data);
        } catch (error) {
          console.error('Error fetching profile:', error);
        }
      }
    };
    fetchProfile();
  }, [token, axios]);

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark fixed-top bg-dark">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            <img style={{ width: '120px', padding: '6px' }} src="..\src\views\style\logo.png" alt="ChatWeb" />
          </a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ">
              <li className="nav-item">
                <Link className="nav-link" to="/"> <i className='fas fa-home'></i> Home</Link>
              </li>
              {!token &&
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/login"><i className='fas fa-sign-in-alt'></i> Login</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/register"><i className='fas fa-user-plus'></i> Register</Link>
                  </li>
                </>
              }
              {token &&
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/inbox"> <i className='fas fa-envelope'></i> Inbox</Link>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" onClick={logoutUser} style={{ cursor: 'pointer' }}> <i className='fas fa-sign-out-alt'></i>Logout</a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" onClick={handleShowModal} style={{ cursor: "pointer" }}>
                      <i className="fas fa-user-circle"></i> My QR
                    </a>
                  </li>
                </>
              }
            </ul>
          </div>
        </div>
      </nav>
      {showModal && (
        <div className="modal show" tabIndex="-1" role="dialog" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Your QR Code</h5>
                <button type="button" className="close" aria-label="Close" onClick={handleCloseModal}>
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body d-flex justify-content-center align-items-center">
                {/* <QRCode value={qrCodeUrl} /> */}
                {profile.qr_code ? (
                <img src={profile.qr_code} alt="QR Code" />
                ) : (
                <p>No QR Code available.</p>
                 )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Navbar;