import { css, createGlobalStyle } from 'styled-components';
import { normalize } from 'polished';
import { map } from 'ramda';
import spaces from './margins';

export const utils = css`
  ${map(
    m =>
      css`
        .mt-${m} {
          margin-top: ${m}px !important;
        }

        .mb-${m} {
          margin-bottom: ${m}px !important;
        }

        .ml-${m} {
          margin-left: ${m}px !important;
        }

        .mr-${m} {
          margin-right: ${m}px !important;
        }

        .-mt-${m} {
          margin-top: -${m}px !important;
        }

        .-mb-${m} {
          margin-bottom: -${m}px !important;
        }

        .-ml-${m} {
          margin-left: -${m}px !important;
        }

        .-mr-${m} {
          margin-right: -${m}px !important;
        }

        .my-${m} {
          margin-top: ${m}px;
          margin-bottom: ${m}px;
        }

        .mx-${m} {
          margin-left: ${m}px;
          margin-right: ${m}px;
        }

        .pt-${m} {
          padding-top: ${m}px !important;
        }

        .pb-${m} {
          padding-bottom: ${m}px !important;
        }

        .pl-${m} {
          padding-left: ${m}px !important;
        }

        .pr-${m} {
          padding-right: ${m}px !important;
        }

        .-pt-${m} {
          padding-top: -${m}px !important;
        }

        .-pb-${m} {
          padding-bottom: -${m}px !important;
        }

        .-pl-${m} {
          padding-left: -${m}px !important;
        }

        .-pr-${m} {
          padding-right: -${m}px !important;
        }

        .py-${m} {
          padding-top: ${m}px;
          padding-bottom: ${m}px;
        }

        .px-${m} {
          padding-left: ${m}px;
          padding-right: ${m}px;
        }

        .min-width--${m} {
          min-width: ${m}px !important;
        }

        .max-width--${m} {
          max-width: ${m}px !important;
        }

        .w${m} {
          width: ${m === 100 ? '100%' : m + 'px'} !important;
        }

        .h${m} {
          height: ${m === 100 ? '100%' : m + 'px'} !important;
        }

        .top-${m} {
          top: ${m}px;
        }

        .-top-${m} {
          top: -${m}px;
        }

        .left-${m} {
          left: ${m}px;
        }
      `,
    spaces,
  )}

  .text--default {
    font-size: 14px !important;
  }

  .text-500 {
    font-weight: 500 !important;
  }

  .text-center {
    text-align: center;
  }

  .text-left {
    text-align: left;
  }

  .text-right {
    text-align: right;
  }

  .text-underline {
    text-decoration: underline;
  }

  .text-ellipsis {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .text-white {
    color: #fff !important;
  }

  .bg-white {
    background: #fff;
  }

  .pull-left {
    float: left;
  }

  .pull-right {
    float: right;
  }

  .cursor--pointer {
    cursor: pointer;
  }
`;
export const components = css`
  .anticon {
    ${p =>
      map(
        x => css`
          &.text-${x} {
            svg {
              font-size: ${x}px !important;
            }
          }
        `,
        p.theme.font,
      )};
  }
`;

export const layout = css`
  .l-flex {
    display: flex;

    &--center {
      display: flex;
      align-items: center;
    }

    &.is--stretch {
      align-items: stretch;
    }

    &.is--center {
      justify-content: center;
    }

    &.is--space-between {
      justify-content: space-between;
    }

    &.is--right {
      justify-content: flex-end;
    }

    &.is--middle {
      align-items: center;
    }

    &.is--column {
      flex-direction: column;
    }
  }

  .d-inline-block {
    display: inline-block;
  }
`;

export default createGlobalStyle`
  ${normalize()};
  ${utils};
  ${components};
  ${layout};
  * {
    font-family: 'LiHei Pro' , Helvetica, 'Microsoft JhengHei', Arial, sans-serif;
  }
`;
