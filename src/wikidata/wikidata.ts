// TODO:
// Depicts (https://tools.wmflabs.org/sqid/#/view?id=P180) art pointing to person or element

import { INode } from "react-vis-force";

export interface IWikiResponse {
  src: {
    value: string;
    label: string;
  };
  tgt: {
    value: string;
    label: string;
  };
  srcGender: string;
  tgtGender: string;
}

const labelMissingRegex = new RegExp("^Q[0-9]*$");

// tslint:disable:max-classes-per-file
export class IWikiNode {
  // tslint:disable:variable-name
  protected readonly _res: IWikiResponse;
  protected readonly _prefix: string;

  constructor(prefix: string, res: IWikiResponse) {
    this._res = res;
    this._prefix = prefix;
  }

  public valid = (): boolean => {
    return (
      this.id() !== "" &&
      this.label() !== "" &&
      !labelMissingRegex.test(this.label())
    );
  };

  public id = (): string => {
    return this._prefix in this._res && this._res[this._prefix]
      ? this._res[this._prefix].value.trim()
      : "";
  };

  public label = (): string => {
    return this._prefix in this._res && this._res[this._prefix]
      ? this._res[this._prefix].label.trim()
      : "";
  };

  public gender = (): string => {
    const k = this._prefix + "Gender";
    return typeof this._res[k] !== "undefined" ? (this._res[k] as string) : "";
  };

  public instanceOf = (): string => {
    const k = this._prefix + "InstanceOfLabel";
    return typeof this._res[k] !== "undefined" ? this._res[k].trim() : "";
  };

  public node = (): INode => {
    return {
      id: this.id(),
      label: this.label(),
      radius: 7
    };
  };

  public color = (): string => {
    const i = this.instanceOf();

    if (i === "") {
      return "#C4D4E0";
    }

    if (i.indexOf("deity") !== -1 || i.indexOf("god") !== -1) {
      return "#e9c77b";
    }

    if (i.indexOf("human") !== -1) {
      return "#e2b498";
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
  };
}

export class LinkSet {
  public set: string[][] = [];

  public add = (x: string, y: string) => {
    if (!this.has(x, y)) {
      this.set.push([x, y]);
    }
  };

  public has = (x: string, y: string): boolean => {
    return (
      this.set.filter((v: string[]) => {
        return v.indexOf(x) !== -1 && v.indexOf(y) !== -1;
      }).length > 0
    );
  };
}
