<script src="//unpkg.com/force-graph"></script>;

const TestGround = () => {
    const rootId = 0;

    // Random tree
    const N = 300;
    const gData = {
        nodes: [...Array(N).keys()].map((i) => ({
            id: i,
            collapsed: i !== rootId,
            childLinks: [],
        })),
        links: [...Array(N).keys()]
            .filter((id) => id)
            .map((id) => ({
                source: Math.round(Math.random() * (id - 1)),
                target: id,
            })),
    };

    // link parent/children
    const nodesById = Object.fromEntries(
        gData.nodes.map((node) => [node.id, node])
    );
    gData.links.forEach((link) => {
        nodesById[link.source].childLinks.push(link);
    });

    const getPrunedTree = () => {
        const visibleNodes = [];
        const visibleLinks = [];

        (function traverseTree(node = nodesById[rootId]) {
            visibleNodes.push(node);
            if (node.collapsed) return;
            visibleLinks.push(...node.childLinks);
            node.childLinks
                .map((link) =>
                    typeof link.target === "object"
                        ? link.target
                        : nodesById[link.target]
                ) // get child node
                .forEach(traverseTree);
        })(); // IIFE

        return { nodes: visibleNodes, links: visibleLinks };
    };

    const elem = document.getElementById("graph");
    // eslint-disable-next-line no-undef
    const Graph = ForceGraph()(elem)
        .graphData(getPrunedTree())
        .onNodeHover(
            (node) =>
                (elem.style.cursor =
                    node && node.childLinks.length ? "pointer" : null)
        )
        .onNodeClick((node) => {
            if (node.childLinks.length) {
                node.collapsed = !node.collapsed; // toggle collapse state
                Graph.graphData(getPrunedTree());
            }
        })
        .linkDirectionalParticles(1)
        .linkDirectionalParticleWidth(2.5)
        .nodeColor((node) =>
            !node.childLinks.length
                ? "green"
                : node.collapsed
                ? "red"
                : "yellow"
        );

    return <div id="graph"></div>;
};

export default TestGround;
