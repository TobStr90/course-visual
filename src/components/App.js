import GraphDisplay from "./GraphDisplay";
import { Routes, Route } from "react-router-dom";
import TestGround from "./TestGround";
// import Graph from "./Graph";

const App = () => {
    return (
        <div>
            {/* <Header></Header> */}
            <Routes>
                <Route path="/" element={<GraphDisplay />}></Route>
                <Route path="/testground" element={<TestGround />}></Route>
            </Routes>
        </div>
    );
};

export default App;
