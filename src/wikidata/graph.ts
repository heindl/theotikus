import Axios from "axios";
import {INode} from "react-vis-force";
import * as sdk from "wikidata-sdk";
import {LinkSet} from "./wikidata";

interface IGraphElements{
    links: LinkSet,
    nodes: Map<string, IGraphNode>
}

interface IValueLabel{
    value: string,
    label: string
}

interface IGraphResponse{
    source: IValueLabel,
    target: IValueLabel,
    classes: string
}

export class IGraphNode {
    // tslint:disable:variable-name
    protected readonly _res: IValueLabel;
    protected readonly _classes: string;

    constructor(res: IValueLabel, classes: string) {
        this._res = res;
        this._classes = classes;
    }

    public valid = (): boolean => {
        return !blacklistRegexp.test(this._classes)
    };

    public id = (): string => {
        return this._res.value
    };

    public label = (): string => {
        return this._res.label
    };

    // public instanceOf = (): string => {
    //     return this._classes.split()
    // };

    public node = (): INode => {
        return {
            id: this.id(),
            label: this.label(),
            radius: 7,
        }
    };

    public color = (): string => {

        // const i = this.instanceOf();
        //
        // if (i === "") {
        //     return "#C4D4E0"
        // }
        //
        // if (i.indexOf("deity") !== -1 || i.indexOf("god") !== -1) {
            return "#e9c77b"
        // }
        //
        // if (i.indexOf("human") !== -1) {
        //     return "#e2b498"
        // }

        // return "#9aabb9";

        // switch (this.gender()) {
        //     case "Q6581072":
        //         return "#6d97ab";
        //     case "Q6581097": // Male
        //         return "#afc1c1";
        //     default:
        //         return "#3b4a4c";
        // }
    }
}

const blacklist = [
    "audio signal",
    "brewery",
    "wikimedia category",
    "asteroid",
    "video game",
    "airport",
    "impact crater"
];

const blacklistRegexp = new RegExp(`(^|\\;)\\s*(${blacklist.join("|")})\\s*(\\;|$)`, "i");

export const fetchGraph = async (subject: string = "wd:Q275051"): Promise<IGraphElements> => {
    const u =  sdk.sparqlQuery(`
PREFIX gas: <http://www.bigdata.com/rdf/gas#>
SELECT 
?target
?targetLabel
?source
?sourceLabel
(GROUP_CONCAT(DISTINCT(?classLabel); separator = ";") AS ?classes)
WHERE {
  SERVICE gas:service {
    gas:program gas:gasClass "com.bigdata.rdf.graph.analytics.SSSP" ;
                gas:in ${subject};
                gas:traversalDirection "Reverse" ;
                gas:out ?target ;
                gas:out1 ?depth ;
                gas:out2 ?source ;
                gas:maxIterations 3 .
  }
  ?target wdt:P31/wdt:P279* ?class .
  ?class rdfs:label ?classLabel .
  FILTER( LANG(?classLabel) = "en" ) .
  SERVICE wikibase:label {bd:serviceParam wikibase:language "en" }
} GROUP BY ?target
?targetLabel
?source
?sourceLabel
`);

    const res = await Axios.get(u);

    const o: IGraphElements = {
        links: new LinkSet(),
        nodes: new Map<string, IGraphNode>(),
    };
    sdk.simplify.sparqlResults(res.data).forEach((obj: IGraphResponse) => {

        const tgt = new IGraphNode(obj.target, obj.classes);
        if (!tgt.valid()) {
            return
        }
        o.nodes.set(tgt.id(), tgt);

        const src = new IGraphNode(obj.source, "");
        if (!o.nodes.has(src.id())) {
            o.nodes.set(src.id(), src);
        }

        o.links.add(src.id(), tgt.id());
    });
    return o
};