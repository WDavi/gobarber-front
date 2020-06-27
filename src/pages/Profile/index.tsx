import React, { useCallback, useRef, ChangeEvent } from 'react';
import { FiArrowLeft, FiMail, FiLock, FiUser, FiCamera } from 'react-icons/fi';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import { Link, useHistory } from 'react-router-dom';

import api from '../../services/api';
import { useToast } from '../../hooks/toast';

import getValidationErrors from '../../utils/getValidationErros';

import Input from '../../components/Input';
import Button from '../../components/Button';

import { Container, Content, AvatarInput } from './styles';
import { useAuth } from '../../hooks/auth';

interface ProfileFormData {
  name: string;
  email: string;
  old_password: string;
  password: string;
  password_confirmation: string;
}

const Profile: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();
  const history = useHistory();

  const { user, updateUser } = useAuth();

  const handleSubmit = useCallback(
    async (data: ProfileFormData) => {
      try {
        const schema = Yup.object().shape({
          name: Yup.string().required('Nome obrigatório'),
          email: Yup.string()
            .required('E-mail obrigatório')
            .email('Digite um e-mail válido'),
          old_password: Yup.string().when('email', {
            is: () => data.email !== user.email,
            then: Yup.string().required('Insira a senha para trocar o e-mail'),
            otherwise: Yup.string().notRequired(),
          }),
          password: Yup.string().when('old_password', {
            is: () => data.password,
            then: Yup.string().required(
              'Insira a senha atual para trocar de senha',
            ),
            otherwise: Yup.string().notRequired(),
          }),
          password_confirmation: Yup.string().oneOf(
            [Yup.ref('password'), null],
            'As senhas devem ser iguais',
          ),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        formRef.current?.setErrors({});

        const {
          name,
          email,
          password,
          old_password,
          password_confirmation,
        } = data;

        const formData = {
          name,
          email,
          ...(old_password
            ? {
                password,
              }
            : {}),
          ...(password
            ? {
                old_password,
                password,
                password_confirmation,
              }
            : {}),
        };

        await api
          .put('profile', formData)
          .then(response => updateUser(response.data));

        addToast({
          type: 'success',
          title: 'Perfil Alterado com sucesso!',
        });

        history.push('/dashboard');
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);

          return;
        }

        switch (err.response.data.message) {
          case 'Your need to input the correct old password':
            addToast({
              type: 'error',
              title: 'Erro na atualização de usuário',
              description: 'Senha atual incorreta.',
            });
            return;
          case 'You need to insert the password to change the email':
            addToast({
              type: 'error',
              title: 'Erro na atualização de usuário',
              description: 'Senha atual incorreta.',
            });
            return;

          case 'New password should not be equal to old password':
            addToast({
              type: 'error',
              title: 'Erro na atualização de usuário',
              description: 'Nova senha não pode ser igual a senha antiga.',
            });
            return;

          default:
            break;
        }

        addToast({
          type: 'error',
          title: 'Erro na atualização de usuário',
          description: 'Tente novamente.',
        });
      }
    },
    [addToast, history, updateUser, user.email],
  );

  const handleAvatarChange = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const data = new FormData();

        data.append('avatar', e.target.files[0]);

        await api.patch('/users/avatar', data).then(response => {
          addToast({
            type: 'info',
            title: 'Avatar de usuário alterado com sucesso',
          });

          updateUser(response.data);
        });
      }
    },
    [addToast, updateUser],
  );

  return (
    <Container>
      <header>
        <div>
          <Link to="/dashboard">
            <FiArrowLeft />
          </Link>
        </div>
      </header>
      <Content>
        <Form
          ref={formRef}
          initialData={{
            name: user.name,
            email: user.email,
          }}
          onSubmit={handleSubmit}
        >
          <AvatarInput htmlFor="avatar">
            <img src={user.avatar_url} alt={user.name} />
            <div>
              <FiCamera />
            </div>

            <input type="file" id="avatar" onChange={handleAvatarChange} />
          </AvatarInput>
          <h1>Meu perfil</h1>
          <Input icon={FiUser} name="name" placeholder="Nome" />
          <Input icon={FiMail} name="email" placeholder="E-mail" />

          <Input
            icon={FiLock}
            name="old_password"
            type="password"
            placeholder="Senha atual"
          />
          <h1>Alterar senha:</h1>
          <Input
            icon={FiLock}
            name="password"
            type="password"
            placeholder="Nova Senha"
          />
          <Input
            icon={FiLock}
            name="password_confirmation"
            type="password"
            placeholder="Confirmação da Senha"
          />

          <Button type="submit">Confirmar mudanças</Button>
        </Form>
      </Content>
    </Container>
  );
};

export default Profile;
