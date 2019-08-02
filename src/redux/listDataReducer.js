import API from '../utils/API';

// const API_DATA_ABORTED = 'lists:API_DATA_ABORTED';
const API_DATA_SUCCESS = 'lists:API_DATA_SUCCESS';
const API_DATA_FAILURE = 'lists:API_DATA_FAILURE';
const API_DATA_STARTED = 'lists:API_DATA_STARTED';

const listDataSuccess = apiData => ({
  type: API_DATA_SUCCESS,
  payload: {...apiData}
});

const listDataStarted = () => ({
  type: API_DATA_STARTED
});

const listDataFailure = errors => ({
  type: API_DATA_FAILURE,
  errors: errors
});

export const listData = (url) => {
  return (dispatch, getState) => {
    var state = getState();
    if (state.lists.loading === true) return false;

    dispatch(listDataStarted());

    API.Get(url).then(res => {
      dispatch(listDataSuccess(res.data));
    }).catch(err => {
      dispatch(listDataFailure(err));
    });
  };
};

const initialState = {
  loading: false,
  apiData: [],
  errors: null
};

export default function listDataReducer(state = initialState, action) {
  switch (action.type) {
    case API_DATA_STARTED:
      return {
        ...state,
        loading: true
      };
    case API_DATA_SUCCESS:
      return {
        ...state,
        loading: false,
        errors: null,
        apiData: action.payload
      };
    case API_DATA_FAILURE:
      return {
        ...state,
        loading: false,
        errors: action.errors
      };
    default:
      return state;
  }
}
