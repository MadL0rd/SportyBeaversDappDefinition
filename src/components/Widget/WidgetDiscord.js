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

function WidgetDiscord() {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);

  const [walletConnectionStarts, setWalletConnectionStarts] = useState(false);
  const [walletLinkingStatusMessage, setWalletLinkingStatusMessage] = useState("");
  const [loadingDisplay, setLoadingDisplay] = useState(false);
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

  var HttpClient = function() {
    this.get = function(aUrl, aCallback) {
        var anHttpRequest = new XMLHttpRequest();

        anHttpRequest.onreadystatechange = function() { 
            if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200)
                aCallback(anHttpRequest.responseText);
        }

        anHttpRequest.open("GET", aUrl, true);
        anHttpRequest.setRequestHeader("Access-Control-Allow-Origin", "*");      
        anHttpRequest.send( null );
    }
}

  const connectWallet = async () => {
    setLoadingDisplay(true)
    startConnectionReqest()
    // window.location.reload();
  }

  async function startConnectionReqest() {
    let userId = getQueryVariable("user")
    let url = "https://api.discord.ncraftsman.com/connect_wallet/?user_id="+ userId +"&wallet=" + blockchain.account
    // setIframeReqestUrl(url)

    setWalletConnectionStarts(true)
    var client = new HttpClient();
    client.get(url, async function(response) {
      let data = JSON.parse(response)
      setLoadingDisplay(false)
      if (data.error) {
        if (data.error == "Bad request") {
            setWalletLinkingStatusMessage("Error! Please, press button in discord one more time and follow correct link")
        }
        if (data.error == "Wrong user id") {
          setWalletLinkingStatusMessage("Error! Please, press connect button in discord one more time")
        }
        if (data.error == "Wallet already connected") {
            setWalletLinkingStatusMessage("Sorry, wallet " + blockchain.account + " already connected to another account. If you think that something went wrong, then contact the administrator of the discord server")
        }
        return;
      }
      if (data.result) {
        if (data.result =="Success") {
            setWalletLinkingStatusMessage("Congratulations! Your discord acctount successfily linked to wallet " + blockchain.account)
        }
        return;
      }

      console.log(data)
      alert(response)
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
          <s.Container
            flex={2}
            jc={"center"}
            ai={"center"}
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
              Discord connection
            </s.TextTitle>{" "}
            <s.SpacerSmall />{" "}
            {Number(data.totalSupply) >= CONFIG.MAX_SUPPLY ? (
              <>
                <s.TextTitle
                  style={{ textAlign: "center", color: "var(--accent-text)" }}
                >
                  The sale has ended.{" "}
                </s.TextTitle>{" "}
                <s.TextDescription
                  style={{ textAlign: "center", color: "var(--accent-text)" }}
                >
                  You can still find {CONFIG.NFT_NAME}
                  on{" "}
                </s.TextDescription>{" "}
                <s.SpacerSmall />
                <StyledLink target={"_blank"} href={CONFIG.MARKETPLACE_LINK}>
                  {" "}
                  {CONFIG.MARKETPLACE}{" "}
                </StyledLink>{" "}
              </>
            ) : (
              <>
                <s.TextTitle
                  style={{ textAlign: "center", color: "var(--accent-text)", padding: "0 1rem", maxWidth: "80%"}}
                >
                  { 
                  walletConnectionStarts ? walletLinkingStatusMessage :
                  blockchain.account ? 
                    "Press the button down below to connect your discord account with metamask wallet " + blockchain.account :
                    "Please press connect button to link your wallet and discord account"
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
                    <s.SpacerSmall />
                    <s.TextDescription
                          style={{
                            textAlign: "center",
                            color: "var(--accent-text)",
                          }}
                        >
                          Or if you trying to connect wallet from phone
                        </s.TextDescription>{" "}
                    <StyledLink target={"_blank"} href={'https://metamask.app.link/dapp/' + Constants.siteDomain + '/?discord=walletconnection&user=' + getQueryVariable("user")}>
                      Open in metamask app from phone{" "}
                    </StyledLink>{" "}

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
                          Link wallet 
                        </StyledButton>{" "}
                      </s.Container>
                      
                    </s.Container>{" "}
                  </>
                )}
              </>
            )}
            <s.SpacerLarge />
          </s.Container>
  );
}

export default WidgetDiscord;
