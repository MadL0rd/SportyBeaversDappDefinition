import React, { useEffect, useState, useRef } from "react";
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Widget from './components/Widget/Widget';
import WidgetWithBackground from './components/Widget/WidgetWithBackground';
import Dapp from './components/Dapp/Dapp';
import WidgetHolderCheck from "./components/Widget/WidgetHolderCheck";
import WidgetAcademySignIn from "./components/Widget/WidgetAcademySignIn";
import WidgetDiscord from "./components/Widget/WidgetDiscord";

function getQueryVariable(variable)
{
  var query = window.location.search.substring(1);
  console.log(query)//"app=article&act=news_content&aid=160990"
  var vars = query.split("&");
  console.log(vars) //[ 'app=article', 'act=news_content', 'aid=160990' ]
  for (var i=0;i<vars.length;i++) {
              var pair = vars[i].split("=");
              console.log(pair)//[ 'app', 'article' ][ 'act', 'news_content' ][ 'aid', '160990' ] 
  if(pair[0] == variable){return pair[1];}
  }
  return(false);
}

function App() {

  switch (getQueryVariable("widget")) {
    case "clear":
      return <Widget/>

    case "withbackground":
      return <WidgetWithBackground widgetInner={<Widget/>}/>

    case "cnacademy":
      return <Dapp widgetInner={<WidgetAcademySignIn/>} bottomInfo={false} />
  }

  if (getQueryVariable("discord") == "walletconnection") {
    return <Dapp widgetInner={<WidgetDiscord/>} bottomInfo={false}/>
  }

  return <Dapp widgetInner={<WidgetWithBackground widgetInner={<Widget/>}/>}/>
}

export default App;
