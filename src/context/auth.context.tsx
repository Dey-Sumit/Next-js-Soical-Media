import axios from "axios";
import { createContext, useContext, useEffect, useReducer } from "react";
import { FUser } from "lib/types";
import {
  AUTH_FAIL,
  AUTH_SUCCESS,
  LOG_OUT,
  STOP_LOADING,
  SET_USER_DUMMY,
} from "./types";

import cookie from "js-cookie";
interface State {
  //   authenticated: boolean;
  user: FUser | undefined;
  loading?: boolean;
}

interface Action {
  type: string;
  payload?: any;
}
// TODO learn what the fuck is going on here
// create two context; one for the state and one for the dispatch
const StateContext = createContext<State>({
  user: null, // what is this ; if this is initial state the wtf is inside useReducer
});

const DispatchContext = createContext(null);

const reducer = (state: State, { type, payload }: Action) => {
  switch (type) {
    case AUTH_SUCCESS:
      return {
        ...state,
        user: payload,
      };
    case SET_USER_DUMMY:
      return {
        ...state,
        user: payload,
      };
    case AUTH_FAIL:
    case LOG_OUT:
      return {
        ...state,
        user: null,
      };
    case STOP_LOADING:
      return {
        ...state,
        loading: false,
      };
    default:
      throw new Error(`Unknown action type"${type}`);
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, {
    user: null,
    loading: true,
    // authenticated: false,
  });

  useEffect(() => {
    async function loadUser() {
      try {
        // set initially from cookie
        dispatch({
          type: SET_USER_DUMMY,
          payload: cookie.get("user") ? JSON.parse(cookie.get("user")) : null,
        });
        const res = await axios.get("/api/auth/me");

        dispatch({
          type: AUTH_SUCCESS,
          payload: res.data.user,
        });
      } catch (error) {
        console.log(error.message);
        dispatch({
          type: AUTH_FAIL,
        });
      } finally {
        dispatch({
          type: "STOP_LOADING",
        });
      }
    }
    loadUser();
  }, []);

  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={state}>{children}</StateContext.Provider>
    </DispatchContext.Provider>
  );
};

export const useAuthState = () => useContext(StateContext);
export const useAuthDispatch = () => useContext(DispatchContext);
