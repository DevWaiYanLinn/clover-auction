import { Edge } from "edge.js";
import path from "node:path";
const edge = Edge.create({
    cache: process.env.NODE_ENV === "production",
});
edge.mount(path.resolve(process.cwd(), "templates"));

export default edge;
