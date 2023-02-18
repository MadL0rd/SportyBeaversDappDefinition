const initialState = {
  dataLoaded: false,
  loading: false,
  totalSupply: 0,
  maxSupply: 0,
  maxMintAmountPerTx: 1,
  presaleAvailable: false,
  cost: 0,
  presaleCost: 0,
  balanceOfCurrentWallet: 0,
  paused: true,
  presaleOnly: true,
  error: false,
  errorMsg: "",
};

const dataReducer = (state = initialState, action) => {
  switch (action.type) {
    case "CHECK_DATA_REQUEST":
      return {
        ...state,
        loading: true,
        error: false,
        errorMsg: "",
      };
    case "CHECK_DATA_SUCCESS":
      return {
        ...state,
        dataLoaded: true,
        loading: false,
        totalSupply: action.payload.totalSupply,
        maxSupply: action.payload.maxSupply,
        maxMintAmountPerTx: action.payload.maxMintAmountPerTx,
        paused: action.payload.paused,
        presaleOnly: action.payload.presaleOnly,
        presaleAvailable: action.payload.presaleAvailable,
        cost: action.payload.cost,
        presaleCost: action.payload.presaleCost,
        balanceOfCurrentWallet: action.payload.balanceOfCurrentWallet,
        error: false,
        errorMsg: "",
      };
    case "CHECK_DATA_FAILED":
      return {
        ...initialState,
        loading: false,
        error: true,
        errorMsg: action.payload,
      };
    default:
      return state;
  }
};

export default dataReducer;
