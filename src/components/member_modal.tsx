import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import { newMember, ROLE, type Member } from '../types/member_types';
import { addMember, changePassword, checkAuth, updateMember } from '../api/member_api';
import { ActionButton, ButtonGroup, Form, FormGroup, ModalContainer, ModalHeader, ModalOverlay } from './modal_styled';
import { toast } from 'sonner';
import { useLoginStore } from '../state/login_state';
import { useState } from 'react';

type MemberFormInput = Omit<Member, "id"|"updated_at">
interface MemberModalProps{
    member_id?:string,
    is_open:boolean,
    init_data?: MemberFormInput,
    onClose: () => void
}

export default function MemberModal({member_id, is_open, onClose, init_data }: MemberModalProps){
  const {user} = useLoginStore();  
  const { register, handleSubmit, formState: { errors } } = useForm<MemberFormInput>({
        defaultValues: init_data ?? newMember(),
    });

  if (!is_open) return null;
  const onSubmit = (data: MemberFormInput) => {
    if(!checkAuth(user,member_id)){
      toast.warning("권한이 없습니다.");
      return;
    }
    if(member_id && checkAuth(user,member_id)){
      //업데이트
      (async () => {
        const result = await updateMember(member_id, data);
        console.log(result);
      })();
    }else{
      //신규 입력
      (async () => {
        const result = await addMember(data);
        console.log(result);
      })();
    }
    onClose();
    toast.success("처리 되었습니다.");
  };
  return (
    <ModalOverlay>
      <ModalContainer>
        <ModalHeader>
          <h2>회원 정보 {init_data ? '수정' : '추가'}</h2>
          <X size={20} onClick={onClose} style={{ cursor: 'pointer' }} />
        </ModalHeader>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <FormGroup>
            <label>이름 <span>*</span></label>
            <input {...register("name", { required: true })} placeholder="이름 입력"/>
          </FormGroup>
          <FormGroup>
            <label>역할</label>
            <select {...register("role",{ required: true })}>
              {Object.entries(ROLE).map(([key, value]) => (
                <option key={key} value={key}>
                  {value}
                </option>
              ))}
            </select>
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
                })} placeholder="01000000000" />
          {errors.phone && <p className="error-msg">{errors.phone.message}</p>}
          </FormGroup>
          <FormGroup>
            <label>가입일</label>
            <input type="date" {...register("join_date")} />
          </FormGroup>
          <FormGroup>
            <label>상태</label>
            <select {...register("status")}>
              <option value="active">활동중</option>
              <option value="inactive">비활동</option>
              <option value="withdraw">탈퇴</option>
              <option value="except">제외</option>
            </select>
          </FormGroup>
          <FormGroup>
            <label>등번호</label>
            <input type="number" {...register("back_number")} />
          </FormGroup>
          <FormGroup>
            <label>주포지션</label>
            <select {...register("position1")}>
              <option value="FW">FW</option>
              <option value="MF">MF</option>
              <option value="DF">DF</option>
              <option value="GK">GK</option>
            </select>
          </FormGroup>
          <FormGroup>
            <label>보조포지션</label>
            <select {...register("position2")}>
              <option value="FW">FW</option>
              <option value="MF">MF</option>
              <option value="DF">DF</option>
              <option value="GK">GK</option>
            </select>
          </FormGroup>
          <FormGroup>
            <label>주발</label>
            <select {...register("main_foot")}>
              <option value="right">오른발</option>
              <option value="left">왼발</option>
              <option value="both">양발</option>
            </select>
          </FormGroup>
          <FormGroup>
            <label>실력</label>
            <select {...register("level")}>
              <option value="best">최우수</option>
              <option value="good">우수</option>
              <option value="average">보통</option>
            </select>
          </FormGroup>
          <FormGroup>
            <label>비고</label>
            <textarea {...register("note")} rows={2} />
          </FormGroup>
          <ButtonGroup>
            <ActionButton type="button" onClick={onClose}>닫기</ActionButton>
            {(member_id && checkAuth(user,member_id)) &&
              <ActionButton type="submit" $primary>{init_data ? '수정' : '추가'}</ActionButton>
            }
          </ButtonGroup>
        </Form>
      </ModalContainer>
    </ModalOverlay>
  );
};

type PasswordFormInput = {
  password: string
}
interface PasswordModalProps{
    member_id?:string,
    is_open:boolean,
    onClose: () => void
}

export function PasswordModal({is_open, onClose}: PasswordModalProps){
  const [is_check, setCheck] = useState(false);
    const { register, handleSubmit, setError, formState: { errors } } = useForm<PasswordFormInput>({
        defaultValues: { password : "" },
    });

  if (!is_open) return null;

  const onSubmit = (data: PasswordFormInput) => {
    //변경 여부 체크
    if(!is_check){
      setError('password',
        {
          type:"manual",
          message:"변경처리 하시겠습니까? '비밀 번호 변경' 버튼을 한번더 눌러주세요!."
        }
      )
      setCheck(true);
      return
    }
    //비번 변경 처리
    console.log(data);
    (async () => {
      const result = await changePassword(data.password);
      if(result)
        toast.success(`"${data.password}"로 비밀번호가 변경 되었습니다.`);
      else
        toast.warning(`비밀번호 변경이 실패 되었습니다. 다시한번 시도해주세요.`);
    })();
    onClose();
  };
  return (
    <ModalOverlay>
      <ModalContainer>
        <ModalHeader>
          <h2>비밀 번호 변경</h2>
          <X size={20} onClick={onClose} style={{ cursor: 'pointer' }} />
        </ModalHeader>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <FormGroup>
            <label>비밀 번호 <span>*</span></label>
            <input type='password' {...register("password", 
              {
                required: true,
                minLength: {
                  value: 8,
                  message: "비밀번호는 최소 8자 이상이어야 합니다."
                }

              })} placeholder="비밀 번호 입력" />
          {errors.password && <p className="error-msg">{errors.password.message}</p>}
          </FormGroup>
          <ButtonGroup>
            <ActionButton type="button" onClick={onClose}>닫기</ActionButton>
            <ActionButton type="submit" $primary>비밀 번호 변경</ActionButton>
          </ButtonGroup>
        </Form>
      </ModalContainer>
    </ModalOverlay>
  );
};