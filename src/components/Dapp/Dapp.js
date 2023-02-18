import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchData } from "../../redux/data/dataActions";
import * as s from "../../styles/globalStyles";
import styled from "styled-components";

import WidgetWithBackground from '../Widget/WidgetWithBackground';
import Widget from "../Widget/Widget";
import ExampleGif from "./ExampleGif";

import Constants from "../../Constants";

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

export const StyledLink = styled.a`
  color: var(--secondary);
  text-decoration: none;
`;

function Dapp(props) {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const [claimingNft, setClaimingNft] = useState(false);
  const [feedback, setFeedback] = useState(`Click buy to mint your NFT.`);
  const [mintAmount, setMintAmount] = useState(1);
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
    DISPLAY_COST: 0,
    GAS_LIMIT: 0,
    GAS_PRICE: 0,
    MARKETPLACE: "",
    MARKETPLACE_LINK: "",
    SHOW_BACKGROUND: false,
  });

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
    const config = await configResponse.json();
    SET_CONFIG(config);
  };

  useEffect(() => {
    getConfig();
  }, []);

  useEffect(() => {
    getData();
  }, [blockchain.account]);

  return (
    <s.Screen>
      <s.Container
        flex={1}
        ai={"center"}
        style={{ backgroundColor: "var(--primary)" }}
        image={CONFIG.SHOW_BACKGROUND ? Constants.mediaCollectionDappUrl + "bg.png" : null}
      >
        {/* <StyledLogo alt={"logo"} src={"/config/images/logo.png"} />{" "} */}
        <s.SpacerSmall />
        <ResponsiveWrapper flex={1} style={{ padding: 24 }} >

          <ExampleGif/>

          <s.SpacerLarge />
            <s.Container
              flex={2}
              jc={"center"}
              ai={"center"}
              style={{
                padding: 24
              }}
            >
              <WidgetWithBackground widgetInner={props.widgetInner} />
            </s.Container>
          <s.SpacerLarge />

          <ExampleGif/>
        </ResponsiveWrapper>

        {
          props.bottomInfo == false ? 
          <s.SpacerSmall /> :
          <s.Container jc={"center"} ai={"center"} 
            style={{
              backgroundColor: "var(--accent)",
              borderRadius: 24,
              boxShadow: "0px 5px 11px 2px rgba(0,0,0,0.7)",
              width: "60%"
            }}>
            <s.SpacerSmall />
            <s.TextDescription
              style={{
                textAlign: "center",
                color: "var(--accent-text)",
              }}
            >
              Please make sure you are connected to the right network({CONFIG.NETWORK.NAME} ) and the correct address. 
              <br/> Please note: Once you make the purchase, you cannot undo this action.
              <br/> We have set the gas limit to {CONFIG.GAS_LIMIT} for the contract to successfully mint your NFT.We recommend that you don 't lower the gas limit.{" "}
            </s.TextDescription>{" "}
            <s.SpacerSmall />     
          </s.Container>
        }
        
        <a href="https://www.ncraftsman.com/" style={{ marginLeft: "auto",  marginTop: "auto" }} target="_blank">
          <StyledLogo src={Constants.mediaCommonUrl + "designed.png"}  style={{ width:400, marginTop: "auto" }} />
        </a>
      </s.Container>{" "}
    </s.Screen>
  );
}

export default Dapp;
