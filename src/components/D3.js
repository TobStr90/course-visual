const D3 = () => {
    var data = require("../assets/graph.json");
    console.log(data);

    if (!data) {
        return <div>Loading data...</div>;
    }

    return <div>Work in progress</div>;
};

export default D3;
