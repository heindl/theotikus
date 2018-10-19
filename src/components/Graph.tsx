import {createStyles, Theme, withStyles, WithStyles} from "@material-ui/core";
import * as React from 'react';
import {ForceGraphLink, ForceGraphNode, ILink, InteractiveForceGraph} from 'react-vis-force';
import {fetchPeople, IFetchResponse, IWikiNode} from "../sparql/wikidata";

const styles = (_: Theme) => createStyles({
    '@global': {
        'text': {
            fill: "#fff",
            fontSize: "1em"
        },
    },
    node: {
            strokeWidth: 0,
    },
});

interface IProps extends WithStyles<typeof styles>  {}

export const Graph = withStyles(styles)(
    class extends React.Component<IProps, IFetchResponse> {

        constructor(props: IProps) {
            super(props);
            fetchPeople()
                .then((res) => {
                    this.setState({links: res.links, nodes:res.nodes})
                }).catch(
                    // tslint:disable:no-console
                    console.error
            );
        }

        public render() {

            const {classes} = this.props;

            if (!this.state || !this.state.nodes) {
                return <div className="App"/>
            }

            return (
                    <InteractiveForceGraph
                        labelAttr="label"
                        highlightDependencies={true}
                        simulationOptions={{
                            animate: true,
                        }}
                    >
                        {Array.from(this.state.nodes.values()).map((n: IWikiNode)=> {
                            return <ForceGraphNode className={classes.node} key={n.id()} node={n.node()} fill={n.color()} />
                        })}
                        {Array.from(this.state.links.values()).map((l: ILink)=> {
                            return <ForceGraphLink key={`${l.source}=>${l.target}`} link={l} />
                        })}
                    </InteractiveForceGraph>
            );
        }
    }
)
