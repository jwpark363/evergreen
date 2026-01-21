import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import { newApplication, type Application } from '../types/application_types';
import { addApplication, approveApplication, checkApplicationByPhone, rejectApplication } from '../api/application_api';
import { ActionButton, ButtonGroup, Form, FormGroup, ModalContainer, ModalHeader, ModalOverlay } from './modal_styled';
import { useState } from 'react';
import { toast } from 'sonner';
import { sendEmail } from '../api/send_mail';

type DataFormInput = Omit<Application, "id"|"updated_at">
interface ApplicationModalProps{
    is_open:boolean,
    onClose: () => void,
    data?:Application
}

export function ApplicationModal({is_open, onClose}: ApplicationModalProps){
    const { register, handleSubmit, getValues,
      setError, formState: { errors } } = useForm<DataFormInput>({
        defaultValues: newApplication(),
    });
    const [is_phone_check, setPhoneCheck] = useState(false);

  if (!is_open) return null;

  const onSubmit = (data: DataFormInput) => {
    //신규 입력
    if(!is_phone_check){
      setError("phone",
        {
          type:"manual",
          message:"반드시 중복체크 해야합니다."
        },
        {
          shouldFocus: true
        }
      );
      return;
    }
    (async () => {
      console.log("add");
      const new_data = {...data, note:"온라인통한 신청"}
      const result = await addApplication(new_data);
      console.log(result);
    })();
    onClose();
    toast.success(
      "가입 신청되었습니다. 축구회 내부 확인후 처리될 예정이니 조금만 기다려주세요.",
      { duration: 6500 }
    );
    sendEmail("신규가입자가 등록 되었습니다. 확인해주세요.");
  };
  const checkPhoneNumber = () => {
    console.log('중복 체크');
    const _data = getValues();
    console.log(_data);
    (async () => {
      const result = await checkApplicationByPhone(_data.phone);
      console.log(result);
      setPhoneCheck(true);
      if(result && result.length > 0){
        if(_data.phone === result[0].phone){
          setPhoneCheck(false);
          setError("phone",
            {
              type:"manual",
              message:`"${result[0].name}"님 이름으로 이미 등록되었습니다. 다시한번 확인하시고 신청해 주세요.`
            },
          );
        }
      }else{
        setPhoneCheck(true);
        setError("phone",
          {
            type:"manual",
            message:`체크 되었습니다.`
          },
        );
      }
    })();
  }
  return (
    <ModalOverlay>
      <ModalContainer>
        <ModalHeader>
          <h2>신규 가입 정보</h2>
          <X size={20} onClick={onClose} style={{ cursor: 'pointer' }} />
        </ModalHeader>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <FormGroup>
            <label>이름 <span>*</span></label>
            <input {...register("name", { required: true })} placeholder="이름 입력" />
          </FormGroup>
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
            <ActionButton type="button" onClick={checkPhoneNumber}>중복체크</ActionButton>
          </FormGroup>
          <FormGroup>
            <label>가입인사</label>
            <textarea {...register("message")} rows={2} />
          </FormGroup>
          <ButtonGroup>
            <ActionButton type="button" onClick={onClose}>닫기</ActionButton>
            <ActionButton type="submit" $primary>신규 가입</ActionButton>
          </ButtonGroup>
        </Form>
      </ModalContainer>
    </ModalOverlay>
  );
};

export function ApplicationManagementModal({is_open, onClose, data}: ApplicationModalProps){
  if (!is_open) return null;
  const onApprove = () => {
    if(data){
      //가입 처리
      (async () => {
        console.log("management");
        const result = await approveApplication(data.id);
        console.log(result);
      })();
    }
    onClose();
    toast.success(
      "처리 되었습니다. 회원 추가 절차 진행 해주세요.",
      { duration: 4000 }
    );
  };
  const onReject = () => {
    if(data){
      //거절 처리
      (async () => {
        console.log("management");
        const result = await rejectApplication(data.id);
        console.log(result);
      })();
    }
    onClose();
    toast.warning(
      "처리 되었습니다. 신청자에게 반드시 사유를 알려주세요.",
      { duration: 6500 }
    );
  }
  return (
    <ModalOverlay>
      <ModalContainer>
        <ModalHeader>
          <h2>가입 신청 관리</h2>
          <X size={20} onClick={onClose} style={{ cursor: 'pointer' }} />
        </ModalHeader>
        <Form>
          <FormGroup>
            <label>이름 <span>*</span></label>
            <input value={data?.name} disabled/>
          </FormGroup>
          <FormGroup>
            <label>전화번호 <span>*</span></label>
            <input value={data?.phone} disabled/>
          </FormGroup>
          <FormGroup>
            <label>가입인사</label>
            <textarea value={data?.message} rows={2} disabled/>
          </FormGroup>
          <ButtonGroup>
            <ActionButton type="button" onClick={onClose}>닫기</ActionButton>
            <ActionButton type="button" $primary onClick={onApprove}>가입 승인</ActionButton>
            <ActionButton type="button" $primary onClick={onReject}>가입 거절</ActionButton>
          </ButtonGroup>
        </Form>
      </ModalContainer>
    </ModalOverlay>
  );
};