import { useForm } from 'react-hook-form';
import { ActionButton, ButtonGroup, Form, FormGroup, ModalContainer, ModalHeader, ModalOverlay } from './modal_styled';
import { loginWithUsername, type LoginData } from '../api/login_api';
import { useState } from 'react';
import type { ROUTER } from '../types/router_types';
import { useLoginStore } from '../state/login_state';
interface DataModalProps{
    setView: (menu:ROUTER) => void
}
export default function LoginModal({ setView }: DataModalProps){
    const {user, setUser} = useLoginStore();
    const [is_open, setOpen] = useState(true);
    const { register, handleSubmit, formState: { errors } } = useForm<LoginData>({
          defaultValues: {phone:"",password:""},
      });

    if (!is_open || user) return null;
    const handleClose = () => {
      setOpen(false);
      setView('dashboard');
    }
    const onSubmit = (login_data: LoginData) => {
    //로그인
      (async () => {
        const result = await loginWithUsername(login_data);
        if(result && result.login_user){
          setUser(result.login_user)
        }else{
          setView('dashboard');
        }
      })();
      setOpen(false);
  };
  return (
    <ModalOverlay>
      <ModalContainer>
        <ModalHeader>
          <h2>로그인</h2>
        </ModalHeader>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <FormGroup>
            <label>전화번호 <span>*</span></label>
            <input {...register("phone", {
                // required: true
                required: true,
                pattern: {
                  value: /^010\d{4}\d{4}$/,
                  message: "11자리 숫자를 입력해주세요."
                }                
                })} placeholder="00000000000" />
          {errors.phone && <p className="error-msg">{errors.phone.message}</p>}
          </FormGroup>
          <FormGroup>
            <label>패스워드 <span>*</span></label>
            <input {...register("password", { required: true })} placeholder="****" />
          </FormGroup>
          <ButtonGroup>
            <ActionButton type="button" onClick={handleClose}>닫기</ActionButton>
            <ActionButton type="submit" $primary>로그인</ActionButton>
          </ButtonGroup>
        </Form>
      </ModalContainer>
    </ModalOverlay>
  );
};