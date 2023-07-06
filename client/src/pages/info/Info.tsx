import { ErrorMessage } from '@hookform/error-message';
import { useForm } from 'react-hook-form';
import {
  ErrorNotice,
  InputContainer,
  InputText,
  Label,
} from '../../common/input/Input.styled';

type InfoProps = {
  nickname: string;
};
export function Component() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InfoProps>();

  const onSubmit = (data: InfoProps) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <InputContainer>
        <Label htmlFor="nickname">닉네임</Label>
        <InputText
          id="nickname"
          {...register('nickname', {
            required: '텍스트 필수입니다.',
          })}
          error={errors.nickname?.message}
        />
        <ErrorMessage
          errors={errors}
          name="nickname"
          render={({ message }) => <ErrorNotice>{message}</ErrorNotice>}
        />
      </InputContainer>
      <input type="submit" />
    </form>
  );
}

Component.displayName = 'Info';
