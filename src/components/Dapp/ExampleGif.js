import React, { useEffect, useState, useRef } from "react";
import * as s from "../../styles/globalStyles";
import Constants from "../../Constants";
import styled from "styled-components";

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

function ExampleGif() {

  return (
    <s.Container flex={1} jc={"center"} ai={"center"}>
        {/* <StyledImg 
        alt={"example"}
        src={Constants.mediaCollectionDappUrl + "example.gif"}
        /> */}
    </s.Container>
  );
}

export default ExampleGif;
