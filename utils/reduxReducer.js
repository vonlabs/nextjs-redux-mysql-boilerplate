import { masterActionTypes } from './reduxActions'

const masterInitialState = {
  count: 0,
}

export default function reducer(state = masterInitialState, action) {
  switch (action.type) {
    case masterInitialState.ADD:
      return Object.assign({}, state, {
        count: state.count + 1,
      })
    default:
      return state
  }
}