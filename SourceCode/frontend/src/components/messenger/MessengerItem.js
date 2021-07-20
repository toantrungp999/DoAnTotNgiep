import React, { Component, memo } from 'react';
import { time_ago } from '../../extentions/ArrayEx'

class MessengerItem extends Component {

    render() {
        const { messenger, userId, isMeSend } = this.props;

        const isMessengerItemToAdmin = (!messenger.user1 || messenger.user1._id !== userId) && (!messenger.user2 || messenger.user2._id !== userId) ? true : false;

        return (<div className="row messenger-item" onClick={() => this.props.openDetailMessenger(this.props.index, messenger.user1._id === userId ? messenger.user2 : messenger.user1)}>
            <div style={{ width: '20%' }}>
                {isMessengerItemToAdmin ?
                    <img alt="messenger-avatar" className="messenger-avatar" src={messenger.user1 ? messenger.user1.image : messenger.user2.image}></img> :
                    <img alt="messenger-avatar" className="messenger-avatar" src={!messenger.user1 || !messenger.user2 ? "/CSKH.jpg" : (messenger.user1._id === userId ? messenger.user2.image : messenger.user1.image)}></img>
                }
            </div>
            <div className="messenger-content" style={!isMeSend && messenger.check === false ? { fontWeight: 'bold' } : {}}>
                <div>
                    {isMessengerItemToAdmin ?
                        <div>
                            <span className="messenger-user-name">{messenger.user1 ? messenger.user1.name : messenger.user2.name}</span>
                            <span className="is-system">Tin nhắn hệ thống</span>
                        </div> :
                        <span className="messenger-user-name">{!messenger.user1 || !messenger.user2 ? "Chăm sóc khác hàng" : (messenger.user1._id === userId ? messenger.user2.name : messenger.user1.name)}</span>
                    }

                </div>
                <div>
                    <span className="messenger-message">
                        <span>{isMeSend ? 'Bạn: ' : ''}{messenger.messages[messenger.messages.length - 1].content.msg}</span>
                        <span> · </span>
                        <span>{time_ago(messenger.date)}</span>
                    </span>
                </div>
            </div>
        </div>);
    }
}

export default memo(MessengerItem);
