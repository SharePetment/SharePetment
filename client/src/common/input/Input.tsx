import { ErrorMessage } from '@hookform/error-message';
import { RegisterOptions, useFormContext } from 'react-hook-form';
import { BooleanStr } from '../../types/propType';
import Button from '../button/Button';
import {
  ErrorNotice,
  InputContainer,
  InputLabel,
  InputText,
} from './Input.styled';

export type InputProps = {
  id: string;
  label?: string;
  placeholder?: string;
  type?: string;
  validation?: RegisterOptions;
  isDubleCheck?: BooleanStr;
} & React.ComponentPropsWithoutRef<'input'>;

export default function Input({
  id,
  label,
  placeholder,
  type,
  validation,
  isDubleCheck,
}: InputProps) {
  const {
    register,
    formState: { errors },
    resetField,
  } = useFormContext();

  // 중복확인 버튼 클릭 시 실행하는 함수
  const handleCheckId = (id: string) => {
    // 중복체크를 하는 시점에서 back에서 던져준 ok, error로 해당 state의 true false를 지정
    resetField(id);
  };

  return (
    <InputContainer>
      <InputLabel htmlFor={id}>{label}</InputLabel>
      <InputText
        {...register(id, validation)}
        type={type}
        name={id}
        id={id}
        placeholder={placeholder}
        isError="false"
      />

      <ErrorMessage
        errors={errors}
        name={id}
        render={({ message }) => <ErrorNotice>{message}</ErrorNotice>}
      />

      {/* 중복확인하는 컴포넌트 추가코드 */}
      {isDubleCheck === 'true' && (
        <div>
          {/* <Button type="button" onClick={e => handleCheckId(e, id)} /> */}
          <Button
            size="sm"
            text="중복확인"
            isgreen="true"
            handler={() => {
              handleCheckId(id);
            }}
          />
        </div>
      )}
    </InputContainer>
  );
}
