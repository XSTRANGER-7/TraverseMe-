
import React from 'react';
import styled from 'styled-components';

const StyledText = styled.h1`
  font-size: 11rem;
  font-weight: bold;
  color: transparent;
  -webkit-text-stroke: 0.09rem white; 
  opacity: 0.1;
  text-stroke: 10px white; /* For browsers that support the standard property */
`;

const StrokeText = () => {
  return (
    <div className='bg-gradient-to-b from-black via-lightDark2 to-black'>

      <StyledText className='text-center'>TraverseMe</StyledText>
    </div>
  );
};

export default StrokeText;