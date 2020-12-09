const { createMuiTheme } = require("@material-ui/core");
const { blue } = require("@material-ui/core/colors");

export const theme = createMuiTheme({
    palette: {
        primary: {
            main: blue[900]
        } 
    }
});