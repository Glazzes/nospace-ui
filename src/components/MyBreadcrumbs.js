import React from "react";
import {Breadcrumbs, Typography} from "@material-ui/core";
import {NavigateNext} from "@material-ui/icons";
import {useStyles} from '../styles/BreadcrumbsStyles';

function MyBreadcrumbs({routes, goTo}){
    const classes = useStyles();

    return(
        <Breadcrumbs separator={<NavigateNext/>} aria-label={"Breadcrumbs"} className={classes.breadCrumbGroup}>
            {routes.map((route, index) => <Typography key={index} className={classes.breadCrumb}
            onClick={() => goTo(index)}>{route}</Typography>)}
        </Breadcrumbs>
    )
}

export default MyBreadcrumbs;