// 图 邻接表
// 最短路径算法、关键路径算法与拓扑排序
// 图的遍历： DFS、BFS

class Graph {
    vertices: any;
    adjList: any;
    constructor() {
        this.vertices = [];
        this.adjList = new Map();
    }

    addVertex(v) {
        this.vertices.push(v);
        this.adjList.set(v, []);
    }

    addEdge(v, w) {
        this.adjList.get(v).push(w);
    }

    printGraph() {
        for (let i = 0; i < this.vertices.length; i++) {
            let neighbors = this.adjList.get(this.vertices[i]);
        }
    }
}