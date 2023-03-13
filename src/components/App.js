import Header from "./Header";
import ReactForceGraph2D from "./ReactForceGraph2D";
import ReactForceGraph3D from "./ReactForceGraph3D";
import PrunedGraph2D from "./PrunedGraph2D";
import PrunedGraph3D from "./PrunedGraph3D";
import D3 from "./D3";
import TestGround from "./TestGround";
import { Routes, Route } from "react-router-dom";

const App = () => {
    return (
        <div>
            <Header></Header>
            <Routes>
                <Route
                    path="/react-force-graph2D"
                    element={<ReactForceGraph2D />}
                ></Route>
                <Route
                    path="/prunedgraph2D"
                    element={<PrunedGraph2D />}
                ></Route>
                <Route
                    path="/prunedgraph3D"
                    element={<PrunedGraph3D />}
                ></Route>
                <Route
                    path="/react-force-graph3D"
                    element={<ReactForceGraph3D />}
                ></Route>
                <Route path="/D3" element={<D3 />}></Route>
                <Route path="/testground" element={<TestGround />}></Route>
            </Routes>
        </div>
    );
};

export default App;
