import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "../../redux/blockchain/blockchainActions";
import { fetchData } from "../../redux/data/dataActions";
import * as s from "../../styles/globalStyles";
import styled from "styled-components";
import Loading from '../Loading/Loading';

import { withRouter } from 'react-router-dom';
import queryString from 'query-string';
import Constants from "../../Constants";

const truncate = (input, len) =>
  input.length > len ? `${input.substring(0, len)}...` : input;

export const StyledButton = styled.button`
  padding: 10px;
  border-radius: 8px;
  border: none;
  background-color: var(--secondary);
  padding: 10px;
  font-weight: bold;
  color: var(--secondary-text);
  width: 100px;
  cursor: pointer;
  box-shadow: 0px 6px 0px -2px var(--button-shadow);
  -webkit-box-shadow: 0px 6px 0px -2px var(--button-shadow);
  -moz-box-shadow: 0px 6px 0px -2px var(--button-shadow);
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
`;

export const StyledRoundButton = styled.button`
  padding: 10px;
  border-radius: 100%;
  border: none;
  background-color: var(--primary);
  padding: 10px;
  font-weight: bold;
  font-size: 15px;
  color: var(--primary-text);
  width: 30px;
  height: 30px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 4px 0px -2px var(--button-shadow);
  -webkit-box-shadow: 0px 4px 0px -2px var(--button-shadow);
  -moz-box-shadow: 0px 4px 0px -2px var(--button-shadow);
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
`;

export const ResponsiveWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: stretched;
  align-items: stretched;
  width: 100%;
  @media (min-width: 767px) {
    flex-direction: row;
  }
`;

export const StyledLogo = styled.img`
  width: 200px;
  @media (min-width: 767px) {
    width: 300px;
  }
  transition: width 0.5s;
  transition: height 0.5s;
`;

export const StyledImg = styled.img`
  box-shadow: 0px 5px 11px 2px rgba(0, 0, 0, 0.7);
  border-radius: 15%;
  width: 200px;
  @media (min-width: 900px) {
    width: 250px;
  }
  @media (min-width: 1000px) {
    width: 300px;
  }
  transition: width 0.5s;
`;

export const StyledLink = styled.a`
  color: var(--secondary);
  text-decoration: none;
