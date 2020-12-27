import styled from 'styled-components';

export const RequiredMark = styled.span`
  color: red;
  padding-right: 4px;
  ::after {
    content: '*';
  }
`;
