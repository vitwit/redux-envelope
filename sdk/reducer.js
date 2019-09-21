
import * as reactRedux from "react-redux";

const initialState ={

  addPetRes:{},
  updatePetRes:{},
  findPetsByStatusRes:{},
  findPetsByTagsRes:{},
  getPetByIdRes:{},
  updatePetWithFormRes:{},
  deletePetRes:{},
  uploadFileRes:{},
  getInventoryRes:{},
  placeOrderRes:{},
  getOrderByIdRes:{},
  deleteOrderRes:{},
  createUserRes:{},
  createUsersWithArrayInputRes:{},
  createUsersWithListInputRes:{},
  loginUserRes:{},
  logoutUserRes:{},
  getUserByNameRes:{},
  updateUserRes:{},
  deleteUserRes:{},
}

export function myAppReducer(state = initialState, action) {
  return {
    ...state,
    [action.type]: {
      ...state[action.type],
      ...action.payload
    }
  };
}

// helper function to use this syntax connect(['getUserRes'])(App)

export const connect = function(a, b) {
  const mapState = ({ myAppReducer, ...otherState }) => {
    if (isArray(a)) {
      let obj = {};
      a.forEach(key => {
        obj[key] = myAppReducer[key];
      });
      return obj;
    } else {
      return a({ myAppReducer, otherState });
    }
  };
  return reactRedux.connect(mapState, b);
};