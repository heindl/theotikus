declare module "wikidata-sdk" {
  export function sparqlQuery(sparql: string): string;

  // tslint:disable:interface-name class-name
  export class simplify {
    public static sparqlResults(results: any): object[];
  }
}
