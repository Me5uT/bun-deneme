import { ThemeConfig } from 'antd';

// #0350ad mirket light blue
// #0d2b51 mirket dark blue
export const antdTheme: ThemeConfig = {
  token: { fontFamily: 'Poppins !important', fontSize: 13 },
  components: {
    FloatButton: {
      colorPrimary: '#0d2b51',
      colorPrimaryHover: '#0350ad',
    },
    Button: {
      colorPrimary: '#0d2b51',
      colorPrimaryHover: '#0350ad',
      colorLink: '#0d2b51',
      colorLinkHover: '#0350ad',
      colorIcon: '#0d2b51',
    },
    Radio: {
      buttonSolidCheckedBg: '#0d2b51',
      buttonSolidCheckedHoverBg: '#0350ad',
    },
    Layout: {
      headerBg: 'white',
      headerPadding: '0px',
      siderBg: 'white',
    },
    Table: {
      borderRadius: 10,
      colorTextHeading: '#99a1b7',
      headerBg: 'white',
      headerBorderRadius: 0,
      fontWeightStrong: 700,
    },

    Card: {
      fontWeightStrong: 700,
    },
    Breadcrumb: {
      fontWeightStrong: 700,
    },
    Switch: {
      colorPrimary: '#0DA49F',
      colorPrimaryHover: '#0c8b87',
    },
    Slider: {
      trackBg: '#2cbac5',
      trackHoverBg: '#1e868e',
      handleActiveColor: '#1e868e',
      handleActiveOutlineColor: '#1e868e',
      handleColor: '#2cbac5',
      dotActiveBorderColor: '#1e868e',
      colorPrimaryBorderHover: '#1e868e',
    },
    Steps: {
      colorPrimary: '#0DA49F',
    },
    Checkbox: {
      colorPrimary: '#0DA49F',
      colorPrimaryHover: '#0c8b87',
    },
  },
};
