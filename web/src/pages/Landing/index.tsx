import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api'

import logoImg from '../../assets/images/logo.svg';
import landingImg from '../../assets/images/landing.svg';
import logoutIcon from '../../assets/images/icons/logout-icon.svg';
import defaultUserAvatar from '../../assets/images/default-user-avatar.png';

import studyIcon from '../../assets/images/icons/study.svg';
import giveClassesIcon from '../../assets/images/icons/give-classes.svg';
import purpleHeartIcon from '../../assets/images/icons/purple-heart.svg';
import { useAuth } from '../../contexts/auth';

import './styles.css';


function Landing() {
  const [totalConnections, setTotalConnections] = useState(0)
  const { logOut, user } = useAuth()

  useEffect(() => {
    api.get('connections').then(response => {
      const { total } = response.data
      setTotalConnections(total)
    })
  }, [])

  function handleLogOut() {
    logOut();
  }

  return (
    <div id="page-landing">
      <div id="page-landing-content" className="container">

        <div id="top">
          <div id="user-header">
            <Link to='/profile'>
              <div id="user-info">
                <img src={user?.avatar? user?.avatar :defaultUserAvatar} alt="foto do usuário" />
                <p>{`${user?.name} ${user?.last_name}`}</p>
              </div>
            </Link>
            <img src={logoutIcon} alt="botão sair" onClick={handleLogOut} />
          </div>

          <div className="logo-container-landing">
            <img src={logoImg} alt="Proffy logo" />
            <h2>Sua plataforma de<br /> estudos online.</h2>
          </div>

          <img
            src={landingImg}
            alt="Plataforma de estudos"
            className="hero-image"
          />
        </div>

        <div id="bottom">
          <p id="text-presentation">
            Seja bem-vindo<br />
            <strong>O que deseja fazer ?</strong>
          </p>
          <div className="buttons-container">
            <Link to="/study" className="study">
              <img src={studyIcon} alt="Estudar" />
              Estudar
            </Link>

            <Link to="/give-classes" className="give-classes">
              <img src={giveClassesIcon} alt="Lecionar" />
            Lecionar
          </Link>
          </div>

          <span className="total-connections">
            Total de {totalConnections} conexões<br />
            já realizadas <img src={purpleHeartIcon} alt="Coração roxo" />
          </span>
        </div>
      </div>
    </div>
  );
}

export default Landing;