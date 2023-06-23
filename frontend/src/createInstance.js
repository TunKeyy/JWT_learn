import axios from "axios";
import jwt_decode from "jwt-decode";
import { loginSuccess } from "./redux/authSlice";
const refreshToken = async () => {
    try {
      const res = await axios.post("/v1/auth/refresh", {
        withCredentials: true,
      })
      console.log(res.data.accessToken);
      return res.data;
    } catch (error) {
      console.log(error);
    }
  }

export const createAxios = (user, dispatch, stateSuccess) => {
    const newInstance = axios.create();
    newInstance.interceptors.request.use(
        async(config) => {
          let date = new Date;
          console.log('date:',date.getTime());
          const decodedToken = jwt_decode(user?.accessToken);
          console.log('decodetoken: ',decodedToken.exp);
          if (decodedToken.exp < (date.getTime() / 1000)){
            const data = await refreshToken();
            const refreshUser = {
              ...user,
              accessToken: data.accessToken,
            };
            console.log(refreshUser);
            dispatch(stateSuccess(refreshUser));
            config.headers["token"] = "Bearer " + data.accessToken;
          }
          return config;
        },
        (err) => {
          return Promise.reject(err);
        }
      );
      return newInstance;
}