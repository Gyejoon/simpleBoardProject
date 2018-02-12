import React from 'react';
import { Authentication } from 'components';
import { connect } from 'react-redux';
import { loginRequest } from 'actions/authentication';
import { browserHistory } from 'react-router';

class Login extends React.Component {
    constructor(props){
        super(props);
        this.handleLogin = this.handleLogin.bind(this);
    }

    handleLogin(id, pw){
        return this.props.loginRequest(id, pw).then(
            () => {
                if(this.props.status === "SUCCESS") {
                    let loginData = {
                        isLoggedIn: true,
                        username: id
                    };
                    
                    document.cookie = 'key=' + btoa(JSON.stringify(loginData));

                    Materialize.toast('환영합니다. ' + id + '님', 2000);
                    browserHistory.push('/');
                    return true;
                } else {
                    let $toastContent = $('<span style="color: #FFB4BA">아이디나 비밀번호가 일치하지 않습니다.</span>');
                    Materialize.toast($toastContent, 2000);
                    return false;
                }
            }
        );
    }

    render() {
        return(
            <div>
                <Authentication mode={true}
                    onLogin={this.handleLogin} />
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        status: state.authentication.login.status
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        loginRequest: (id, pw) => {
            return dispatch(loginRequest(id, pw));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
