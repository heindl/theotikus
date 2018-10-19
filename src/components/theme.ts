import {createMuiTheme} from "@material-ui/core";
import primaryColor from '@material-ui/core/colors/blueGrey';
import secondaryColor from '@material-ui/core/colors/indigo';
import {ThemeOptions} from "@material-ui/core/styles/createMuiTheme";

export default function createTheme(options?: ThemeOptions) {
    return createMuiTheme({
        palette: {
            primary: primaryColor,
            secondary: secondaryColor,
            type: 'dark',
        },
        typography: {
            useNextVariants: true,
        },
        ...options,
    })
}