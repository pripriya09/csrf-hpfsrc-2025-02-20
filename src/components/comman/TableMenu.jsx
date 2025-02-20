import React, { useState, Component } from "react";
import { Nav, NavDropdown, Form } from "react-bootstrap";
import {NavLink} from 'react-router-dom';
import Token from "../../Components/tabledata/token";


const type = 'checkbox';

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      byDefaultCBValue: true
    };
  }

 

  render() {
    return (
      <>


        {(
         <div className='hovmenu t_menu'>
            <NavLink className="menu" to="/Bond">BONDS </NavLink>
            <NavLink className="menu" to="/Token">TOKEN</NavLink>
            <NavLink className="menu" to="/Merchantcoins"> MERCHANT COINS</NavLink>
            <NavLink className="menu" to="/Commodities"> COMMODITIES</NavLink>
            <NavLink className="menu" to="/CryptoCurrency">CRYPTO CURRENCY</NavLink>
           {/*  <NavLink className="nav-link classpadding" href="/ItemsList">CRYPTO CURRENCY</NavLink>  */}
           </div>
        )}
      </>
    );
  }
}
