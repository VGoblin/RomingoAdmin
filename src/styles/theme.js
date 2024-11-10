export const theme = {
  palette: {
    mode: 'light',
    primary: {
      main: "#03989E",
    },
    secondary: {
      lighter: "#d9f7fc",
      main: "#a6dbe5",
    },
    success: {
      main: "#ACC966",
    },
    warning: {
      main: "#F9C171",
    },
    info: {
      main: "#F4DAC9"
    },
    error: {
      main: "#BC4749",
    },
    lightBackground: {
      main: "#fcf5f0",
    },
  },
  typography: {
    fontFamily: `"Montserrat", "Montserrat", sans-serif`,
    h1: {
      fontFamily: "Montserrat",
      fontWeight: 900,
    },
    h2: {
      fontFamily: "Montserrat",
      fontWeight: 900,
    },
    h3: {
      fontFamily: "Montserrat",
      fontWeight: 900,
    },
    h4: {
      fontFamily: "Montserrat",
      fontWeight: 900,
    },
    h5: {
      fontFamily: "Montserrat",
      fontWeight: 900,
    },
    h6: {
      fontFamily: "Montserrat",
      fontWeight: 700,
      letterSpacing: 0.5,
    },
    body1: {
      fontFamily: "Roboto",
      fontWeight: 400,
    },
    body2: {
      fontFamily: "Roboto",
      fontWeight: 400,
    },
    subtitle1: {
      fontFamily: "Roboto",
      fontWeight: 400,
    },
    subtitle2: {
      fontFamily: "Roboto",
      fontWeight: 400,
    },
    button: {
      fontFamily: "Roboto",
      fontWeight: 400,
    },
    caption: {
      fontFamily: "Roboto",
      fontWeight: 400,
    },
    overline: {
      fontFamily: "Roboto",
      fontWeight: 400,
    },
  },
  components: {
    MuiGrid: {
      styleOverrides: {
        root: {
          '& .hotelsCard': {
            display: 'flex',  padding: '1rem',
            border: '1px solid #ddd', borderRadius: '12px', maxWidth: "100%", background: '#fff',
            '& .descriptionBox': {
              pb: { xs: '0rem', sm: '0rem'} , pt: { xs: '.5rem', sm: '1rem'}, mt: { md: '0px', sm: '1rem'}, ml: { sm: '0px', xs: '0px'}
            },
            '& .cardTitle': {
              color: "#222", fontFamily: "Montserrat", fontSize: "120%", fontWeight: 800,
            },
            '& .cardSubtitle': {
              overflow: "hidden", fontWeight: 500, whiteSpace: "nowrap", fontFamily: "Roboto", textOverflow: "ellipsis", color: "#999",
            },
          }
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          fontWeight: 600
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          input: { fontWeight: 500 },
          label: { fontWeight: 500 }
        }
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          input: { fontWeight: 500 },
          label: { fontWeight: 500 }
        }
      }
    },
    MuiFormControl: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          input: { fontWeight: 500 },
          label: { fontWeight: 500 }
        }
      }
    },
    MuiListItemText: {
      styleOverrides: {
        root: {
          fontWeight: 500,
        }
      }
    }
  }
};

export const darkTheme = {
  palette: {
    mode: 'dark',
    primary: {
      main: "#03989E",
    },
    secondary: {
      lighter: "#d9f7fc",
      main: "#a6dbe5",
    },
    success: {
      main: "#ACC966",
    },
    warning: {
      main: "#F9C171",
    },
    info: {
      main: "#F4DAC9"
    },
    error: {
      main: "#BC4749",
    },
    background: {
      paper: '#333'
    }
  },
  typography: {
    fontFamily: `"Montserrat", "Montserrat", sans-serif`,
    h1: {
      fontFamily: "Montserrat",
      fontWeight: 900,
    },
    h2: {
      fontFamily: "Montserrat",
      fontWeight: 900,
    },
    h3: {
      fontFamily: "Montserrat",
      fontWeight: 900,
    },
    h4: {
      fontFamily: "Montserrat",
      fontWeight: 900,
    },
    h5: {
      fontFamily: "Montserrat",
      fontWeight: 900,
    },
    h6: {
      fontFamily: "Montserrat",
      fontWeight: 700,
      letterSpacing: 0.5,
    },
    body1: {
      fontFamily: "Roboto",
      fontWeight: 400,
    },
    body2: {
      fontFamily: "Roboto",
      fontWeight: 400,
    },
    subtitle1: {
      fontFamily: "Roboto",
      fontWeight: 400,
    },
    subtitle2: {
      fontFamily: "Roboto",
      fontWeight: 400,
    },
    button: {
      fontFamily: "Roboto",
      fontWeight: 400,
    },
    caption: {
      fontFamily: "Roboto",
      fontWeight: 400,
    },
    overline: {
      fontFamily: "Roboto",
      fontWeight: 400,
    },
  },
  components: {
    MuiGrid: {
      styleOverrides: {
        root: {
          '& .hotelsCard': {
            display: 'flex',  padding: '1rem', border: '1px solid #ddd', borderRadius: '12px', maxWidth: "100%", background: '#ffffff80',
            '& .descriptionBox': {
              pb: { xs: '0rem', sm: '0rem'} , pt: { xs: '.5rem', sm: '1rem'}, mt: { md: '0px', sm: '1rem'}, ml: { sm: '0px', xs: '0px'}
            },
            '& .cardTitle': {
              color: "#222", fontFamily: "Montserrat", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis",fontSize: "120%", fontWeight: 800,
            },
            '& .cardSubtitle': {
              overflow: "hidden", fontWeight: 500, whiteSpace: "nowrap", fontFamily: "Roboto", textOverflow: "ellipsis", color: "#222",
            },
          }
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          fontWeight: 600
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          input: { fontWeight: 500 },
          label: { fontWeight: 500 }
        }
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          input: { fontWeight: 500 },
          label: { fontWeight: 500 }
        }
      }
    },
    MuiFormControl: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          input: { fontWeight: 500 },
          label: { fontWeight: 500 }
        }
      }
    },
    MuiListItemText: {
      styleOverrides: {
        root: {
          fontWeight: 500,
        }
      }
    }
  }
};
