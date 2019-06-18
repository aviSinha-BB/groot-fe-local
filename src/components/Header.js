import 'froala-editor/css/froala_editor.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';
import 'froala-editor/js/froala_editor.pkgd.min.js';
import 'font-awesome/css/font-awesome.css';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FroalaEditor from "react-froala-wysiwyg";


class Header extends Component {
  constructor(props) {
    super(props);
  }

  //sending the header value to App
  setheading = (model) => {
    const head = model;
    this.props.updateHead(head);
  }

  render() {
    return (
      <div>
        <FroalaEditor tag='textarea'
          config={{
            placeholderText: 'Edit Your Content Here!',
            toolbarInline: false,
            charCounterMax: 80,
            height: 200,
            width: 300,
            enter: $.FroalaEditor.ENTER_BR,
            key: FroalaKey,
            toolbarButtons: ['bold', 'italic', 'underline', '|', 'color'],
            colorsDefaultTab: 'text',
            colorsStep: 6
          }}
          model={this.props.headingvalue}
          onModelChange={this.setheading}
        />
      </div>
    );
  }
}

//setting the prop types
Header.propTypes = {
  headingvalue: PropTypes.string
};

export default Header;
