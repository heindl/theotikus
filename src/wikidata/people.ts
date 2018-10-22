import Axios from "axios";
import * as sdk from "wikidata-sdk";
import { IWikiNode, IWikiResponse, LinkSet } from "./wikidata";

interface IGraphElements {
  links: LinkSet;
  nodes: Map<string, IWikiNode>;
}

export const fetchPeople = async (): Promise<IGraphElements> => {
  const u = sdk.sparqlQuery(`
                SELECT DISTINCT ?src ?srcLabel ?srcGender ?tgt ?tgtLabel ?tgtGender ?srcInstanceOfLabel ?tgtInstanceOfLabel WHERE {
                  ?src (wdt:P361|wdt:P140|wdt:P1049|wdt:P2596) wd:Q275051; 
                                                     wdt:P31/wdt:P279* wd:Q215627|Q95074|Q28855038|Q15619164; 
                                                     wdt:P31 ?srcInstanceOf  .
                  OPTIONAL{?src wdt:P21 ?srcGender} .
                  ?src wdt:P1290|wdt:P1038|wdt:P1039|wdt:P3448|wdt:P3373|wdt:P40|wdt:P26|wdt:P25|wdt:P22|wdt:P156|wdt:P155 ?tgt .
                  OPTIONAL{?tgt wdt:P21 ?tgtGender} .
                  OPTIONAL{?tgt wdt:P31 ?tgtInstanceOf} .
                  # Hardcoded above to be a little faster.
                  # ?relationship_ wdt:P1647 wd:P1038 .
                  # ?relationship_ wikibase:directClaim ?relationship .
                  # ?obj ?relationship ?relative .
                  SERVICE wikibase:label {
                    bd:serviceParam wikibase:language "en" .
                  }
                }
            `);

  const res = await Axios.get(u);

  const o: IGraphElements = {
    links: new LinkSet(),
    nodes: new Map<string, IWikiNode>()
  };
  sdk.simplify.sparqlResults(res.data).forEach((obj: IWikiResponse) => {
    const src = new IWikiNode("src", obj);
    const tgt = new IWikiNode("tgt", obj);
    // Ignore values where the label is the entity link: Q12345...
    if (!src.valid()) {
      return;
    }
    o.nodes.set(src.id(), src);
    if (!tgt.valid()) {
      return;
    }
    o.nodes.set(tgt.id(), tgt);
    o.links.add(src.id(), tgt.id());
  });
  return o;
};
