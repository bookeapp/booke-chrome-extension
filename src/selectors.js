export const getPreloaderState = ({ ui: { preloaderShown } }) => preloaderShown;

export const getCurrentView = ({ ui: { currentView } }) => currentView;

export const getPositionY = ({ ui: { positionY } }) => positionY;

export const getCurrentShortCode = ({ ui: { shortCode } }) => shortCode;

export const getCurrentProgress = ({ ui: { currentProgress } }) => currentProgress;

export const getFetchingState = ({ ui: { fetching } }) => fetching;

export const getBookeTransactions = ({ ui: { transactions } }) => transactions;

export const getTexts = ({ texts }) => texts;

export const getBusinessesData = ({ stats: { data } }) => data;

export const getUserData = ({ user: { data } }) => data;
