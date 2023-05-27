import Graph from "./Graph";
import { Routes, Route } from "react-router-dom";

const App = () => {
    return (
        <div>
            <Routes>
                <Route path="/" element={<Graph />}></Route>
            </Routes>
        </div>
    );
};

export default App;
