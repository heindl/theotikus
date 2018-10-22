import {
  createStyles,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Theme,
  Typography,
  withStyles,
  WithStyles
} from "@material-ui/core";
import * as React from "react";
import { GlobalLogger } from "../utils/logging";
import { fetchEntity, IEntity } from "../wikidata/entity";

const styles = (t: Theme) =>
  createStyles({
    a: {
      color: t.palette.text.primary,
      textDecoration: "none"
    },
    root: {
      marginTop: t.spacing.unit * 3,
      overflowX: "auto",
      width: "100%"
    },
    table: {},
    tableCell: {
      borderColor: "transparent"
    }
  });

interface IProps extends WithStyles<typeof styles> {
  entityId?: string;
}

interface IState {
  entity: IEntity;
}

export const Entity = withStyles(styles)(
  class extends React.Component<IProps, IState> {
    constructor(props: IProps) {
      super(props);
      this.loadEntity(this.props.entityId);
    }

    public componentDidUpdate(lastProps: IProps) {
      if (
        lastProps.entityId === this.props.entityId ||
        this.props.entityId === this.state.entity.id
      ) {
        return;
      }

      this.loadEntity(this.props.entityId);
    }

    public loadEntity(entityId?: string) {
      if (!entityId || entityId === "") {
        this.setState({});
        return;
      }

      fetchEntity(entityId)
        .then(entity => {
          this.setState({ entity });
        })
        .catch(GlobalLogger.Error);
    }

    public render() {
      const { classes } = this.props;

      if (!this.state || !this.state.entity) {
        return <div>Loading</div>;
      }

      return (
        <Table className={classes.table}>
          <TableBody>
            <TableRow>
              <TableCell
                component="th"
                scope="row"
                className={classes.tableCell}
              >
                <Typography variant="h5">
                  <a
                    target="_blank"
                    className={classes.a}
                    href={`https://www.wikidata.org/wiki/${
                      this.state.entity.id
                    }`}
                  >
                    {this.state.entity.label}
                  </a>
                </Typography>
              </TableCell>
            </TableRow>
            {this.state.entity.data.map(e => {
              return (
                <TableRow key={e.pLabel + "_" + e.vLabel}>
                  <TableCell
                    component="th"
                    scope="row"
                    className={classes.tableCell}
                  >
                    {e.pLabel}
                  </TableCell>
                  <TableCell className={classes.tableCell}>
                    {e.vLabel}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      );
    }
  }
);
