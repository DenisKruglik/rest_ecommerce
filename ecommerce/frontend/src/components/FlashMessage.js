import React, { Component } from 'react';
import { connect } from 'react-redux';
import { removeFlashMessage } from 'redux-flash-messages';

export class FlashMessage extends Component {

  onFlashMessageClick(flashMessage) {
    /*
      Make sure the onClick is called when a user clicks
      on the flash message.

      Otherwise callbacks on Flash Messages will not work.
    */
    flashMessage.onClick(flashMessage);

    // This implementation deletes the flash message when it is clicked.
    this.props.dispatch(removeFlashMessage(flashMessage.id));
  }

  render() {
    const messages = this.props.messages;

    return (
      <div>
        { messages.map((message) => this.renderMessage(message))}
      </div>
    );
  }

  /*
    This renders a rather simple flash message.

    But you could and should use the 'type' property to
    render the flash message in a different style for each 'type'.
  */
  renderMessage(message) {
    return (
      <div
        key={ message.id }
        className={ `alert alert-${message.type === 'ERROR' ? 'danger' : message.type.toLowerCase()}`}
        onClick={ () => this.onFlashMessageClick(message) }
      >
        { message.text }
      </div>
    );
  }
}

export default connect((store) => {
  return {
    messages: store.flashMessage.messages
  };
})(FlashMessage);
