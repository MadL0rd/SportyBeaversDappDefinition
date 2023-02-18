import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "../../redux/blockchain/blockchainActions";
import { fetchData } from "../../redux/data/dataActions";
import * as s from "../../styles/globalStyles";
import styled from "styled-components";
import WidgetDiscord from "./WidgetDiscord";

const truncate = (input, len) =>
  input.length > len ? `${input.substring(0, len)}...` : input;

import Widget from './Widget';

function WidgetWithBackground(props) {

  return (
    <s.Container
    style={{
      backgroundColor: "var(--accent)",
      borderRadius: 24,
      boxShadow: "0px 5px 11px 2px rgba(0,0,0,0.7)",
    }}
  >
    
    { props.widgetInner }
  </s.Container>
  );
}

export default WidgetWithBackground;
