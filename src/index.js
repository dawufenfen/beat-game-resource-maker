/** @format */

import React from "react";
import ReactDOM from "react-dom";
import { Link } from "react-router";
import { hashHistory, Router, Route, Redirect, IndexRoute } from "react-router";
import { Icon } from "zent";

import "zent/css/index.css";

import App from "./app";
import MapMaker from "./map-maker";
import BeatsMaker from "./beats-maker";

import "./common.css";
import "./style.less";

if (module.hot) {
  module.hot.accept();
}

const Home = (props) => (
  <>
    <Link to="dashboard">
      <Icon type="inventory" className="homeIcon" />
    </Link>
    {props.children}
  </>
);

ReactDOM.render(
  <Router history={hashHistory}>
    <Route path="/" component={Home}>
      <IndexRoute component={App} />
      <Route path="dashboard" component={App} />
      <Route path="map-maker" component={MapMaker} />
      <Route path="beats-maker" component={BeatsMaker} />
      <Redirect from="*" to={"dashboard"} />
    </Route>
  </Router>,
  document.getElementById("root"),
);
