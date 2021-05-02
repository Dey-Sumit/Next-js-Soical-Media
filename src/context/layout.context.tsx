import {
  createContext,
  MouseEventHandler,
  useContext,
  useReducer,
} from "react";
import {
  SHOW_AUTH_MODAL,
  HIDE_CONFIRMATION_MODAL,
  TOGGLE_NAVBAR,
  SHOW_CONFIRMATION_MODAL,
  HIDE_AUTH_MODAL,
} from "./types";
// import { User } from '../types'

interface State {
  showAuthModal: boolean;
  showNavbar: boolean;
  showConfirmationModal: boolean;

  modalData: {
    subTitle: string;
    handleConfirmation: MouseEventHandler<any>;
    buttonText: string;
  };
  // showDeleteModal: boolean;
}

interface Action {
  type: string;
  payload: any;
}

// create two context; one for the state and one for the dispatchs
const StateContext = createContext<State>({} as State);

const DispatchContext = createContext(null);

const reducer = (state: State, { type, payload }: Action) => {
  switch (type) {
    case SHOW_AUTH_MODAL:
      return {
        ...state,
        showAuthModal: true,
      };

    case HIDE_CONFIRMATION_MODAL:
      return {
        ...state,
        showConfirmationModal: false,
      };
    case HIDE_AUTH_MODAL:
      return {
        ...state,
        showAuthModal: false,
      };

    case SHOW_CONFIRMATION_MODAL:
      return {
        ...state,
        showConfirmationModal: true,
        modalData: payload,
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
    showAuthModal: false,
    showNavbar: false,
    showConfirmationModal: false,
    modalData: null,
  });

  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={state}>{children}</StateContext.Provider>
    </DispatchContext.Provider>
  );
};

export const useLayoutState = () => useContext(StateContext);
export const useLayoutDispatch = () => useContext(DispatchContext);
