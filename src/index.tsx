import * as React from "react";
import * as ReactDOM from "react-dom";
import * as ReactGA from "react-ga";
import { Index } from "./components/Index";
import "./index.css";
import registerServiceWorker from "./registerServiceWorker";
ReactGA.initialize(process.env.REACT_APP_TRACKING_CODE || "");
ReactGA.pageview(window.location.pathname + window.location.search);

ReactDOM.render(<Index />, document.getElementById("root") as HTMLElement);
registerServiceWorker();
