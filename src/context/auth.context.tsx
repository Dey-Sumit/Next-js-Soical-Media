import axios from "axios";
import { createContext, useContext, useEffect, useReducer } from "react";
import { User } from "../types.frontend";
import { AUTH_FAIL, AUTH_SUCCESS, LOG_OUT } from "./types";
// import { User } from '../types'

interface State {
  //   authenticated: boolean;
  user: User | undefined;
  loading?: boolean;
}

interface Action {
  type: string;
  payload: any;
}

// create two context; one for the state and one for the dispatchs
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
    case AUTH_FAIL:
    case LOG_OUT:
      return {
        ...state,
        user: null,
      };
    // case "STOP_LOADING":
    //   return {
    //     ...state,
    //     loading: false,
    //   };
    default:
      throw new Error(`Unknown action type"${type}`);
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, {
    user: null,
    // authenticated: false,
    // loading: true,
  });
  //   const dispatch = (type: string, payload?: any) =>
  //     defaultDispatch({ type, payload });

  useEffect(() => {
    async function loadUser() {
      try {
        // use swr
        const res = await axios.get("/api/auth/me");
        // dispatch("LOGIN", res.data);
        // console.log(res.data);

        dispatch({
          type: AUTH_SUCCESS,
          payload: res.data.user,
        });
      } catch (error) {
        console.log(error);
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
