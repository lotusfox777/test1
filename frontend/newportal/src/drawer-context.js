import React from 'react';

export const DrawerContext = React.createContext({
  generalDrawerVisible: true,
  detailDrawerVisible: false,
  cardActivitiesVisible: false,
  accountModalVisible: false,
  onDrawerVisible: () => {},
  onAccountModalVisible: () => {},
});

export class DrawerProvider extends React.PureComponent {
  constructor(props) {
    super(props);

    this.handleDrawerVisible = drawerVisible => {
      this.setState({ ...drawerVisible });
    };

    this.handleAccountModalVisible = accountModalVisible => {
      this.setState({ accountModalVisible });
    };

    this.state = {
      generalDrawerVisible: true,
      detailDrawerVisible: false,
      cardActivitiesVisible: false,
      accountModalVisible: props.accountModalVisible || false,
      onDrawerVisible: this.handleDrawerVisible,
      onAccountModalVisible: this.handleAccountModalVisible,
    };
  }

  render() {
    return <DrawerContext.Provider {...this.props} value={this.state} />;
  }
}

export function withDrawer(WrappedComponent) {
  return props => (
    <DrawerContext.Consumer>
      {value => <WrappedComponent {...props} {...value} />}
    </DrawerContext.Consumer>
  );
}
