// Nav.js
import React from "react";
import Button from "../button/Button";
import style from "./nav.module.css";


const Nav = () => {
  return (
    <nav className={style.nav}>
      
      <Button link="/formpage" text="FormPage" />
    </nav>
  );
};

export default Nav;
