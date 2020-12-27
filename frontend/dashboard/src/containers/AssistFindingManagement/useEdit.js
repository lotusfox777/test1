import React from 'react';
import { find, path } from 'ramda';

export default function useEdit({ content, key = 'id', onToggle }) {
  const [editModalVisible, setEditModalVisible] = React.useState(false);
  const [item, setItem] = React.useState(null);

  const findItem = React.useCallback(
    evt => {
      return find(x => path([key], x) === +evt.currentTarget.dataset['id'])(
        content,
      );
    },
    [content, key],
  );

  const handleModalToggle = evt => {
    if (!evt) {
      return;
    }

    const item = findItem(evt);

    if (!item) {
      setItem(null);
    }

    if (item) {
      setItem(item);
    }

    if (onToggle) {
      onToggle(item);
    }
  };

  const handleEditModalVisible = evt => {
    setEditModalVisible(prev => !prev);
    handleModalToggle(evt);
  };

  return [editModalVisible, handleEditModalVisible, item];
}
