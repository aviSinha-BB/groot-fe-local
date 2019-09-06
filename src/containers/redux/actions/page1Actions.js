export const SET_PAGE1_DATA = "set_page1_data";

export const setPage1Data = data => dispatch => {
  dispatch({
    type: SET_PAGE1_DATA,
    page: data
  });
};
