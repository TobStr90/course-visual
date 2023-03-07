import Header from "./Header";
import ReactForceGraph from "./ReactForceGraph";
import PrunedGraph from "./PrunedGraph";
import PrunedGraph3D from "./PrunedGraph3D";
import D3 from "./D3";
import TestGround from "./TestGround";
import { Routes, Route } from "react-router-dom";

const App = () => {
    return (
        <div>
            <Header />
            <Routes>
                <Route
                    path="/react-force-graph"
                    element={<ReactForceGraph />}
                ></Route>
                <Route path="/prunedgraph" element={<PrunedGraph />}></Route>
                <Route
                    path="/prunedgraph3D"
                    element={<PrunedGraph3D />}
                ></Route>
                <Route path="/D3" element={<D3 />}></Route>
                <Route path="/testground" element={<TestGround />}></Route>
            </Routes>
        </div>
    );
};

export default App;
