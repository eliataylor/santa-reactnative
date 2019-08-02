import API from '../utils/API';

//const ITEM_DATA_ABORTED = 'entity:ITEM_DATA_ABORTED';
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

export const entityData = (url) => {
  return (dispatch, getState) => {

    if (getState().entity.loading === true) return false;

    dispatch(entityDataStarted());

    API.Get(url).then((res) => {
      if (!res.data) {
        console.log('invalid api response', res);
        dispatch(entityDataFailure('invalid api response'));
      } else {
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
      return {
        ...state,
        loading: false,
        errors: null,
        apiData: action.payload
      };
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
