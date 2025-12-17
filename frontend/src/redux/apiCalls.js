import { userRequest } from "../requestMethods";
import { loginStart, loginSuccess, loginFailure } from "./userRedux";
import { setCurrentUser } from "./cartRedux";

export const login = async (dispatch, user) => {
  dispatch(loginStart());
  try {
    const res = await userRequest.post("/auth/login/", user);
    dispatch(loginSuccess(res.data));
    // Set current user in cart store for user-specific carts
    dispatch(setCurrentUser(res.data));
  } catch (error) {
    dispatch(loginFailure());
    throw error; // Re-throw to let the component handle the error
  }
};
