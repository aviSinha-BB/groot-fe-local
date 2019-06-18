export const SET_TEMP_COMPONENT  = "set_temp_component";

export const setPageData = (data) => dispatch => {
    dispatch({
      type: SET_TEMP_COMPONENT,
      val: data
    });
};