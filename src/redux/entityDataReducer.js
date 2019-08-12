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

    var url = '/api/wishes/create';
    API.Post(url, {'wish':item._id}).then((res) => {
      if (!res.data) {
        console.log('invalid api response', res);
        dispatch(entityDataFailure('invalid api response'));
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

export const createOffer = (item) => {
  return (dispatch, getState) => {

    var oldState = getState();
    if (oldState.entity.loading === true) return false;

    dispatch(entityDataStarted());

    var url = '/api/offers/create';
    API.Post(url, {'wish':item._id}).then((res) => {
      if (!res.data) {
        console.log('invalid api response', res);
        dispatch(entityDataFailure('invalid api response'));
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
        console.log('invalid api response', res);
        dispatch(entityDataFailure('invalid api response'));
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
  errors: null
};

export default function entityDataReducer(state = initialState, action) {
  switch (action.type) {
    case ITEM_DATA_STARTED:
      return {
        ...state,
        loading: true
      };
    case ITEM_DATA_SUCCESS:
      var newState = {...state};
      newState.loading = false;
      newState.errors = null;
      newState.apiData = action.payload;
      return newState;
    case ITEM_DATA_FAILURE:
      return {
        ...state,
        loading: false,
        errors: action.errors
      };
    default:
      return state;
  }
}
