import React from 'react';
import { Authentication } from 'components';
import { connect } from 'react-redux';
import { registerRequest } from 'actions/authentication';
import { browserHistory } from 'react-router';

class Register extends React.Component {
    constructor(props){
        super(props);
        this.handleRegister = this.handleRegister.bind(this);
    }

    handleRegister(id, pw) {
        return this.props.registerRequest(id, pw).then(
            () => {
                if(this.props.status === "SUCCESS") {
                    Materialize.toast('회원가입 성공!', 2000);
                    browserHistory.push('/login');
                    return true;
                } else {

                    let errorMessage = [
                        '잘못된 닉네임 입니다.',
                        '이미 가입된 유저가 존재합니다.'
                    ];

                    let $toastContent = $('<span style="color: #FFB4BA">' + errorMessage[this.props.errorCode - 2] + '</span>');
                    Materialize.toast($toastContent, 2000);
                    return false;
                }
            }
        );
    }

    render() {
        return(
            <div>
                <Authentication mode={false}
                    onRegister={this.handleRegister}/>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        status: state.authentication.register.status,
        errorCode: state.authentication.register.error
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        registerRequest: (id, pw) => {
            return dispatch(registerRequest(id, pw));
        }
    };
};


export default connect(mapStateToProps, mapDispatchToProps)(Register);
