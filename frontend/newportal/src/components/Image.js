import React, { PureComponent } from 'react';
import { Modal, Icon } from 'antd';
import Cookies from 'js-cookie';
import { API_ROOT } from 'constants/endpoint';

export default class Image extends PureComponent {
  static defaultProps = {
    style: {},
    shape: 'circle'
  };

  state = {
    loading: false,
    base64Url: null,
    name: null
  };

  loadImage = () => {
    const { name } = this.props;

    if (!name) {
      return;
    }

    this.setState({ loading: true });
    this.xhr = new XMLHttpRequest();

    const xhr = this.xhr;
    xhr.responseType = 'blob';
    xhr.open('GET', `${API_ROOT}/v1/file/${name}`);
    xhr.setRequestHeader(
      'Authorization',
      `Bearer ${Cookies.get('_dplusToken')}`
    );
    xhr.send();

    xhr.onload = () => {
      if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
        const objectURL = URL.createObjectURL(xhr.response);
        if (objectURL) {
          this.setState({ base64Url: objectURL });
        }
        this.setState({ loading: false });
      }
    };
  };

  isLoaded = () => !this.state.loading;

  componentDidMount = () => {
    this.loadImage();
  };

  componentDidUpdate = (prevProps, prevState) => {
    if (prevProps.name !== this.props.name) {
      this.loadImage();
    }
  };

  componentWillUnmount = () => {
    this.xhr.abort && this.xhr.abort();
  };

  handleOpenImage = () => {
    if (this.img.src) {
      Modal.info({
        width: '50%',
        title: '',
        content: (
          <img
            height="auto"
            width="100%"
            alt={this.props.name}
            src={this.img.src}
          />
        ),
        onOk() {}
      });
    }
  };

  render() {
    const { style, shape, alt, ...rest } = this.props;
    const { loading, base64Url } = this.state;

    const styles = {
      ...style,
      cursor: 'pointer',
      objectFit: 'cover',
      ...(shape === 'circle' ? { borderRadius: '50%' } : {})
    };

    if (!loading && base64Url) {
      return (
        <img
          {...rest}
          ref={c => (this.img = c)}
          src={base64Url}
          onClick={this.handleOpenImage}
          alt={alt || 'dplus-image'}
          style={styles}
        />
      );
    }

    if (loading) {
      return <Icon spin type="loading-3-quarters" />;
    }

    return null;
  }
}
