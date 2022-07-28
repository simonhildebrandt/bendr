import React from 'react';

const useAnimationFrame = callback => {
  const requestRef = React.useRef();

  const animate = () => {
    callback();
    requestRef.current = requestAnimationFrame(animate);
  }

  React.useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, []);
}

export default useAnimationFrame;
