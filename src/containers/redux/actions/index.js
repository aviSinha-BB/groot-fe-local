export const SET_PAGE = "set_page";
export const setPage = page => async dispatch => {
  dispatch({
    type: SET_PAGE,
    page: page
  });
};
