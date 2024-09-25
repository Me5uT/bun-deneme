import { ReducersMapObject } from "@reduxjs/toolkit";
// import { loadingBarReducer as loadingBar } from 'react-redux-loading-bar';

import applicationProfile from "./application-profile";
import authentication from "./authentication";
import locale from "./locale";

import entitiesReducers from "../../entities/reducers";
import passwordReset from "../../modules/account/password-reset/password-reset.reducer";
import password from "../../modules/account/password/password.reducer";
import administration from "../../modules/administration/administration.reducer";
/* jhipster-needle-add-reducer-import - JHipster will add reducer here */

const rootReducer: ReducersMapObject = {
  authentication,
  locale,
  applicationProfile,
  administration,
  passwordReset,
  password,
  /* jhipster-needle-add-reducer-combine - JHipster will add reducer here */
  ...entitiesReducers,
};

export default rootReducer;
