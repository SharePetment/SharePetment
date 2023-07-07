import { ErrorMessage } from '@hookform/error-message';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useReadLocalStorage } from 'usehooks-ts';
import Button from '../../common/button/Button';
import {
  ErrorNotice,
  FormContainer,
  InputContainer,
  InputText,
  Label,
} from '../../common/input/Input.styled';
import Select from '../../common/select/Select';
import { ConfirmButton, DuplicateNotice, InfoForm } from './Info.styled';

type InfoProps = {
  nickname: string;
  name: string;
  email: string;
  address: string;
};

export function Component() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InfoProps>();

  // TODO: submit 버튼을 눌렀을 때 회원가입이면 POST/members, 회원수정이면 PATCH/members
  const onSubmit = (data: InfoProps) => {
    data = { ...data, address: '서울특별시 중랑구' };
    console.log(data);
    // 서버에 받은 정보를 가지고 중복확인
    // 중복 응답을 받은 경우, ErrorNotice로 중복된 이름입니다라는 에러보여주기
    setNoticeMessage('중복된 닉네임입니다.');
  };

  /* ----------------------------- useLocalStorage ---------------------------- */
  const accessToken = useReadLocalStorage('accessToken');
  const navigate = useNavigate();
  const [nickname, setNickname] = useState('');
  const [noticeMessage, setNoticeMessage] = useState('');
  // 중복확인이 체크되었을때만 submit이 이뤄져야 한다.

  // 비회원 로그인이 직접적으로 '/info'로 접근했을 때 확인해야 함
  // useEffect(() => {
  //   if (!accessToken) {
  //     navigate('/');
  //   }
  // }, [accessToken, navigate]);

  // login with kakao 눌렀을 때 ->
  // 백엔드에선 해당 이메일로 멤버인지 아닌지 확인하고
  // 없으면 추가정보로 리다이렉트
  // 회원이라면 accessToken과 함께 '/home'으로 리다이렉트

  // TODO: 서버에서 받아온 사용자 기본 정보로 이름과 이메일 작성

  return (
    <FormContainer>
      <InfoForm onSubmit={handleSubmit(onSubmit)}>
        {/* 이름 */}
        <InputContainer>
          <Label htmlFor="name">이름</Label>
          <InputText
            id="nickname"
            {...register('name')}
            value="이재린"
            readOnly
          />
        </InputContainer>

        {/* 닉네임*/}
        <InputContainer>
          <Label htmlFor="nickname">닉네임</Label>
          <InputText
            id="nickname"
            {...register('nickname', {
              required: '텍스트 필수입니다.',
              pattern: {
                value: /^(?!.*\s)[\p{L}\p{N}]+$/u,
                message: '공백과 특수기호를 제거해주세요 ;)',
              },
              maxLength: {
                value: 10,
                message: '10자 이내로 작성해주세요 ;)',
              },
            })}
            error={errors.nickname?.message}
          />
          {noticeMessage !== '' && (
            <DuplicateNotice>{noticeMessage}</DuplicateNotice>
          )}
          <ErrorMessage
            errors={errors}
            name="nickname"
            render={({ message }) => <ErrorNotice>{message}</ErrorNotice>}
          />
          <ConfirmButton>중복확인</ConfirmButton>
        </InputContainer>

        {/* 이메일 */}
        <InputContainer>
          <Label htmlFor="email">이메일</Label>
          <InputText
            id="email"
            {...register('email')}
            value="jrlee_0922@naver.com"
            readOnly
          />
        </InputContainer>

        {/* 주소 */}
        <div>
          <Label>주소</Label>
          <Select size="lg" direction="column" />
        </div>
        <Button size="lg" text="회원가입" isgreen="true" />
      </InfoForm>
    </FormContainer>
  );
}

Component.displayName = 'Info';
