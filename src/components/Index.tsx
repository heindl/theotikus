import {
  AppBar,
  createStyles,
  CssBaseline,
  Icon,
  SwipeableDrawer,
  Theme,
  Toolbar,
  Typography,
  withStyles,
  WithStyles
} from "@material-ui/core";
import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider";
import * as React from "react";
import { SyntheticEvent } from "react";
import * as logo from "../logo.svg";
import * as backgroundImage from "./background-images/black-wallpaper-dark-galaxy-14676.jpg";
import { Entity } from "./Entity";
import { Graph } from "./Graph";
import createTheme from "./theme";

const styles = (t: Theme) =>
  createStyles({
    entityPanelPaper: {
      // TODO: Move this into theme
      backgroundColor: "rgba(96, 125, 139, 0.5)",
      paddingTop: "4.6rem"
    },
    icon: {
      marginRight: t.spacing.unit * 2
    },
    index: {
      // backgroundColor: "transparent",
      background: `url(${backgroundImage})`,
      backgroundSize: "cover",
      height: "100%",
      position: "fixed",
      width: "100%"
    },
    navBar: {
      // TODO: Move this into theme
      backgroundColor: "rgba(96, 125, 139, 0.5)"
    }
  });

const theme = createTheme();

interface IProps extends WithStyles<typeof styles> {}

interface IState {
  entityId?: string;
  entityPanelVisible: boolean;
}

export const Index = withStyles(styles)(
  class extends React.Component<IProps, IState> {
    constructor(props: IProps) {
      super(props);
      this.state = {
        entityPanelVisible: false
      };
    }

    public selectEntity = (entityId?: string) => {
      this.setState({ entityId });
      this.showEntity();
    };

    public examineClickEvent = (e: SyntheticEvent) => {
      // tslint:disable:no-string-literal
      const clickOccurredInCircle =
        e.target &&
        e.target["tagName"] !== "undefined" &&
        e.target["tagName"] === "circle";

      if (!clickOccurredInCircle && !this.state.entityPanelVisible) {
        this.setState({ entityId: undefined });
      }
    };

    public showEntity = () => {
      this.setState({ entityPanelVisible: true });
    };

    public hideEntity = () => {
      this.setState({ entityPanelVisible: false });
    };

    public render() {
      const { classes } = this.props;

      return (
        <MuiThemeProvider theme={theme}>
          <CssBaseline />
          <div className={classes.index} onClick={this.examineClickEvent}>
            <AppBar elevation={0} className={classes.navBar}>
              <Toolbar>
                <Icon fontSize="large" className={classes.icon}>
                  <img src={logo} />
                </Icon>
                <Typography variant="h6" color="inherit">
                  Theotikus
                </Typography>
              </Toolbar>
            </AppBar>
            <SwipeableDrawer
              open={this.state.entityPanelVisible}
              onClose={this.hideEntity}
              onOpen={this.showEntity}
              classes={{ paper: classes.entityPanelPaper }}
            >
              <Entity entityId={this.state.entityId} />
            </SwipeableDrawer>
            <Graph
              selectEntity={this.selectEntity}
              selectedEntityId={this.state.entityId}
            />
          </div>
        </MuiThemeProvider>
      );
    }
  }
);
