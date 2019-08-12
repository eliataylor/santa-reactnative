import API from '../utils/API';
import {listData} from "./listDataReducer";
import {checkToken} from './authActions';
const ITEM_DATA_SUCCESS = 'entity:ITEM_DATA_SUCCESS';
const ITEM_DATA_FAILURE = 'entity:ITEM_DATA_FAILURE';
const ITEM_DATA_STARTED = 'entity:ITEM_DATA_STARTED';

const entityDataSuccess = apiData => ({
  type: ITEM_DATA_SUCCESS,
  payload: {...apiData}
});

const entityDataStarted = () => ({
  type: ITEM_DATA_STARTED
});

const entityDataFailure = errors => ({
  type: ITEM_DATA_FAILURE,
  errors: {...errors}
});


export const createWish = (item) => {
  return (dispatch, getState) => {

    var oldState = getState();
    if (oldState.entity.loading === true) return false;

    dispatch(entityDataStarted());

    API.Post('/api/wishes/create', item).then((res) => {
      if (!res.data) {
        var msg = API.getErrorMsg(res);
        dispatch(entityDataFailure(msg));
      } else {
        console.log("CREATED!!!!", res.data);
        dispatch(entityDataSuccess(res.data));
      }
    }).catch((err) => {
      var msg = API.getErrorMsg(err);
      console.log("CREATE ERROR", msg, err);
      dispatch(entityDataFailure(err));
    });
  };
};

export const deleteWish = (id) => {
  return (dispatch, getState) => {

    var oldState = getState();
    if (oldState.entity.loading === true) return false;

    dispatch(entityDataStarted());

    API.Delete('/api/wishes/'+id+'/delete').then((res) => {
      if (!res.data) {
        var msg = API.getErrorMsg(res);
        dispatch(entityDataFailure(msg));
      } else {
        dispatch(listData(oldState.lists.apiurl)); // refresh lists
        dispatch(entityDataSuccess(res.data));
      }
    }).catch((err) => {
      var msg = API.getErrorMsg(err);
      console.log("CREATE ERROR", msg, err);
      dispatch(entityDataFailure(err));
    });
  };
};

export const createOffer = (item) => {
  return (dispatch, getState) => {

    var oldState = getState();
    if (oldState.entity.loading === true) return false;

    dispatch(entityDataStarted());

    var url = '/api/offers/create';
    API.Post(url, {'wish':item._id}).then((res) => {
      if (!res.data) {
        var msg = API.getErrorMsg(res);
        dispatch(entityDataFailure(msg));
      } else {
        dispatch(listData(oldState.lists.apiurl)); // refresh lists
        dispatch(checkToken()); // refresh offers
        dispatch(entityDataSuccess(res.data));
      }
    }).catch((err) => {
      dispatch(entityDataFailure(err));
    });
  };
};


export const updateOffer = (item, state) => {
  return (dispatch, getState) => {

    var oldState = getState();
    if (oldState.entity.loading === true) return false;

    dispatch(entityDataStarted());

    var url = '/api/offers/' + item._id + '/update';
    API.Put(url, {state:state}).then((res) => {
      if (!res.data) {
        var msg = API.getErrorMsg(res);
        dispatch(entityDataFailure(msg));
      } else {
        dispatch(listData(oldState.lists.apiurl)); // refresh lists
        dispatch(checkToken()); // refresh offers
        dispatch(entityDataSuccess(res.data));
      }
    }).catch((err) => {
      dispatch(entityDataFailure(err));
    });
  };
};

const initialState = {
  loading: false,
  apiData: false,
  errors: null,
  lastsucces:0
};

export default function entityDataReducer(state = initialState, action) {
  switch (action.type) {
    case ITEM_DATA_STARTED:
      return {
        ...state,
        loading: true,
        apiData:false,
        errors:null
      };
    case ITEM_DATA_SUCCESS:
      var newState = {...state};
      newState.loading = false;
      newState.errors = null;
      newState.apiData = action.payload;
      newState.lastsucces = new Date().getTime(); // helps to force componentDidUpdate correctly
      return newState;
    case ITEM_DATA_FAILURE:
      return {
        ...state,
        loading: false,
        apiData:false,
        errors: action.errors
      };
    default:
      return state;
  }
}
