import {createStyles, Theme, withStyles, WithStyles} from "@material-ui/core";
import * as React from 'react';
import {SyntheticEvent} from "react";
import {ForceGraphLink, ForceGraphNode, INode, InteractiveForceGraph} from 'react-vis-force';
import {GlobalLogger} from "../utils/logging";
import {fetchGraph, IGraphNode} from "../wikidata/graph";
import {LinkSet} from "../wikidata/wikidata";

const styles = (_: Theme) => createStyles({
    '@global': {
        'text': {
            fill: "#fff",
            fontSize: "1em"
        },
    },
    node: {
        strokeWidth: 0,
    }
});

interface IProps extends WithStyles<typeof styles>  {
    selectedEntityId?: string
    selectEntity(entityId?: string): void
}

interface IState{
    links: LinkSet,
    nodes: Map<string, IGraphNode>
}

export const Graph = withStyles(styles)(
    class extends React.Component<IProps, IState> {

        constructor(props: IProps) {
            super(props);
            fetchGraph().then((s) => {
                this.setState({nodes: s.nodes, links: s.links})
            }).catch(GlobalLogger.Error);
        }

        public selectNode = (e: SyntheticEvent, nd: INode) => {
            this.props.selectEntity(nd.id)
        };

        // This seems to be in-effective
        // public deselectNode = (e: SyntheticEvent, nd: INode) => {
            // this.props.selectEntity()
        // };

        public render() {

            const {classes} = this.props;

            if (!this.state || !this.state.nodes) {
                return <div/>
            }

            return (
                    <InteractiveForceGraph
                        labelAttr="label"
                        highlightDependencies={true}
                        simulationOptions={{
                            alpha: 0.5,
                            animate: true,
                            draggable: true,
                            strength: {
                                charge: -50,
                            },
                        }}
                        onSelectNode={this.selectNode}
                        // This seems to be ineffective
                        // onDeselectNode={this.deselectNode}
                        selectedNode={(!this.props.selectedEntityId || this.props.selectedEntityId === "") ? undefined : {id: this.props.selectedEntityId}}
                        zoom={true}
                    >
                        {Array.from(this.state.nodes.values()).map((nd: IGraphNode)=> {
                            return (
                                <ForceGraphNode
                                    className={classes.node}
                                    key={nd.id()}
                                    node={nd.node()}
                                    fill={nd.color()}
                                />
                            )
                        })}
                        {this.state.links.set.map((l: string[])=> {
                            return <ForceGraphLink key={`${l[0]}=>${l[1]}`} link={{source: l[0], target: l[1], value: 1}} />
                        })}
                    </InteractiveForceGraph>
            );
        }
    }
);
