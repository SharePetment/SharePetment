import { FormProvider, useForm } from 'react-hook-form';
import Input, { InputProps } from '../../common/input/Input';

enum FieldNames {
  //각 input에 들어갈 label들을 정의해주세요
  email = 'email',
  nickname = 'nickname',
}

export type RegistrationFormFields = {
  // form마다 필요한 타입을 정의해주세요
  email: string;
  nickname: string;
};

const fieldOptions: { [key in FieldNames]: InputProps } = {
  //각 input에 들어갈 props들을 정의합니다.
  nickname: {
    id: 'nickname',
    label: 'Nickname',
    placeholder: '사용할 닉네임을 입력해주세요',
    type: 'text',
    validation: {
      pattern: {
        value: /^[ㄱ-ㅎ|가-힣|a-z|A-Z|0-9|]+$/,
        message: '삐빅 특수문자는 안됩니다.',
      },
      required: '필수입니다.',
    },
    isDubleCheck: 'true',
  },
  email: {
    id: 'email',
    label: '이메일',
    type: 'email',
    placeholder: '사용할 이메일을 입력해주세요',
    validation: {
      pattern: {
        value: /^\S+@\S+$/,
        message: '이메일 형식에 맞게 입력해주세요',
      },
      required: '필수입니다.',
    },
  },
};

export default function InfoForm() {
  const form = useForm({ mode: 'onChange' });

  const onSubmit = (data: unknown) => {
    // 회원가입 혹은 회원수정 버튼을 눌렀을 때 요청해야할 코드
    console.log(data);
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <NestedInputComponent />
      </form>
    </FormProvider>
  );
}

function NestedInputComponent() {
  return (
    <>
      <Input {...fieldOptions.nickname} />
      <Input {...fieldOptions.email} />
    </>
  );
}
