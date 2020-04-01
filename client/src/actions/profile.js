import axios from "axios";
import { setAlert } from "./alert";
import {
  GET_PROFILE,
  PROFILE_ERROR,
  UPDATE_PROFILE,
  CLEAR_PROFILE,
  ACCOUNT_DELETED
} from "./types";

const handleError = (e, dispatch) => {
  const errors = e.response.data.errors;
  // show alerts for errors from res.status(404).json(errors: [{msg: "Profile does not exist"}])
  if (errors) {
    errors.forEach(error => dispatch(setAlert(error.msg, "danger")));
  }
  // store error from res.status(500).send("Server Error") in profile state
  dispatch({
    type: PROFILE_ERROR,
    payload: { msg: e.response.statusText, status: e.response.status }
  });
};

// Get current user's profile
export const getCurrentProfile = () => async dispatch => {
  try {
    const res = await axios.get("api/profile/");
    dispatch({ type: GET_PROFILE, payload: res.data });
  } catch (e) {
    handleError(e, dispatch);
  }
};

// Create or update profile
// history: has a method called push to redirect to a client side route
// edit: edit instead of create profile
export const createProfile = (
  formData,
  history,
  edit = false
) => async dispatch => {
  try {
    const res = await axios.post("api/profile", formData);
    dispatch({ type: GET_PROFILE, payload: res.data });
    dispatch(setAlert(edit ? "Profile Updated" : "Profile Created", "success"));
    if (!edit) {
      // push is the equivalent of Redirect within components
      history.push("/dashboard");
    }
  } catch (e) {
    handleError(e, dispatch);
  }
};

// Add experience
export const addExperience = (formData, history) => async dispatch => {
  try {
    const res = await axios.post("api/profile/experience", formData);
    dispatch({ type: UPDATE_PROFILE, payload: res.data });
    dispatch(setAlert("Experience Added", "success"));
    // push is the equivalent of Redirect within components
    history.push("/dashboard");
  } catch (e) {
    handleError(e, dispatch);
  }
};

// Add education
export const addEducation = (formData, history) => async dispatch => {
  try {
    const res = await axios.post("api/profile/education", formData);
    dispatch({ type: UPDATE_PROFILE, payload: res.data });
    dispatch(setAlert("Education Added", "success"));
    // push is the equivalent of Redirect within components
    history.push("/dashboard");
  } catch (e) {
    handleError(e, dispatch);
  }
};

// Delete experience
export const deleteExperience = id => async dispatch => {
  try {
    const res = await axios.delete(`/api/profile/experience/${id}`);
    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data
    });
    dispatch(setAlert("Experience Removed", "success"));
  } catch (e) {
    handleError(e, dispatch);
  }
};

// Delete education
export const deleteEducation = id => async dispatch => {
  try {
    const res = await axios.delete(`/api/profile/education/${id}`);
    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data
    });
    dispatch(setAlert("Education Removed", "success"));
  } catch (e) {
    handleError(e, dispatch);
  }
};

// Delete account & profile
export const deleteAccount = () => async dispatch => {
  if (window.confirm("Are you sure? This cannot be undone!")) {
    try {
      await axios.delete(`/api/profile`);
      dispatch({ type: CLEAR_PROFILE });
      dispatch({ type: ACCOUNT_DELETED });
      dispatch(setAlert("Your account has been permanently deleted"));
    } catch (e) {
      handleError(e, dispatch);
    }
  }
};
