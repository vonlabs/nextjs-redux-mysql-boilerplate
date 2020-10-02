export const masterInitialState = {
    ADD: 'ADD',
  }
  
export const addCount = () => (dispatch) => {
    return dispatch({ type: masterInitialState.ADD })
}