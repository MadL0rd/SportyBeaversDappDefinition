import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "../../redux/blockchain/blockchainActions";
import { fetchData } from "../../redux/data/dataActions";
import * as s from "../../styles/globalStyles";
import { 
    Audio, 
    BallTriangle, 
    Bars, 
    Circles,
    Grid,
    Hearts,
    MutatingDots,
    Oval,
    Plane,
    RevolvingDot,
    Rings,
    TailSpin,
    Triangle,
    Watch
} from 'react-loader-spinner'

export const props = {
    color: 'var(--secondary)',
    secondaryColor:"var(--secondary)",
    height: 100,
    width: 110
}

function Loading() {

  return (
    <div>
        {/* <img src={"/config/images/loading.gif"} style={{ height: 150 }} /> */}
        <Rings {...props} />
    </div>
  );
}

export default Loading;
