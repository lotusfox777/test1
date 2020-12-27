import React from 'react';

const MarkerContext = React.createContext();

export function MarkerProvider({ children }) {
  const [markers, setMarkers] = React.useState({});

  React.useEffect(() => {
    fetch('/fontawesome-markers.json')
      .then(response =>
        response.json().then(json => ({
          json,
          response,
        })),
      )
      .then(({ json, response }) => {
        if (!response.ok) {
          return Promise.reject(json);
        }

        setMarkers(json);
      })
      .catch(error => console.log(error));
  }, []);

  const state = React.useMemo(() => ({ fa: markers }));

  return (
    <MarkerContext.Provider value={state}>{children}</MarkerContext.Provider>
  );
}

export function withIcon(WrappedComponent) {
  return props => (
    <MarkerContext.Consumer>
      {value => <WrappedComponent {...props} {...value} />}
    </MarkerContext.Consumer>
  );
}
