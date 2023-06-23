import { useEffect } from "react";
import "./home.css";
import { getAllUser, deleteUser } from "../../redux/apiRequest";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { loginSuccess } from "../../redux/authSlice";
import { createAxios } from "../../createInstance";
const HomePage = () => {
  const user = useSelector((state) => state.auth.login?.currentUser);
  const userList = useSelector((state) => state.user.users?.allUsers);
  const message = useSelector((state) => state.user?.message);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let axiosJWT = createAxios(user, dispatch, loginSuccess);
  const handleDelete = (id) => {
    deleteUser(user?.accessToken, dispatch, id, axiosJWT);
  }

  useEffect(() => {
    if(!user) {
      navigate('/login');
    }
    if(user?.accessToken){
      getAllUser(user?.accessToken, dispatch, axiosJWT);
    }
  }, []);
  console.log(userList);
  return (
    <main className="home-container">
      <div className="home-title">User List</div>
      <div className="home-role">{`Your role: ${user?.admin ? `Admin` : `User`}`}</div>
      <div className="home-userlist">
        {userList?.map((user) => {
          return (
            <div className="user-container">
              <div className="home-user">{user.username}</div>
              <div className="delete-user" onClick={() => handleDelete(user._id)}> 
              {" "}
              Delete
              {" "}
              </div>
            </div>
          );
        })}
      </div>
      {
        message
      }
    </main>
  );
};

export default HomePage;
