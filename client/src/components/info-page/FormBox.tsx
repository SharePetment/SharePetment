import { ErrorMessage } from '@hookform/error-message';
import {
  UseFormHandleSubmit,
  FieldErrors,
  UseFormSetError,
  UseFormSetValue,
  UseFormRegister,
} from 'react-hook-form';
import { Location } from 'react-router-dom';
import * as SC from './FormBox.styled';
import Button from '@/common/button/Button';
import * as SCINPUT from '@/common/input/Input.styled.tsx';
import Select from '@/common/select/Select';
import ERROR_MESSAGE from '@/types/errorMessage';
import { QuitProps, InfoProps } from '@/types/infoProp';
import handleCheckNickname from '@/util/checkNickname';

interface FormBoxProp {
  register: UseFormRegister<InfoProps>;
  handleSubmit: UseFormHandleSubmit<InfoProps, undefined>;
  onSubmit: (data: InfoProps) => void;
  location: Location;
  isDuplicated: boolean;
  setDuplicated: React.Dispatch<React.SetStateAction<boolean>>;
  setZip: React.Dispatch<React.SetStateAction<string>>;
  errors: FieldErrors<InfoProps>;
  setError: UseFormSetError<InfoProps>;
  setValue: UseFormSetValue<InfoProps>;
  nicknameValue: string;
  quitErrors: FieldErrors<QuitProps>;
  quitHandleSubmit: UseFormHandleSubmit<QuitProps, undefined>;
  onSubmitQuit: (data: QuitProps) => void;
  quitRegister: UseFormRegister<QuitProps>;
  userId: string | undefined;
}

export default function FormBox({
  register,
  handleSubmit,
  onSubmit,
  location,
  isDuplicated,
  setDuplicated,
  setZip,
  setError,
  setValue,
  errors,
  nicknameValue,
  quitErrors,
  quitHandleSubmit,
  onSubmitQuit,
  quitRegister,
  userId,
}: FormBoxProp) {
  return (
    <SCINPUT.FormContainer>
      <SC.InfoForm onSubmit={handleSubmit(onSubmit)}>
        {/* 이름 */}
        <SCINPUT.InputContainer>
          <SCINPUT.Label htmlFor="name">이름</SCINPUT.Label>
          <SC.InputText id="nickname" value={location.state.name} disabled />
        </SCINPUT.InputContainer>

        {/* 닉네임*/}
        <SCINPUT.InputContainer>
          <SCINPUT.Label htmlFor="nickname">닉네임</SCINPUT.Label>
          <SCINPUT.InputText
            id="nickname"
            {...register('nickname', {
              required: ERROR_MESSAGE.NONE,
              pattern: {
                value: /^(?!.*\s)[\p{L}\p{N}]+$/u,
                message: ERROR_MESSAGE.EXTRA,
              },
              maxLength: {
                value: 10,
                message: ERROR_MESSAGE.LENGTH,
              },
              onChange: () => setDuplicated(false),
            })}
            error={errors.nickname?.message}
            duplicated={`${isDuplicated}`}
            defaultValue={location.state && location.state.nickname}
          />
          {!userId && (
            <ErrorMessage
              errors={errors}
              name="nickname"
              render={({ message }) => (
                <SCINPUT.ErrorNotice messagetext={message}>
                  {message}
                </SCINPUT.ErrorNotice>
              )}
            />
          )}
          <SC.ConfirmButton
            onClick={e =>
              handleCheckNickname({
                e,
                location,
                nicknameValue,
                setDuplicated,
                errors,
                setError,
                setValue,
              })
            }
            isduplicated={`${isDuplicated}`}>
            중복확인
          </SC.ConfirmButton>
          <ErrorMessage
            errors={errors}
            name="nickname"
            render={({ message }) => (
              <SCINPUT.ErrorNotice messagetext={message}>
                {message}
              </SCINPUT.ErrorNotice>
            )}
          />
          {userId && (
            <ErrorMessage
              errors={errors}
              name="nickname"
              render={({ message }) => (
                <SCINPUT.ErrorNotice messagetext={message}>
                  {message}
                </SCINPUT.ErrorNotice>
              )}
            />
          )}
        </SCINPUT.InputContainer>

        {/* 이메일 */}
        <SCINPUT.InputContainer>
          <SCINPUT.Label htmlFor="email">이메일</SCINPUT.Label>
          <SCINPUT.InputText
            id="email"
            value={
              location.state.email ? location.state.email : 'guest@email.com'
            }
            disabled
          />
        </SCINPUT.InputContainer>

        {/* 주소 */}
        <div>
          <SCINPUT.Label>주소</SCINPUT.Label>
          <Select size="lg" direction="column" setZip={setZip} />
        </div>
        <Button size="lg" text="회원정보 수정" isgreen="true" />
      </SC.InfoForm>

      {/* 탈퇴버튼 */}
      {userId && (
        <SC.QuitContainer>
          <SC.QuitTitle>
            탈퇴를 원하신다면 '탈퇴할게요'를 적어주세요🥲
          </SC.QuitTitle>
          <SC.QuitForm onSubmit={quitHandleSubmit(onSubmitQuit)}>
            <SC.QuitInput
              {...quitRegister('quitText', {
                validate: value =>
                  value === '탈퇴할게요' || '정확하게 입력해주세요',
              })}
            />
            <SC.QuitBtn>확인</SC.QuitBtn>
          </SC.QuitForm>
          <SC.QuitMessage>{quitErrors.quitText?.message}</SC.QuitMessage>
        </SC.QuitContainer>
      )}
    </SCINPUT.FormContainer>
  );
}
