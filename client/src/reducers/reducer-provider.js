
export const providerReducer = (state = {}, action) => {
  switch (action.type) {
    case "GET_ACCOUNTS":
      return { ...state, accounts: action.payload }
    case "GET_WEB3":
      return { ...state, web3: action.payload}
    case "GET_MARKETS":
      return { ...state, markets: action.payload}
    case "CREATE_MARKET":
      return { ...state, markets: action.payload}
    default:
      return state
  }
}