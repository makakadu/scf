const darkBackgroundPaper = '#424242'
const darkBackground = '#303030'//'#222'
const lightBackground = '#ededed'

let themeObject = {
  props: {
    // Name of the component

    MuiCard: {
      elevation: 1
    },
    MuiPaper: {
      elevation: 1
    },
    MuiSkeleton: {
      animation: "wave"
    },

  },
  overrides: {
//    MuiSkeleton: {
//      root: {
//      }
//    },
    MuiButton: {
      root: {
        textTransform: 'none',
      },
      text: {
        //color: 'blue'
      }
    },
    MuiButtonBase: {
      text: {
        //textTransform: 'none'
      }
    },
    MuiTab: {
      textColorInherit: {
        textTransform: 'none'
      }
    },
    MuiSvgIcon: {
      // По умолчанию значения указаны в rem, а я не хочу, чтобы при увеличении текста увеличивались иконки
      root: {
        fontSize: '24px'
      },
      fontSizeSmall: {
        fontSize: '16px'
      },
      fontSizeLarge: {
        fontSize: '32px'
      }
    }
  },
  // breakpoints: {
  //   values: {
  //     xs: 0,
  //     sm: 600,
  //     md: 900,
  //     lg: 1280,
  //     xl: 1920,
  //   },
  // },
  palette: {
    // primary: {
    //   main: blue[700]//themeIsLight ? blueColor : white 
    // },
    // secondary: {
    //   main: orange['600']//themeIsLight ? red : orange 
    // },
     background: {
      //'default': themeIsLight ? lightBackground : darkBackground,
      //paper: themeIsLight ? '#fff' : '#303030'
     },
    common: {
      // textPrimary: white,
      // textSecondary: 'rgba(255, 255, 255, 0.7)',
      //paper: darkBackgroundPaper,
      halfTransparentPaper: 'rgba(0,0,0, 0.4)',
      halfTransparentPaperHover: 'rgba(66,66,66, 0.4)',
      textSmallDarkShadow: `-1px -1px 2px ${darkBackgroundPaper}, ` +
                                 ` 0px -1px 2px ${darkBackgroundPaper}, ` +
                                 ` 1px -1px 2px ${darkBackgroundPaper}, ` +
                                 `-1px  1px 2px ${darkBackgroundPaper}, ` +
                                 ` 0px  1px 2px ${darkBackgroundPaper}, ` +
                                 ` 1px  1px 2px ${darkBackgroundPaper}`,
      textLightLargeShadow: '-1px -1px 6px #424242, 0px -1px 6px #424242, 1px -1px 6px '
        + '#424242, -1px 1px 6px #424242, 0px 1px 6px #424242, 1px 1px 6px #424242'
      //button: 
    },
    //tonalOffset: 10,
  },
  // typography: {
  //   //fontSize: 13.5,
  //   //htmlFontSize: 16
  // },
  styles: {
    twoDimensionsCentering: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    flexColumn: {
      display: 'flex',
      flexDirection: 'column'
    },
    flexColumnCenter: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    },
    flexColumnScratch: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'scratch'
    },
    flexCenter: {
      display: 'flex',
      justifyContent: 'center',
    },
    flexRowAlignCenter: {
      display: 'flex',
      alignItems: 'center'
    }
  },
  withPercents: number => `${number}%`
}

const getThemeObject = (themeIsDark) => {
  let themeType = themeIsDark ? 'dark' : 'light'
  themeObject.palette.type = themeType
  let themeIsLight = themeObject.palette.type === 'light'
  themeObject.palette.background.default = themeIsLight ? lightBackground : darkBackground // Почему-то без этого в светлой теме неправильный цвет заднего плана

  return themeObject
}

export default getThemeObject

// const useDarkMode = (themeType) => { // https://egghead.io/lessons/react-create-a-react-hook-to-toggle-between-light-and-dark-mode-inside-of-material-ui-themes
//   themeType = themeType === null ? 'dark' : (themeType ? 'dark' : 'light')
//   themeObject.palette.type = themeType
//   let themeIsLight = themeObject.palette.type === 'light'
//   themeObject.palette.background.default = themeIsLight ? lightBackground : darkBackground

//   const [themeWithDarkMode, setThemeWithDarkMode] = React.useState(themeObject) // устанавливается начальное значение, то есть объект themeObject, который задекларирован выше

//   const {palette: {type}} = themeWithDarkMode // извлекается type, то есть значение 'dark' либо 'light'
//   const {palette: {background}} = themeWithDarkMode

//   themeIsLight = type === 'light' // themeIsLight - содержит булевое значение

//   const toggleDarkMode = () => { // функция, которую вызывают когда нужно переключить тёмный режим на светлый и наоборот. При вызове toggleDarkMode const {palette: {type}} и const {palette: {background}} инициализируются заново, то есть type и background являются актуальными
//     // если сейчас светлая тема, то значение type - это 'light' 
//     const updatedTheme = { // новый объект темы, который заменит старый 
//       ...themeWithDarkMode, // копируем старый объект темы в новый
//       palette: { // затем допиливаем старый объект новыми значениями
//         ...themeWithDarkMode.palette,
//         background: {
//           default: type === 'light' ? darkBackground : lightBackground,
//           //paper: type === 'light' ? '#303030' : '#fff'
//         },
//         // primary: {
//         //   main: themeIsLight ? white : blueColor
//         // },
//         // secondary: {
//         //   main: themeIsLight ? orange : red
//         // },
//         type: themeIsLight ? 'dark' : 'light',
//       },
//       overrides: {
// //        MuiSkeleton: {
// //          root: {
// //            backgroundColor: themeWithDarkMode.palette.text.primary
// //          }
// //        },
//         //MuiInputBase: {
//          // input: {
// //            '&:-webkit-autofill': {
// //              background: 'red'
// //            },
//          // },
//        // },
//       },
//     }
//     setThemeWithDarkMode(updatedTheme) // После этого themeWithDarkMode изменяется, что приводит к перерисовке компонентов, которые зависят от themeWithDarkMode, в этому случае - это компонент App 
//   }
//   return [themeWithDarkMode, toggleDarkMode]
// }