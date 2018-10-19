import {ILink, INode} from "react-vis-force";
import * as sdk from 'wikidata-sdk';

import Axios from 'axios';
const peopleQuery = `
    SELECT DISTINCT ?src ?srcLabel ?srcGender ?tgt ?tgtLabel ?tgtGender ?srcInstanceOfLabel ?tgtInstanceOfLabel WHERE {
      ?src (wdt:P361|wdt:P140|wdt:P1049) wd:Q275051; wdt:P21 ?srcGender; wdt:P31 ?srcInstanceOf  .
      # ?src wdt:P31/wdt:P279* wd:Q178885  .
      #?src wdt:P21 ?srcGender
      OPTIONAL{?src wdt:P40 ?tgt; wdt:P21 ?tgtGender; wdt:P31 ?tgtInstanceOf} .
      OPTIONAL{?src wdt:P1290 ?tgt; wdt:P21 ?tgtGender; wdt:P31 ?tgtInstanceOf} .
      OPTIONAL{?src wdt:P3448 ?tgt; wdt:P21 ?tgtGender; wdt:P31 ?tgtInstanceOf} .
      OPTIONAL{?src wdt:P40 ?tgt; wdt:P21 ?tgtGender; wdt:P31 ?tgtInstanceOf} .
      OPTIONAL{?src wdt:P26 ?tgt; wdt:P21 ?tgtGender; wdt:P31 ?tgtInstanceOf} .
      OPTIONAL{?src wdt:P25 ?tgt; wdt:P21 ?tgtGender; wdt:P31 ?tgtInstanceOf} .
      OPTIONAL{?src wdt:P22 ?tgt; wdt:P21 ?tgtGender; wdt:P31 ?tgtInstanceOf} .
      # Hardcoded above to be a little faster.
      # ?relationship_ wdt:P1647 wd:P1038 .
      # ?relationship_ wikibase:directClaim ?relationship .
      # ?obj ?relationship ?relative .
      SERVICE wikibase:label {
        bd:serviceParam wikibase:language "en" .
      }
    }
`;

interface IWikiResponse {
    src: {
        value: string
        label: string
    }
    tgt: {
        value: string
        label: string
    }
    srcGender: string
    tgtGender: string
}

export interface IFetchResponse{
     links: Map<string, ILink>,
    nodes: Map<string, IWikiNode>
}

const labelMissingRegex = new RegExp('^Q[0-9]*$');

export class IWikiNode {
    // tslint:disable:variable-name
    protected readonly _res: IWikiResponse;
    protected readonly _prefix: string;

    constructor(prefix: string, res: IWikiResponse) {
        this._res = res;
        this._prefix = prefix;
    }

    public valid = (): boolean => {
        return this.id() !== "" && this.label() !== "" && !labelMissingRegex.test(this.label())
    };

    public id = (): string => {
        return (this._prefix in this._res && this._res[this._prefix]) ? this._res[this._prefix].value.trim() : ""
    };

    public label = (): string => {
        return (this._prefix in this._res && this._res[this._prefix]) ? this._res[this._prefix].label.trim() : "";
    };

    public gender = (): string => {
        const k = this._prefix+"Gender";
        return (k in this._res) ? this._res[k] as string : ""
    };

    public instanceOf = (): string => {
        const k = this._prefix+"InstanceOfLabel";
        return (k in this._res) ? this._res[k].trim() : ""
    };

    public node = (): INode => {
        return {
            id: this.id(),
            label: this.label(),
            radius: 10,
        }
    };

    public color = (): string => {

        const i = this.instanceOf();

        if (i === "") {
            return "#C4D4E0"
        }

        if (i.indexOf("deity") !== -1 || i.indexOf("god") !== -1) {
            return "#e9c77b"
        }

        if (i.indexOf("human") !== -1) {
            return "#e2b498"
        }

        return "#9aabb9";



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

export function fetchPeople(): Promise<IFetchResponse> {
    return new Promise((resolve, reject) => {
        Axios.get(sdk.sparqlQuery(peopleQuery)).then((res) => {
            const o: IFetchResponse = {
                links: new Map<string, ILink>(),
                nodes: new Map<string, IWikiNode>(),
            };
            sdk.simplify.sparqlResults(res.data).forEach((obj: IWikiResponse) => {

                const src = new IWikiNode("src", obj);
                const tgt = new IWikiNode("tgt", obj);
                // Ignore values where the label is the entity link: Q12345...
                if (!src.valid()) {
                    return
                }
                o.nodes.set(src.id(), src);
                if (!tgt.valid()) {
                    return
                }
                o.nodes.set(tgt.id(), tgt);
                o.links.set(`${src.id()}=>${tgt.id()}`, {source: src.id(), target: tgt.id(), value: 2});
            });
            resolve(o)
        }).catch(reject)
    })
}