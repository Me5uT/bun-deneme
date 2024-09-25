import { ReducersMapObject } from '@reduxjs/toolkit';
// import { loadingBarReducer as loadingBar } from 'react-redux-loading-bar';

import applicationProfile from './application-profile';
import authentication from './authentication';
import locale from './locale';

import entitiesReducers from 'app/entities/reducers';
import passwordReset from 'app/modules/account/password-reset/password-reset.reducer';
import password from 'app/modules/account/password/password.reducer';
import administration from 'app/modules/administration/administration.reducer';
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
