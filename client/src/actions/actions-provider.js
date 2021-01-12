export const getMarket = instance => async dispatch => {
  const markets = await instance.methods.getDeployedMarkets().call();
  const descriptions = await Promise.all(
    markets
      .map((address, index) => {
        return instance.methods.deployedDescription(address).call();
      }))
  dispatch({ type: "GET_MARKETS", payload: {markets, descriptions} });
}
