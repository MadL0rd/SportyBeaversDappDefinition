// log
import store from "../store";

const fetchDataRequest = () => {
  return {
    type: "CHECK_DATA_REQUEST",
  };
};

const fetchDataSuccess = (payload) => {
  return {
    type: "CHECK_DATA_SUCCESS",
    payload: payload,
  };
};

const fetchDataFailed = (payload) => {
  return {
    type: "CHECK_DATA_FAILED",
    payload: payload,
  };
};

export const fetchData = (blockchainAccount) => {
  return async (dispatch) => {
    dispatch(fetchDataRequest());
    try {
      let totalSupply = await store
        .getState()
        .blockchain.smartContract.methods.totalSupply()
        .call();
      let maxSupply = await store
        .getState()
        .blockchain.smartContract.methods.maxSupply()
        .call();
      let maxMintAmountPerTx = await store
        .getState()
        .blockchain.smartContract.methods.maxMintAmountPerTx()
        .call();
      let paused = await store
        .getState()
        .blockchain.smartContract.methods.paused()
        .call();
      let presaleOnly = await store
        .getState()
        .blockchain.smartContract.methods.presaleOnly()
        .call();
      let cost = await store
        .getState()
        .blockchain.smartContract.methods.cost()
        .call();
      let presaleCost = await store
        .getState()
        .blockchain.smartContract.methods.presaleCost()
        .call();
      let balanceOfCurrentWallet = await store
        .getState()
        .blockchain.smartContract.methods.balanceOf(blockchainAccount)
        .call();
      let presaleAvailable = await store
        .getState()
        .blockchain.smartContract.methods.presaleWallets(blockchainAccount)
        .call();

        // alert("Givno success!\npresaleAvailable: " + presaleAvailable + " presaleCost: " + presaleCost + " totalSupply: " + totalSupply + " maxSupply: " + maxSupply)
      
      dispatch(
        fetchDataSuccess({
          totalSupply: totalSupply,
          maxSupply: maxSupply,
          maxMintAmountPerTx: maxMintAmountPerTx,
          paused: paused,
          presaleOnly: presaleOnly,
          presaleAvailable: presaleAvailable,
          cost: cost,
          presaleCost: presaleCost,
          balanceOfCurrentWallet: balanceOfCurrentWallet
        })
      );
    } catch (err) {
      console.log(err);
      dispatch(fetchDataFailed("Could not load data from contract."));
    }
  };
};
