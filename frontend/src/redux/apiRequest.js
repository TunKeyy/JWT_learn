import axios  from 'axios';
import { loginFail, loginStart, loginSuccess, logoutFail, logoutStart, logoutSuccess, registerFail, registerStart, registerSuccess } from './authSlice';
import { deleteUserFail, deleteUserStart, deleteUserSuccess, getUsersFail, getUsersStart, getUsersSuccess } from './userSlice';
export const loginUser = async(user, dispatch, navigate) => {
    dispatch(loginStart());
    try {
        const res = await axios.post("v1/auth/login", user);
        dispatch(loginSuccess(res.data));
        navigate('/');
    } catch (error) {
        dispatch(loginFail());
    }
} 
export const registerUser = async(user, dispatch, navigate) => {
    dispatch(registerStart());
    try {
        const res = await axios.post("v1/auth/register", user);
        dispatch(registerSuccess());
        navigate('/login');
    } catch (error) {
        dispatch(registerFail());
    }
} 

//xử lý getAllUser API qua redux
export const getAllUser = async(accessToken, dispatch, axiosJWT) => {
    dispatch(getUsersStart());
    try {
        const res = await axiosJWT.get("v1/user", {
            headers:{
                token: `Bearer ${accessToken}`,
            }
        });
        dispatch(getUsersSuccess(res.data));

    } catch (error) {
        dispatch(getUsersFail());
    }
}
export const deleteUser = async(accessToken, dispatch, id, axiosJWT) => {
    dispatch(deleteUserStart());
    try {
        const res = await axiosJWT.delete("v1/user/" + id, {
            headers:{
                token: `Bearer ${accessToken}`,
            }
        });
        dispatch(deleteUserSuccess());
    } catch (error) {
        dispatch(deleteUserFail());
    }

}
export const logOut = async(dispatch, id, navigate, accessToken, axiosJWT) => {
    dispatch(logoutStart());
    try {
        await axiosJWT.post("v1/auth/logout", id, {
            headers:{
                token: `Bearer ${accessToken}`,
            }
        })
        dispatch(logoutSuccess());
        navigate("/login");
    } catch (error) {
        dispatch(logoutFail());
    }

}