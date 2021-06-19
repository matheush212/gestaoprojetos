import React from 'react';
import 'materialize-css/dist/css/materialize.min.css';
import './Header.css';
import sys_logo from '../Images/sys-logo.png';


class Header extends React.Component {
    render() {
        return (
            <nav>
                <div className="nav-wrapper color-style">
                    <div className="left">
                        <img className="logo_image_header" src={sys_logo} alt="Logo"></img>
                    </div>
                    <div id="LogoEmpresa" className="brand-logo right logo-font-style" style={{right: '1%'}}>EUAX</div>
                    <div id="HeaderTitle" className="title-position-style" style={{left: '50%'}}>{this.props.title}</div>
                </div>
            </nav>
        )
    }
}
export default Header;
