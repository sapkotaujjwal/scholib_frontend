import React from "react";
import { Route, Switch } from "react-router-dom";
import Navbar1 from "./Navbar1";
import MetaData from "../layout/MetaData";
import Scholib_home from "./Scholib_home";
import Footer1 from "./Footer1";
import "./scholib.scss";
import NotFound from "../layout/NotFound";
import Scholib_about from "./Scholib_about";

import { useSelector } from "react-redux";
import Error from "../layout/error";
import Loading from "../layout/loading";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const Scholib = () => {
  const history = useHistory();

  const loading = useSelector((state) => state.Scholib.loading);
  const scholib = useSelector((state) => state.Scholib.scholib.payload);
  const error = useSelector((state) => state.Scholib.error.payload);

  const user = useSelector((state) => state.User.user.payload);

  if (user) {
    history.push(`/school/${user.schoolCode}/updates`);
  }else{
    window.location = 'https://scholib.com/login.html'
  }

  return (
    <div>
      {loading && <Loading />}
      {error && <Error status={error.status} message={error.message} />}

      {scholib && !error && !loading && (
        <div className="main">
          <MetaData title={"Scholib || Management System for schools"} />
          <Navbar1 />

          <Switch>
            <Route exact path="/" component={Scholib_home} />
            <Route exact path="/about" component={Scholib_about} />
            <Route path="" component={NotFound} />
          </Switch>

          <Footer1 />
        </div>
      )}
    </div>
  );
};

export default Scholib;
