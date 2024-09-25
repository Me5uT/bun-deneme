import React from 'react';

const useFirstRender = () => {
  const isFirstRender = React.useRef(true);

  React.useEffect(() => {
    isFirstRender.current = false;
  }, []);

  return isFirstRender.current;
};

export default useFirstRender;
