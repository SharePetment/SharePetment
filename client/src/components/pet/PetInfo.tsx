import { ErrorMessage } from '@hookform/error-message';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useReadLocalStorage } from 'usehooks-ts';
import { patchPet, postPet } from '../../api/mutationfn.ts';
import { SERVER_URL } from '../../api/url.ts';
import { ReactComponent as Close } from '../../assets/button/close.svg';
import { ReactComponent as Man } from '../../assets/label/man.svg';
import { ReactComponent as Woman } from '../../assets/label/woman.svg';
import Button from '../../common/button/Button.tsx';
import {
  ErrorNotice,
  InputContainer,
  InputText,
  Label,
} from '../../common/input/Input.styled.tsx';
import { PopupBackGround } from '../../common/popup/popup.styled.tsx';
import Popup from '../../common/popup/Popup.tsx';
import { Container, Form, RadioBox } from './petInfo.styled.tsx';
import PetProfile from './petProfile/PetProfile.tsx';

type Prop = {
  isOpend: boolean;
  setIsOpened: React.Dispatch<React.SetStateAction<boolean>>;
  method: 'post' | 'patch';
  petId?: number;
  profile?: string;
  name?: string;
  age?: number;
  sex?: string;
  information?: string;
};

type Inputs = {
  name: string;
  age: number;
  information: string;
  radio: string;
};

export default function PetInfo(prop: Prop) {
  // 사용하는 것만 추리기
  const { petId, profile, name, age, sex, information, method, setIsOpened } =
    prop;

  // 버튼 disabled
  const [isDisabled, setIsDisabled] = useState(false);

  // token
  const accessToken = useReadLocalStorage<string>('accessToken');

  // 유저 정보 refatch
  const queryClient = useQueryClient();

  // 프로필에 사용
  const [image, setImage] = useState(profile);
  const [file, setFile] = useState<File | null>(null);

  // form data 작성
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<Inputs>();

  useEffect(() => {
    setValue('radio', sex as string);
  }, [setValue, sex]);

  // mutation error handle
  const [isError, setIsError] = useState(false);

  // mutation 작성
  const petPostMutation = useMutation({
    mutationFn: postPet,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myPage'] });
      setIsOpened(false);
    },
    onError: () => {
      setIsDisabled(false);
      setIsError(true);
    },
  });

  const petPatchMutation = useMutation({
    mutationFn: patchPet,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myPage'] });
      setIsOpened(false);
    },
    onError: () => setIsError(true),
  });

  // submit Handler 작성
  const handlePetPost = async (data: Inputs) => {
    setIsDisabled(true);
    const { name, age, information, radio } = data;
    const formData = new FormData();
    formData.append('name', name);
    formData.append('age', `${age}`);
    formData.append('information', information);
    formData.append('sex', radio);
    formData.append('species', '동물');
    formData.append('images', file as File);

    if (!file) {
      const newFile = new File([], 'test', { type: 'image/png' });
      formData.append('images', newFile);
    }

    if (method === 'post') {
      const data = {
        formData,
        url: `${SERVER_URL}/pets`,
        accessToken: accessToken as string,
      };
      petPostMutation.mutate(data);
    }
    if (method === 'patch') {
      const data = {
        formData,
        url: `${SERVER_URL}/pets/status/${petId}`,
        accessToken: accessToken as string,
      };
      petPatchMutation.mutate(data);
    }
  };

  const onSubmit: SubmitHandler<Inputs> = data => handlePetPost(data);
  return (
    <>
      <PopupBackGround>
        <Container
          onClick={e => {
            e.stopPropagation();
          }}>
          <Close
            fill="black"
            className="absolute top-5 right-5 cursor-pointer"
            onClick={() => {
              setIsOpened(false);
            }}
          />
          <PetProfile
            image={image}
            setImage={setImage}
            baseImage={profile as string}
            setFile={setFile}
          />
          <Form onSubmit={handleSubmit(onSubmit)}>
            <InputContainer>
              <Label htmlFor="name">이름</Label>
              <InputText
                defaultValue={name ? name : ''}
                {...register('name', {
                  required: '텍스트 필수입니다.',
                  minLength: {
                    value: 1,
                    message: '최소글자는 1, 최대 글자는 10입니다',
                  },
                  maxLength: {
                    value: 10,
                    message: '최소글자는 1, 최대 글자는 10입니다',
                  },
                  pattern: {
                    value: /^(?!.*\s)[\p{L}\p{N}]+$/u,
                    message: '공백과 특수기호를 제거해주세요.',
                  },
                })}
                id="name"
                error={errors.name?.message}
              />
              <ErrorMessage
                errors={errors}
                name="name"
                render={({ message }) => <ErrorNotice>{message}</ErrorNotice>}
              />
            </InputContainer>
            <InputContainer>
              <Label htmlFor="age">나이</Label>
              <InputText
                defaultValue={age ? age : 0}
                {...register('age', {
                  required: '텍스트 필수입니다.',
                  min: {
                    value: 0,
                    message: '양수만 입력해주세요.',
                  },
                  max: {
                    value: 100,
                    message: '100살이면 충분하지요?',
                  },
                })}
                id="age"
                type="number"
                error={errors.age?.message}
              />
              <ErrorMessage
                errors={errors}
                name="age"
                render={({ message }) => <ErrorNotice>{message}</ErrorNotice>}
              />
            </InputContainer>
            <InputContainer>
              <Label>성별</Label>
              <RadioBox>
                <div className="flex items-center">
                  <label htmlFor="man" className="mr-2">
                    <Man />
                  </label>
                  <input
                    {...register('radio', {
                      required: true,
                    })}
                    type="radio"
                    value="수컷"
                    id="man"
                  />
                </div>
                <div className="flex items-center">
                  <label htmlFor="girl" className="mr-2">
                    <Woman />
                  </label>
                  <input
                    {...register('radio', {
                      required: {
                        value: true,
                        message: '필수입니다.',
                      },
                    })}
                    type="radio"
                    value="암컷"
                    id="girl"
                  />
                  <ErrorMessage
                    errors={errors}
                    name="radio"
                    render={({ message }) => (
                      <ErrorNotice>{message}</ErrorNotice>
                    )}
                  />
                </div>
              </RadioBox>
            </InputContainer>
            <InputContainer>
              <Label htmlFor="information">짧은 자기소개</Label>
              <InputText
                defaultValue={information ? information : ''}
                {...register('information', {
                  maxLength: {
                    value: 15,
                    message: '최대 작성 글자 수는 15자 입니다.',
                  },
                })}
                id="information"
                error={errors.information?.message}
              />
              <ErrorMessage
                errors={errors}
                name="information"
                render={({ message }) => <ErrorNotice>{message}</ErrorNotice>}
              />
            </InputContainer>
            <Button
              text="반려동물 등록"
              isgreen="true"
              size="lg"
              disabled={isDisabled}
            />
          </Form>
        </Container>
      </PopupBackGround>
      {isError && (
        <Popup
          popupcontrol={() => {
            setIsError(false);
          }}
          btnsize={['md']}
          countbtn={1}
          title="실패했습니다. 최대 이미지 크기는 5MB입니다. 반드시 프로필을 포함해주세요!"
          isgreen={['true']}
          buttontext={['확인']}
          handler={[
            () => {
              setIsError(false);
            },
          ]}
        />
      )}
    </>
  );
}
