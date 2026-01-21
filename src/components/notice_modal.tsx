import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import { ActionButton, ButtonGroup, CheckboxGroup, Form, FormGroup, ModalContainer, ModalHeader, ModalOverlay } from './modal_styled';
import { NewNotice, type Notice } from '../types/notice_types';
import { addNotice, updateNotice } from '../api/notice_api';
import { toast } from 'sonner';

type DataFormInput = Omit<Notice, "id" | "created_at">
interface DataModalProps{
    data_id?:string,
    is_open:boolean,
    data?: DataFormInput,
    onClose: () => void
}
export default function NoticeModal({data_id, is_open, onClose, data }: DataModalProps){
    const { register, handleSubmit } = useForm<DataFormInput>({
        defaultValues: data ?? NewNotice(),
    });

  if (!is_open) return null;

  const onSubmit = (data: DataFormInput) => {
    if(data_id){
      //업데이트
      (async () => {
        const result = await updateNotice(data_id, data);
        console.log(result);
      })();
    }else{
      //신규 입력
      (async () => {
        const result = await addNotice(data);
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
          <h2>공지 사항 {data ? '수정' : '추가'}</h2>
          <X size={20} onClick={onClose} style={{ cursor: 'pointer' }} />
        </ModalHeader>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <FormGroup>
            <label>제목 <span>*</span></label>
            <input {...register("title", { required: true })} placeholder="예: 자체 경기 / 원정 경기" />
          </FormGroup>
          <FormGroup>
            <label>내용 <span>*</span></label>
            <textarea {...register("content", { required: true })} rows={2} />
          </FormGroup>
          <CheckboxGroup>
            <label htmlFor="is_pinned">상단고정여부 <span>*</span></label>
            <input 
              type="checkbox" 
              id="is_pinned"
              {...register("is_pinned")} 
            />
            <span className="checkbox-label" onClick={() => document.getElementById('is_pinned')?.click()}>
            </span>
          </CheckboxGroup>
          <ButtonGroup>
            <ActionButton type="button" onClick={onClose}>닫기</ActionButton>
            <ActionButton type="submit" $primary>{data ? '수정' : '추가'}</ActionButton>
          </ButtonGroup>
        </Form>
      </ModalContainer>
    </ModalOverlay>
  );
};