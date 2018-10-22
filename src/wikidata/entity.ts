import Axios from "axios";
import * as sdk from "wikidata-sdk";

export interface IEntity {
  id: string;
  label: string;
  data: EntityData;
}

type EntityData = Array<{ objLabel: string; pLabel: string; vLabel: string }>;

export const fetchEntity = async (id: string): Promise<IEntity> => {
  const q = `
            SELECT DISTINCT ?objLabel ?pLabel ?vLabel WHERE {
              BIND(wd:${id} AS ?obj)
              ?obj ?property ?v .
              ?p wikibase:directClaim ?property .
              ?p wikibase:propertyType ?wikibaseType .
              FILTER(?wikibaseType != wikibase:ExternalId && ?wikibaseType != wikibase:CommonsMedia) .
              SERVICE wikibase:label {
                bd:serviceParam wikibase:language "en" .
              }
            }
        `;

  const axiosRes = await Axios.get(sdk.sparqlQuery(q));
  const res = sdk.simplify.sparqlResults(axiosRes.data) as EntityData;
  return {
    data: res,
    id,
    label: res[0].objLabel
  };
};
