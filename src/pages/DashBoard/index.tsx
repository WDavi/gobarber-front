import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { FiPower, FiClock } from 'react-icons/fi';
import DayPicker, { DayModifiers } from 'react-day-picker';
import { format, isTomorrow, isToday, isAfter } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import 'react-day-picker/lib/style.css';

import { parseISO } from 'date-fns/esm';
import { Link } from 'react-router-dom';
import {
  Container,
  Header,
  HeaderContent,
  Profile,
  Content,
  Schedule,
  Calendar,
  NextAppointment,
  Section,
  Appointment,
} from './styles';

import logoImg from '../../assets/logo.svg';

import { useAuth } from '../../hooks/auth';
import api from '../../services/api';

interface MonthAvailabilityItem {
  day: number;
  available: boolean;
}

interface Appointment {
  id: string;
  date: string;
  recipient: {
    name: string;
    avatar_url: string;
  };
}

const DashBoard: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const [monthAvailability, setMonthAvailability] = useState<
    MonthAvailabilityItem[]
  >([]);

  const { signOut, user } = useAuth();

  const disabledDaysInMonth = useMemo(() => {
    const dates = monthAvailability
      .filter(monthDay => !monthDay.available)
      .map(monthDay => {
        return new Date(
          selectedMonth.getFullYear(),
          selectedMonth.getMonth(),
          monthDay.day,
        );
      });
    return dates;
  }, [selectedMonth, monthAvailability]);

  const handleDateSelect = useCallback((day: Date, modifiers: DayModifiers) => {
    if (modifiers.available && !modifiers.disabled) {
      setSelectedDate(day);
    }
  }, []);

  const handleMonthChange = useCallback((month: Date) => {
    setSelectedMonth(month);
  }, []);

  const handleDateShow = useMemo(() => {
    const dayData = (
      <>
        <span>
          Dia
          {format(selectedDate, " dd 'de' MMMM", {
            locale: ptBR,
          })}
        </span>
        <span>
          {format(selectedDate, 'cccc', {
            locale: ptBR,
          })}
        </span>
      </>
    );
    if (isToday(selectedDate))
      return (
        <>
          <span>Hoje</span>
          {dayData}
        </>
      );

    if (isTomorrow(selectedDate))
      return (
        <>
          <span>Amanhã</span>
          {dayData}
        </>
      );

    return dayData;
  }, [selectedDate]);

  const morningAppointments = useMemo(() => {
    return appointments.filter(appointment => {
      return parseISO(appointment.date).getHours() < 12;
    });
  }, [appointments]);

  const afterNoonAppointments = useMemo(() => {
    return appointments.filter(appointment => {
      return parseISO(appointment.date).getHours() >= 12;
    });
  }, [appointments]);

  const nextAppointment = useMemo(() => {
    return appointments.find(appointment =>
      isAfter(parseISO(appointment.date), new Date()),
    );
  }, [appointments]);

  useEffect(() => {
    api
      .get(`/providers/${user.id}/month-availability`, {
        params: {
          year: selectedMonth.getFullYear(),
          month: selectedMonth.getMonth() + 1,
        },
      })
      .then(response => setMonthAvailability(response.data));
  }, [selectedMonth, user.id]);

  useEffect(() => {
    api
      .get('/appointments/provider/me', {
        params: {
          year: selectedDate.getFullYear(),
          month: selectedDate.getMonth() + 1,
          day: selectedDate.getDate(),
        },
      })
      .then(response => setAppointments(response.data));
  }, [selectedDate]);

  return (
    <Container>
      <Header>
        <HeaderContent>
          <img src={logoImg} alt="GoBarber" />

          <Profile to="/profile">
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
          <p>{handleDateShow}</p>

          {isToday(selectedDate) && nextAppointment && (
            <NextAppointment>
              <strong>Atendimento a seguir</strong>
              <div>
                <img
                  src={nextAppointment.recipient.avatar_url}
                  alt={nextAppointment.recipient.name}
                />

                <strong>{nextAppointment.recipient.name}</strong>
                <span>
                  <FiClock />
                  {format(parseISO(nextAppointment.date), "HH':'mm")}
                </span>
              </div>
            </NextAppointment>
          )}

          <Section>
            <strong>Manhã</strong>

            {morningAppointments.map(appointment => (
              <Appointment key={appointment.id}>
                <span>
                  <FiClock />
                  {format(parseISO(appointment.date), "HH':'mm")}
                </span>
                <div>
                  <img
                    src={appointment.recipient.avatar_url}
                    alt={appointment.recipient.name}
                  />

                  <strong>{appointment.recipient.name}</strong>
                </div>
              </Appointment>
            ))}
          </Section>

          <Section>
            <strong>Tarde</strong>

            {afterNoonAppointments.map(appointment => (
              <Appointment key={appointment.id}>
                <span>
                  <FiClock />
                  {format(parseISO(appointment.date), "HH':'mm")}
                </span>
                <div>
                  <img
                    src={appointment.recipient.avatar_url}
                    alt={appointment.recipient.name}
                  />

                  <strong>{appointment.recipient.name}</strong>
                </div>
              </Appointment>
            ))}
          </Section>
        </Schedule>

        <Calendar>
          <DayPicker
            weekdaysShort={['D', 'S', 'T', 'Q', 'Q', 'S', 'S']}
            fromMonth={new Date()}
            disabledDays={[{ daysOfWeek: [0, 6] }, ...disabledDaysInMonth]}
            modifiers={{
              available: { daysOfWeek: [1, 2, 3, 4, 5] },
            }}
            onDayClick={handleDateSelect}
            onMonthChange={handleMonthChange}
            selectedDays={selectedDate}
            months={[
              'Janeiro',
              'Fevereiro',
              'Março',
              'Abril',
              'Maio',
              'Junho',
              'Julho',
              'Agosto',
              'Setembro',
              'Outubro',
              'Novembro',
              'Dezembro',
            ]}
          />
        </Calendar>
      </Content>
    </Container>
  );
};

export default DashBoard;
