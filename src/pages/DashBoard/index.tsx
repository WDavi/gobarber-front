import React from 'react';
import { FiPower, FiClock } from 'react-icons/fi';

import {
  Container,
  Header,
  HeaderContent,
  Profile,
  Content,
  Schedule,
  Calendar,
  NextAppointment,
} from './styles';

import logoImg from '../../assets/logo.svg';

import { useAuth } from '../../hooks/auth';

const DashBoard: React.FC = () => {
  const { signOut, user } = useAuth();

  return (
    <Container>
      <Header>
        <HeaderContent>
          <img src={logoImg} alt="GoBarber" />

          <Profile>
            <img src={user.avatar_url} alt={`Avatar de ${user.name}`} />
            <div>
              <strong>Bem Vindo.</strong>
              <br />
              <span>{user.name}</span>
            </div>
          </Profile>

          <button type="button" onClick={signOut}>
            <FiPower />
            Log Out
          </button>
        </HeaderContent>
      </Header>

      <Content>
        <Schedule>
          <h1>Horários agendados</h1>
          <p>
            <span>Hoje</span>
            <span>Dia 06</span>
            <span>Segunda-feira</span>
          </p>

          <NextAppointment>
            <strong>Atendimento a seguir</strong>
            <div>
              <img
                src="https://avatars3.githubusercontent.com/u/12603499?s=460&u=443e31a70822ddd874fcff72432cfb3ee0f8168c&v=4"
                alt="Davi"
              />

              <strong>Davi</strong>
              <span>
                <FiClock />
                08:00
              </span>
            </div>
          </NextAppointment>
        </Schedule>

        <Calendar />
      </Content>
    </Container>
  );
};

export default DashBoard;
