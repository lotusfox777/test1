import * as React from 'react';
import WarningModal from 'components/WarningModal';

class DeleteCardGroup extends React.PureComponent {
  render() {
    const { onClose, onDelete, cardgroup } = this.props;
    return (
      <WarningModal
        message="確認刪除群組?"
        onCancel={onClose}
        onDelete={onDelete(cardgroup.id)}
      />
    );
  }
}

export default DeleteCardGroup;
