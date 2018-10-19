import {
    AppBar,
    createStyles,
    CssBaseline, Icon,
    Theme,
    Toolbar,
    Typography,
    withStyles,
    WithStyles
} from "@material-ui/core";
import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider";
import * as React from 'react';
import * as logo from '../logo.svg';
import * as backgroundImage from './background-images/black-wallpaper-dark-galaxy-14676.jpg';
import {Graph} from './Graph';
import createTheme from "./theme";

const styles = (t: Theme) => createStyles({
    icon: {
        marginRight: t.spacing.unit * 2
    },
    index: {
        // backgroundColor: "transparent",
        background: `url(${backgroundImage})`,
        backgroundSize: "cover",
        height: "100%",
        position: "fixed",
        width: "100%",

    },
    // TODO: Move this into theme
    navBar: {
        backgroundColor: "rgba(96, 125, 139, 0.5)"
    },

});

const theme = createTheme();

interface IProps extends WithStyles<typeof styles>  {}

export const Index = withStyles(styles)(
    class extends React.Component<IProps, {}> {

      public render() {

          const {classes} = this.props;

        return (
            <MuiThemeProvider theme={theme} >
            <CssBaseline/>
              <div className={classes.index}>
                  <AppBar elevation={0} className={classes.navBar}>
                      <Toolbar>
                          <Icon fontSize="large" className={classes.icon}><img src={logo}/></Icon>
                          <Typography variant="h6" color="inherit">
                              Theotikus
                          </Typography>
                      </Toolbar>
                  </AppBar>
                  <Graph/>
              </div>
            </MuiThemeProvider>
        );
      }
    }
);