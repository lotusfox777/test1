// TODO: 將這個元件獨立成一個頁面不要綁在 card-list/index 底下，例如 /card-list/6
import * as React from 'react';
import {
  Select,
  Input,
  Icon,
  Breadcrumb,
  Form,
  Row,
  Col,
  List,
  Modal,
  message,
  Avatar,
  Button,
} from 'antd';
import { find, propEq, equals } from 'ramda';
import StyleButton from 'components/Button';
import moment from 'moment';
import Image from 'components/Image';
import { ACTIVITY_MAP } from 'constants/routes';
import {
  Wrapper,
  StyleAvatar,
  StyleAvatarColor,
  StyleCardCol,
  StyleColorPick,
  StyleGuardAreaWrapper,
  StyleSubCtrlList,
  StyleSubCtrlRow,
} from './components';

const FormItem = Form.Item;
const Search = Input.Search;
const Option = Select.Option;
const confirm = Modal.confirm;

function beforeUpload(file) {
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('檔案太大, 請勿超過2MB!');
  }
  return isLt2M;
}

@Form.create()
export default class EditCardModal extends React.PureComponent {
  static defaultProps = {
    card: {
      uuid: '',
      cardName: '',
      memberId: '',
      major: '',
      minor: '',
      colorCode: '',
      guardareaList: [],
      cardAuthorities: [],
    },
  };

  constructor(props) {
    super(props);
    this.state = {
      edit: false,
      imageUrl: null,
      currentCard: {
        cardName: '',
        colorCode: '',
        guardareaList: [],
      },
      editCard: {
        cardName: '',
        colorCode: '',
        guardareaList: [],
      },
    };
  }

  static getDerivedStateFromProps = (nextProps, prevState) => {
    if (!equals(nextProps.card, prevState.currentCard)) {
      const newCard = Object.assign({}, nextProps.card);
      // HOTFIX: guardareaList is null in some cases
      if (!newCard.guardareaList) {
        newCard.guardareaList = [];
      }
      return {
        currentCard: newCard,
        editCard: newCard,
      };
    }

    return null;
  };

  handleViewCardLoaction = () => {
    const { pushState, card, onClose } = this.props;
    onClose();
    pushState(`${ACTIVITY_MAP}?card_id=${card.id}`);
  };

  onSave = () => {
    const { editCard } = this.state;

    const card = {
      id: this.props.card.id,
      cardName: editCard.cardName,
      colorCode: editCard.colorCode,
      guardArea: editCard.guardareaList.map(x => x.id),
    };

    if (editCard.avatarBase64) {
      card.body = new FormData();
      card.body.append('img', editCard.avatar);
    }

    this.props.onUpdateCard(card);
    this.handleCancel();
  };

  inviteSubManager = memberId => {
    if (!memberId) {
      return;
    }

    const { card, form, onAddSubManager } = this.props;
    const errors = form.getFieldError('memberId');
    const hasErrors = Array.isArray(errors) && errors.length > 0;

    if (hasErrors) {
      return;
    }

    onAddSubManager({
      id: card.id,
      uuid: card.uuid,
      memberId,
      major: card.major,
      minor: card.minor,
    });

    form.resetFields();
  };

  deleteSubManager = memberInfo => () => {
    const { onDeleteSubManager, card } = this.props;
    confirm({
      title: '確認要刪除此副管理者帳號?',
      onOk() {
        onDeleteSubManager({
          id: card.id,
          uuid: card.uuid,
          memberId: memberInfo.memberId,
          major: card.major,
          minor: card.minor,
        });
      },
    });
  };

  deleteCard = () => {
    const { onDeleteCard, card } = this.props;
    confirm({
      title: '確認刪除裝置 ?',
      content: '一旦刪除裝置即失去裝置管理權限(包含授權之副管理者)。',
      onOk() {
        onDeleteCard(card.id);
      },
    });
  };

  handleUploadAvatar = ({ file }) => {
    const fileReader = new FileReader();
    fileReader.addEventListener('load', () => {
      this.setState(prevState => ({
        ...prevState,
        editCard: {
          ...prevState.editCard,
          // save raw file
          avatar: file,
          // read as base64 string for reviewing before really upload it.
          avatarBase64: fileReader.result,
        },
      }));
    });
    fileReader.readAsDataURL(file);
  };