`;

function WidgetHolderCheck() {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);

  const [walletConnectionStarts, setWalletConnectionStarts] = useState(false);
  const [walletLinkingStatusMessage, setWalletLinkingStatusMessage] = useState("");
  const [loadingDisplay, setLoadingDisplay] = useState(false);
  const [balance, setBalance] = useState(0);
  const [iframeReqestUrl, setIframeReqestUrl] = useState("");

  const [CONFIG, SET_CONFIG] = useState({
    CONTRACT_ADDRESS: "",
    SCAN_LINK: "",
    NETWORK: {
      NAME: "",
      SYMBOL: "",
      ID: 0,
    },
    NFT_NAME: "",
    SYMBOL: "",
    MAX_SUPPLY: 1,
    WEI_COST: 0,
    WEI_COST_PRESALE: 0,
    DISPLAY_COST: 0,
    DISPLAY_COST_PRESALE: 0,
    GAS_LIMIT: 0,
    MARKETPLACE: "",
    MARKETPLACE_LINK: "",
  });

  const connectWallet = async () => {
    setLoadingDisplay(true)
    startConnectionReqest()
  }

  async function startConnectionReqest() {

    setWalletConnectionStarts(true)

    let addressPrepared = blockchain.account
    addressPrepared = addressPrepared.replace('0x', '');
    
    const response = await fetch('https://polygon-rpc.com/', {
        method: 'POST',
        headers: {
          'authority': 'polygon-rpc.com',
          'accept': '*/*',
          'content-type': 'application/json',
          'origin': 'https://polygonscan.com',
          'referer': 'https://polygonscan.com/',
          'sec-fetch-dest': 'empty',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'cross-site',
      },
        body: JSON.stringify({
            'jsonrpc': '2.0',
            'id': 2,
            'method': 'eth_call',
            'params': [
                {
                    'from': '0x0000000000000000000000000000000000000000',
                    'data': '0x70a08231000000000000000000000000' + addressPrepared,
                    'to': CONFIG.CONTRACT_ADDRESS
                },
                'latest'
            ]
        })
    })
    await response.json().then((data) => {
      console.log(data)
      let balance = Number(data.result)
      setBalance(balance)
      setLoadingDisplay(false)
    });
  }

  const getData = () => {
    if (blockchain.account !== "" && blockchain.smartContract !== null) {
      dispatch(fetchData(blockchain.account));
    }
  };

  const getConfig = async () => {
    const configResponse = await fetch("/config/config.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    var config = await configResponse.json();

    SET_CONFIG(config);
  };

  function getQueryVariable(variable)
  {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++) {
      var pair = vars[i].split("=")
      if(pair[0] == variable){
        return pair[1]
      }
    }
    return(false);
  }

  useEffect(() => {
    getConfig();
  }, []);

  useEffect(() => {
    getData();
  }, [blockchain.account]);

  return (
          <s.Container>
            <s.Container
            flex={2}
            jc={"center"}
            ai={"center"}
            height={"100%"}
            style={{ display: balance == 0 ? "flex" : "none" }}
            >
              <s.SpacerLarge />
              <s.TextTitle
                style={{
                  textAlign: "center",
                  fontSize: 50,
                  fontWeight: "bold",
                  color: "var(--accent-text)",
                }}
              >
                Get access to content
              </s.TextTitle>{" "}
              <s.SpacerSmall />{" "}
                <>
                  <s.TextTitle
                    style={{ textAlign: "center", color: "var(--accent-text)", padding: "0 1rem", maxWidth: "80%"}}
                  >
                    { 
                    walletConnectionStarts ? walletLinkingStatusMessage :
                    blockchain.account ? 
                      "Press the button down below to confirm that wallet " + blockchain.account + " hold CryptoNerdNFT" :
                      "Please press connect button to confirm that you have CryptoNerdNFT"
                    }
                  </s.TextTitle>{" "}
                  
                  {blockchain.account === "" ||
                  blockchain.smartContract === null ? (
                    <s.Container ai={"center"} jc={"center"}>
                      <s.TextDescription
                        style={{
                          textAlign: "center",
                          color: "var(--accent-text)",
                        }}
                      >
                        Connect to the {CONFIG.NETWORK.NAME} network{" "}
                      </s.TextDescription>{" "}
                      <s.SpacerSmall />
                      <StyledButton
                        onClick={(e) => {
                          e.preventDefault();
                          dispatch(connect());
                          getData();
                        }}
                      >
                        CONNECT{" "}
                      </StyledButton>{" "}

                      {blockchain.errorMsg !== "" ? (
                        <>
                          <s.SpacerSmall />
                          <s.TextDescription
                            style={{
                              textAlign: "center",
                              color: "var(--accent-text)",
                            }}
                          >
                            {" "}
                            {blockchain.errorMsg}{" "}
                          </s.TextDescription>{" "}
                        </>
                      ) : null}{" "}
                    </s.Container>
                  ) : (
                    <>
                      <div style={{ display: loadingDisplay ? "block" : "none" }}>
                        <Loading />
                      </div>
                      <s.Container style={{ display: walletConnectionStarts ? "none" : "block" }}>
                        <s.SpacerMedium />
                    
                        <s.Container ai={"center"} jc={"center"} fd={"row"}>
                          <StyledButton
                            onClick={(e) => {
                              e.preventDefault();
                              connectWallet();
                              getData();
                            }}
                          >
                            Load NFTs
                          </StyledButton>{" "}
                        </s.Container>
                        
                      </s.Container>{" "}
                    </>
                  )}
                </>
              <s.SpacerLarge />
            </s.Container>
            <s.Container 
            flex={2}
            jc={"center"}
            ai={"center"}
            height={"100%"}
            style={{ display: balance > 0 ? "flex" : "none" }}
            >
              <iframe src="https://crypto-nerds.de/mint_nft"
              width={"100%"}
              height={"100%"}
              marginHeight={0}
              padding={0}
              >
                Your browser does not support floating iframes!
              </iframe>
            </s.Container>
          </s.Container>
  );
}

export default WidgetHolderCheck;
