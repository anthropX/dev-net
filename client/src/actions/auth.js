import axios from "axios";
import { setAlert } from "./alert";
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR
} from "./types";
import setAuthToken from "../utils/setAuthToken";

// Load User
/*  
    This is to determine if login/register page, 
    as opposed to a protected webpage is to be shown 
    to the user when the main App component is loaded 
 */
export const loadUser = () => async dispatch => {
  // Shorthand for localStorage.getItem("token");
  // Shouldn't you not have the if here?
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }

  try {
    const res = await axios.get("api/auth");

    dispatch({ type: USER_LOADED, payload: res.data });
  } catch (e) {
    dispatch({
      type: AUTH_ERROR
    });
  }
};
// Register User
export const register = ({ name, email, password }) => async dispatch => {
  try {
    const res = await axios.post("api/users", { name, email, password });
    dispatch({ type: REGISTER_SUCCESS, payload: res.data });
  } catch (e) {
    const errors = e.response.data.errors;
    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, "danger")));
    }
    dispatch({
      type: REGISTER_FAIL
    });
  }
};