  //回個人名單
  handleClick = () => {
    this.props.onClose();
  };

  //編輯模式
  handleEdit = () => {
    this.setState({ edit: true });
  };

  handleCancel = () => {
    this.setState({ edit: false, editCard: this.state.currentCard });
  };

  //選擇守護區域
  handleChangeGuardArea = (values, option) => {
    const { allGuardAreas } = this.props;

    this.setState(prevState => ({
      ...prevState,
      editCard: {
        ...prevState.editCard,
        guardareaList: values.map(id => find(propEq('id', +id))(allGuardAreas)),
      },
    }));
  };

  onChangeName = e => {
    const cardName = e.target.value;
    this.setState(prevState => ({
      ...prevState,
      editCard: {
        ...prevState.editCard,
        cardName,
      },
    }));
  };

  onClickColorPick = colorCode => () => {
    this.setState(prevState => ({
      ...prevState,
      editCard: {
        ...prevState.editCard,
        colorCode,
      },
    }));
  };

  renderColorPicks = () => {
    const colors = ['#f5b243', '#83bf6f', '#ff7e7e', '#a774d3', '#126ab4'];
    const card = this.state.editCard;
    return (
      <StyleColorPick>
        {colors.map((c, idx) => {
          const focus = card.colorCode === c ? 'focus' : null;
          return (
            <div
              key={idx}
              className={focus}
              style={{ backgroundColor: c }}
              onClick={this.onClickColorPick(c)}
            />
          );
        })}
      </StyleColorPick>
    );
  };

  renderGuardArea = () => {
    const { editCard } = this.state;
    return (
      <StyleGuardAreaWrapper>
        {editCard.guardareaList.map((area, idx) => (
          <div key={idx}>{area.name}</div>
        ))}
      </StyleGuardAreaWrapper>
    );
  };

  renderSelectGuardArea = () => {
    const { allGuardAreas } = this.props;
    const { editCard } = this.state;
    const guardAreaIds = editCard.guardareaList.map(x => String(x.id));

    return (
      <Select
        mode="multiple"
        style={{ width: '100%' }}
        placeholder="選取守護區域"
        defaultValue={guardAreaIds}
        onChange={this.handleChangeGuardArea}>
        {allGuardAreas.map(x => (
          <Option key={x.id} value={String(x.id)}>
            {x.name}
          </Option>
        ))}
      </Select>
    );
  };

