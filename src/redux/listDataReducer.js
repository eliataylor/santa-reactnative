import API from '../utils/API';

// const API_DATA_ABORTED = 'lists:API_DATA_ABORTED';
const API_DATA_SUCCESS = 'lists:API_DATA_SUCCESS';
const API_DATA_FAILURE = 'lists:API_DATA_FAILURE';
const API_DATA_STARTED = 'lists:API_DATA_STARTED';

export const listDataSuccess = apiData => ({
  type: API_DATA_SUCCESS,
  payload: {...apiData}
});

const listDataStarted = (apiurl) => ({
  type: API_DATA_STARTED,
  apiurl:apiurl
});

const listDataFailure = error => ({
  type: API_DATA_FAILURE,
  error: error
});

export const listData = (url) => {
  return (dispatch, getState) => {
    var state = getState();
    if (state.lists.loading === true) return false;

    dispatch(listDataStarted(url));

    API.Get(url).then(res => {
      dispatch(listDataSuccess(res.data));
    }).catch(err => {
      var msg = API.getErrorMsg(err);
      dispatch(listDataFailure(msg));
    });
  };
};

const initialState = {
  loading: false,
  apiurl:'',
  wishes: [],
  offers: [],
  error: null
};

export default function listDataReducer(state = initialState, action) {
  switch (action.type) {
    case API_DATA_STARTED:
      return {
        ...state,
        loading: true,
        apiurl:action.apiurl
      };
    case API_DATA_SUCCESS:
      var newState = {...state};
      newState.loading = false;
      newState.error = null;
      if (action.payload.apiurl.indexOf('/api/offers') === 0) {
        newState.offers = action.payload;
      } else {
        newState.wishes = action.payload;
      }
      return newState;
    case API_DATA_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.error
      };
    default:
      return state;
  }
}
