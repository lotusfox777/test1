import styled, { css } from 'styled-components';

export const Flex = styled.div.attrs(props => ({
  center: props.center,
  middle: props.middle,
}))`
  display: flex;

  ${p =>
    p.middle &&
    css`
      align-items: center;
    `};

  ${p =>
    p.center &&
    css`
      justify-content: center;
    `};

  ${p =>
    p['space-between'] &&
    css`
      justify-content: space-between;
    `};
`;
