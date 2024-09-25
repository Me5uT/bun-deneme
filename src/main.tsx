import "./index.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { bindActionCreators } from "redux";

import { ConfigProvider } from "antd";
import enUS from "antd/locale/en_US";
import setupAxiosInterceptors from "app/config/axios-interceptor";
import { loadIcons } from "app/config/icon-loader";
import getStore from "app/config/store";
import ErrorBoundary from "app/shared/error/error-boundary";
import { clearAuthentication } from "app/shared/reducers/authentication";
import dayjs from "dayjs";
import App from "./App";
import { antdTheme } from "./shared/util/theme";

dayjs.locale("en");
const store = getStore();
// dil desteği için kullanılıcak
// registerLocale(store);

const actions = bindActionCreators({ clearAuthentication }, store.dispatch);
setupAxiosInterceptors(() =>
  actions.clearAuthentication("login.error.unauthorized")
);

loadIcons();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <ConfigProvider theme={antdTheme} locale={enUS}>
        <Provider store={store}>
          {/* <GoogleReCaptchaProvider
            reCaptchaKey={SITE_KEY}
            scriptProps={{ appendTo: 'body' }}
            container={{
              parameters: {
                badge: 'inline',
              },
            }}
          > */}
          <App />
          {/* </GoogleReCaptchaProvider> */}
        </Provider>
      </ConfigProvider>
    </ErrorBoundary>
  </StrictMode>
);
