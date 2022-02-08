import React from "react";
import { Link } from "react-router";
import "./index.css";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div>欢迎你呀，制作人</div>
        <p>
          我们现在有
          <div>
            <Link to="map-maker">
              <div className="router-entrance">地图编辑器</div>
            </Link>
            <Link to="beats-maker">
              <div className="router-entrance">节拍编辑器</div>
            </Link>
          </div>
        </p>
      </header>
    </div>
  );
}

export default App;
