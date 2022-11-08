export const getPreloaderState = ({ ui: { preloaderShown } }) => preloaderShown;

export const getCurrentView = ({ ui: { currentView } }) => currentView;

export const getTexts = ({ texts }) => texts;

export const getBusinessesData = ({ stats: { data } }) => data;

export const getUserData = ({ user: { data } }) => data;
