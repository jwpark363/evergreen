import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import { newEvent, type Event } from '../types/event_types';
import { addEvent, updateEvent, voteEvent } from '../api/event_api';
import { ActionButton, ButtonGroup, Form, FormGroup, ModalContainer, ModalHeader, ModalOverlay } from './modal_styled';
import { useLoginStore } from '../state/login_state';
import { toast } from 'sonner';

type DataFormInput = Omit<Event, "id">
interface DataModalProps{
    data_id?:string,
    is_open:boolean,
    data?: DataFormInput,
    onClose: () => void
}
export default function EventModal({data_id, is_open, onClose, data }: DataModalProps){
    const { register, handleSubmit } = useForm<DataFormInput>({
        defaultValues: data ?? newEvent(),
    });

  if (!is_open) return null;

  const onSubmit = (data: DataFormInput) => {
    if(data_id){
      //업데이트
      (async () => {
        const result = await updateEvent(data_id, data);
        console.log(result);
      })();
    }else{
      //신규 입력
      (async () => {
        const result = await addEvent(data);
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
          <h2>일정 정보 {data ? '수정' : '추가'}</h2>
          <X size={20} onClick={onClose} style={{ cursor: 'pointer' }} />
        </ModalHeader>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <FormGroup>
            <label>행사 <span>*</span></label>
            <input {...register("title", { required: true })} placeholder="예: 자체 경기 / 원정 경기" />
          </FormGroup>
          <FormGroup>
            <label>설명</label>
            <textarea {...register("description")} rows={2} />
          </FormGroup>
          <FormGroup>
            <label>날짜</label>
            <input type="date" {...register("date")} />
          </FormGroup>
          <FormGroup>
            <label>시간</label>
            <input type="time" {...register("from_time")} /> ~ <input type="time" {...register("to_time")} />
          </FormGroup>
          <FormGroup>
            <label>장소 <span>*</span></label>
            <input {...register("location", { required: true })} placeholder="예: 자체 경기 / 원정 경기" />
          </FormGroup>
          <FormGroup>
            <label>상태</label>
            <select {...register("status")}>
              <option value="planned">예정</option>
              <option value="ongoing">진행</option>
              <option value="completed">완료</option>
              <option value="cancelled">취소</option>
            </select>
          </FormGroup>
          <ButtonGroup>
            <ActionButton type="button" onClick={onClose}>닫기</ActionButton>
            <ActionButton type="submit" $primary>{data ? '수정' : '추가'}</ActionButton>
          </ButtonGroup>
        </Form>
      </ModalContainer>
    </ModalOverlay>
  );
};

interface VoteModalProps{
    is_open:boolean,
    onClose: () => void,
    data?:Event
}
export function VoteModal({is_open, onClose, data}: VoteModalProps){
    const {user} = useLoginStore();
    if (!is_open) return null;
    const onApprove = () => {
      if(data){
        //참가 처리
        (async () => {
          const result = await voteEvent(data.id, true, data, user?.phone ?? "");
          console.log(result);
        })();
      }
      onClose();
      toast.success(
        `"${user?.name}"님 참가투표 감사합니다.`,
        { duration: 4000 }
      );
    };
  const onReject = () => {
    if(data){
      //불참 처리
      (async () => {
        const result = await voteEvent(data.id, false, data, user?.phone ?? "");
        console.log(result);
        onClose();
      })();
      toast.warning(
        `"${user?.name}"님 투표 감사합니다. 다음엔 꼭 참가해주세요.`,
        { duration: 5000 }
      );
    }
    onClose();
  }
  return (
    <ModalOverlay>
      <ModalContainer>
        <ModalHeader>
          <h2>투표</h2>
          <X size={20} onClick={onClose} style={{ cursor: 'pointer' }} />
        </ModalHeader>
        <Form>
          <FormGroup>
            <label>행사 <span>*</span></label>
            <input value={data?.title} disabled/>
          </FormGroup>
          <FormGroup>
            <label>설명 <span>*</span></label>
            <textarea value={data?.description} disabled/>
          </FormGroup>
          <FormGroup>
            <label>날짜</label>
            <input type="date" value={data?.date} disabled />
          </FormGroup>
          <FormGroup>
            <label>시간</label>
            <input type="time" value={data?.from_time} disabled /> ~ <input type="time" value={data?.to_time} disabled />
          </FormGroup>
          <FormGroup>
            <label>장소 <span>*</span></label>
            <input value={data?.location} disabled />
          </FormGroup>
          <ButtonGroup>
            <ActionButton type="button" onClick={onClose}>닫기</ActionButton>
            <ActionButton type="button" $primary onClick={onApprove}>참가</ActionButton>
            <ActionButton type="button" $primary onClick={onReject}>불참</ActionButton>
          </ButtonGroup>
        </Form>
      </ModalContainer>
    </ModalOverlay>
  );
};