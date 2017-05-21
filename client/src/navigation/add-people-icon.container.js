// @flow
import { connect } from 'react-redux';

import { togglePrompt } from 'ChatApp/src/redux';

import AddPeopleIcon from './add-people-icon.component';

const mapStateToProps = () => ({});
const mapDispatchToProps = dispatch => ({
  togglePrompt: () => dispatch(togglePrompt()),
});

export default connect(mapStateToProps, mapDispatchToProps)(AddPeopleIcon);
