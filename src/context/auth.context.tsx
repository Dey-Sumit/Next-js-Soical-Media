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
import { parseCookies } from "nookies";
import useSWR from "swr";
// import { User } from '../types'

interface State {
  //   authenticated: boolean;
  user: FUser | undefined;
  loading?: boolean;
}

interface Action {
  type: string;
  payload?: any;
}

// create two context; one for the state and one for the dispatch
const StateContext = createContext<State>({
  user: null,
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
function getCookie(cname: string) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, {
    // user: null,
    user: null,
    // authenticated: false,
    loading: true,
  });
  //   const dispatch = (type: string, payload?: any) =>
  //     defaultDispatch({ type, payload });

  useEffect(() => {
    async function loadUser() {
      try {
        // const { data } = useSWR("/api/auth/me");
        // console.log({ data });
        const user = parseCookies()?.user
          ? JSON.parse(parseCookies().user)
          : null;
        dispatch({
          type: AUTH_SUCCESS,
          payload: user,
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
