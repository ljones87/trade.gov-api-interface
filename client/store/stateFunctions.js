export const success = (state, propToUpdate, receivedData) => {
  return {
    ...state,
    error: null,
    loading: false,
    [propToUpdate]: receivedData
  };
};
