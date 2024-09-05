const getDesignTokens = (mode) => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          primary: {
            main: '#1e212c'
          },

          // divider: '#795548',

          background: {
            default: '#efefef',
            paper: '#fafafa'
          },

          gradient: {
            main: 'linear-gradient(to right, #2980b9, #6dd5fa, #ffffff)',
            secondary:
              'linear-gradient(90deg, rgba(78,25,77,1) 0%, rgba(57,13,69,1) 0%, rgba(110,104,113,1) 50%, rgba(61,54,86,1) 100%, rgba(73,170,133,1) 100%, rgba(0,255,124,1) 100%, rgba(255,255,255,1) 100%)',
            teritiary: ' radial-gradient(circle, rgba(14,29,5,1) 77%, rgba(78,25,77,1) 96%)',
            track: 'linear-gradient(to right, #1a2a6c, #b21f1f, #9d9b0d)',
            mainChannel: '0 0 0',
            light: 'linear-gradient(135deg, #4aaffd 0%, #4992f8 100%)',
            lightChannel: '0 0 0',
            dark: 'linear-gradient(135deg, #4cc2ff 0%, #4aa0fa 100%)',
            darkChannel: '0 0 0',
            contrastText: '#fff',
            contrastTextChannel: '0 0 0'
          }
        }
      : {
          // palette values for dark mode

          gradient: {
            main: 'linear-gradient(to right, #3a6186, #89253e)',
            secondary:
              'linear-gradient(90deg, rgba(78,25,77,1) 0%, rgba(57,13,69,1) 0%, rgba(110,104,113,1) 50%, rgba(61,54,86,1) 100%, rgba(73,170,133,1) 100%, rgba(0,255,124,1) 100%, rgba(255,255,255,1) 100%)',
            teritiary: 'radial-gradient(circle, rgba(14,29,5,1) 77%, rgba(78,25,77,1) 96%)',
            mainChannel: '0 0 0',
            track: 'linear-gradient(to right, #1a2a6c, #b21f1f, #fdbb2d)',
            lightChannel: '0 0 0',
            dark: 'linear-gradient(135deg, #4cc2ff 0%, #4aa0fa 100%)',
            darkChannel: '0 0 0',
            contrastText: '#fff',
            contrastTextChannel: '0 0 0'
          }
        })
  }
});

export default getDesignTokens;