  render() {
    const { edit, editCard } = this.state;
    const {
      card,
      isLoading,
      isDeleting,
      isUpdating,
      form: { getFieldDecorator },
      onClose,
    } = this.props;

    return (
      <Wrapper>
        <React.Fragment>
          <Breadcrumb>
            <Breadcrumb.Item
              style={{ cursor: 'pointer', textDecoration: 'underline' }}
              onClick={onClose}>
              個人名單
            </Breadcrumb.Item>
            <Breadcrumb.Item>{card.uuid}</Breadcrumb.Item>
          </Breadcrumb>
          <Row className="mt38">
            <Col span={4}>
              <StyleAvatarColor>
                <StyleAvatar
                  name="avatar"
                  accept="image/*"
                  listType="picture-card"
                  className="avatar-uploader"
                  showUploadList={false}
                  multiple={false}
                  disabled={!edit}
                  beforeUpload={beforeUpload}
                  customRequest={this.handleUploadAvatar}>
                  {(() => {
                    if (editCard.avatarBase64) {
                      return <img src={editCard.avatarBase64} alt="avatar" />;
                    }
                    if (editCard.avatar) {
                      return (
                        <Image
                          ref={c => (this.userAvatar = c)}
                          width="110"
                          height="110"
                          name={editCard.avatar}
                          alt="avatar"
                          // withDot={editCard.colorCode}
                        />
                      );
                    }
                    return <Avatar shape="circle">{card.cardName}</Avatar>;
                  })()}
                  {edit ? (
                    <div className="uploadBtn">
                      <Icon type="camera-o" />
                    </div>
                  ) : (
                    !isLoading && (
                      <div
                        className="colorPick"
                        style={{
                          backgroundColor: editCard.colorCode || '#f5b243',
                        }}
                      />
                    )
                  )}
                </StyleAvatar>
              </StyleAvatarColor>
            </Col>
            <StyleCardCol span={16} className="ml15">
              <Row>
                <Col style={{ color: '#79abe5' }}>
                  {card.uuid}
                  <span className="ml20 text-grey font-size-sm">Major ({card.major})</span>
                  <span className="ml20 text-grey font-size-sm">Minor ({card.minor})</span>
                </Col>
              </Row>
              <Row style={{ color: '#9b9b9b' }}>
                <Col span={4}>裝置期限</Col>
                <Col>{moment(card.expireTime).format('YYYY.MM.DD')}</Col>
              </Row>
              <Row className="row--flex">
                <Col span={4}>名稱 </Col>
                <Col span={20}>
                  {edit ? (
                    <Input
                      type="text"
                      defaultValue={editCard.cardName}
                      onChange={this.onChangeName}
                    />
                  ) : (
                    card.cardName
                  )}
                </Col>
              </Row>
              {edit ? (
                <Row>
                  <Col span={4}>標籤顏色 </Col>
                  <Col>{this.renderColorPicks()}</Col>
                </Row>
              ) : null}
              <Row className="row--flex mb39">
                <Col span={4}>守護區域 </Col>
                <Col span={18}>{edit ? this.renderSelectGuardArea() : this.renderGuardArea()}</Col>
              </Row>
              <Row>
                <Col>
                  {edit ? (
                    <div>
                      <StyleButton
                        className="font-size-md mr-3--percent"
                        text="取消"
                        onClick={this.handleCancel}
                      />
                      <StyleButton
                        className="font-size-md"
                        type="darkblue"
                        text="確認"
                        onClick={this.onSave}
                      />
                    </div>
                  ) : (
                    <div>
                      <StyleButton
                        className="font-size-md mr-3--percent"
                        text="動態查詢"
                        onClick={this.handleViewCardLoaction}
                      />
                      <StyleButton
                        type="darkblue"
                        className="font-size-md"
                        text="編輯"
                        onClick={this.handleEdit}
                      />
                    </div>
                  )}
                </Col>
              </Row>
            </StyleCardCol>
          </Row>
          <StyleSubCtrlRow className="mb92">
            <hr />
            <Col>
              <div className="title_01">新增副管理者</div>
              <div className="title_02">傳送副管理者授權連結，副管理者將可查看該裝置人員之動向</div>
            </Col>
            <Col span={16}>
              <Form>
                <FormItem>
                  {getFieldDecorator('memberId', {
                    rules: [{ type: 'email', message: 'E-mail格式不合' }],
                  })(
                    <Search
                      placeholder="請輸入副管理者 email"
                      enterButton={
                        <Button type="primary" loading={isUpdating} onClick={this.inviteSubManager}>
                          發送邀請
                        </Button>
                      }
                      onSearch={this.inviteSubManager}
                    />,
                  )}
                </FormItem>
              </Form>
            </Col>
            <Col span={24} className="title_03">
              副管理者名單
            </Col>
            <Col span={24}>
              <StyleSubCtrlList
                dataSource={card.cardAuthorities}
                loading={isLoading || isDeleting}
                renderItem={sub => (
                  <List.Item>
                    <Col span={12}>{sub.memberInfo.memberId}</Col>
                    <Col span={6}>
                      {sub.status === 0 ? '已發送授權' : null}
                      {sub.status === 1 ? '接受邀請' : null}
                    </Col>
                    <Col span={6}>
                      <a onClick={this.deleteSubManager(sub.memberInfo)}>
                        {sub.status === 0 ? '取消' : null}
                        {sub.status === 1 ? '刪除' : null}
                      </a>
                    </Col>
                  </List.Item>
                )}
              />
            </Col>
          </StyleSubCtrlRow>
          <div className="mb92">
            <StyleButton
              type="red"
              text="刪除裝置"
              className="font-size-md"
              onClick={this.deleteCard}
            />
          </div>
        </React.Fragment>
      </Wrapper>
    );
  }
}
