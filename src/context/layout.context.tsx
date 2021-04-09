import { createContext, useContext, useReducer } from "react";
import { SHOW_MODAL, HIDE_MODAL, TOGGLE_NAVBAR } from "./types";
// import { User } from '../types'

interface State {
  showModal: boolean;
  showNavbar: boolean;
}

interface Action {
  type: string;
  payload: any;
}

// create two context; one for the state and one for the dispatchs
const StateContext = createContext<State>({
  showModal: false,
  showNavbar: false,
});

const DispatchContext = createContext(null);

const reducer = (state: State, { type }: Action) => {
  switch (type) {
    case SHOW_MODAL:
      return {
        ...state,
        showModal: true,
      };
    case HIDE_MODAL:
      return {
        ...state,
        showModal: false,
      };
    case TOGGLE_NAVBAR:
      return {
        ...state,
        showNavbar: !state.showNavbar,
      };

    default:
      throw new Error(`Unknown action type"${type}`);
  }
};

export const LayoutProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, {
    showModal: false,
    showNavbar: false,
  });

  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={state}>{children}</StateContext.Provider>
    </DispatchContext.Provider>
  );
};

export const useLayoutState = () => useContext(StateContext);
export const useLayoutDispatch = () => useContext(DispatchContext);
