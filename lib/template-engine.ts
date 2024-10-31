import edge from "edge.js";
import path from "node:path";
edge.mount(path.resolve(process.cwd(), "templates"));

export default edge;
