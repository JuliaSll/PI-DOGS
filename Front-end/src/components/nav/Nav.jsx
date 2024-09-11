import { useAuth0 } from '@auth0/auth0-react';
import React from "react";
import Button from "../button/Button";
import style from "./nav.module.css";



const Nav = () => {

  return (
    <nav className={style.nav}>
      <Button link="/Home" text="Home"/>
      <Button link="/formpage" text="FormPage" />
      <Button link="/info" text="Info Dogs" />
      <Button link="/adoption" text="Perros en adopcion" />
      <Button link="/about" text="Nuestra mision" />
      
    </nav>
  );
};

export default Nav;
