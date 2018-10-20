import {createStyles, Theme, withStyles, WithStyles} from "@material-ui/core";
import * as React from 'react';
import {SyntheticEvent} from "react";
import {ForceGraphLink, ForceGraphNode, ILink, INode, InteractiveForceGraph} from 'react-vis-force';
import {GlobalLogger} from "../utils/logging";
import {fetchPeople} from "../wikidata/people";
import {IWikiNode} from "../wikidata/wikidata";

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
    selectEntity(entityId?: string): void
}

interface IState{
    links: Map<string, ILink>,
    nodes: Map<string, IWikiNode>
}

export const Graph = withStyles(styles)(
    class extends React.Component<IProps, IState> {

        constructor(props: IProps) {
            super(props);
            fetchPeople().then((s) => {
                this.setState({nodes: s.nodes, links: s.links})
            }).catch(GlobalLogger.Error);
        }

        public selectNode = (e: SyntheticEvent, nd: INode) => {
            this.props.selectEntity(nd.id)
        };

        public deselectNode = (e: SyntheticEvent, nd: INode) => {
            this.props.selectEntity("")
        };

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
                            alpha: 1,
                            animate: true,
                            draggable: true
                        }}
                        onSelectNode={this.selectNode}
                        onDeselectNode={this.deselectNode}
                        zoom={true}
                    >
                        {Array.from(this.state.nodes.values()).map((nd: IWikiNode)=> {
                            return (
                                <ForceGraphNode
                                    className={classes.node}
                                    key={nd.id()}
                                    node={nd.node()}
                                    fill={nd.color()}
                                />
                            )
                        })}
                        {Array.from(this.state.links.values()).map((l: ILink)=> {
                            return <ForceGraphLink key={`${l.source}=>${l.target}`} link={l} />
                        })}
                    </InteractiveForceGraph>
            );
        }
    }
);
