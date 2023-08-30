import { ErrorMessage } from '@hookform/error-message';
import { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useReadLocalStorage } from 'usehooks-ts';
import { SERVER_URL } from '@/api/url.ts';
import { ReactComponent as Close } from '@/assets/button/close.svg';
import { ReactComponent as Man } from '@/assets/label/man.svg';
import { ReactComponent as Woman } from '@/assets/label/woman.svg';
import Button from '@/common/button/Button.tsx';
import * as SCINPUT from '@/common/input/Input.styled.tsx';
import AlertText from '@/common/popup/AlertText';
import * as SC from '@/common/popup/popup.styled.tsx';
import Popup from '@/common/popup/Popup.tsx';
import * as SCPET from '@/components/pet/petInfo.styled.tsx';
import PetProfile from '@/components/pet/petProfile/PetProfile.tsx';
import usePatchFormMutation from '@/hook/api/mutation/usePatchFormMutation';
import usePostFormMutation from '@/hook/api/mutation/usePostFormMutation';

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
  const accessToken = useReadLocalStorage<string | null>('accessToken');

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
  const petPostMutation = usePostFormMutation({
    key: ['myPage'],
    successFn: () => setIsOpened(false),
    errorFn: () => {
      setIsDisabled(false);
      setIsError(true);
    },
  });

  const petPatchMutation = usePatchFormMutation({
    key: ['myPage'],
    successFn: () => setIsOpened(false),
    errorFn: () => setIsError(true),
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
        accessToken,
      };
      petPostMutation.mutate(data);
    }
    if (method === 'patch') {
      const data = {
        formData,
        url: `${SERVER_URL}/pets/status/${petId}`,
        accessToken,
      };
      petPatchMutation.mutate(data);
    }
  };

  const onSubmit: SubmitHandler<Inputs> = data => handlePetPost(data);
  return (
    <>
      <SC.PopupBackGround>
        <SCPET.Container
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
          <SCPET.Form onSubmit={handleSubmit(onSubmit)}>
            <SCINPUT.InputContainer>
              <SCINPUT.Label htmlFor="name">이름</SCINPUT.Label>
              <SCINPUT.InputText
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
                render={({ message }) => (
                  <SCINPUT.ErrorNotice>{message}</SCINPUT.ErrorNotice>
                )}
              />
            </SCINPUT.InputContainer>
            <SCINPUT.InputContainer>
              <SCINPUT.Label htmlFor="age">나이</SCINPUT.Label>
              <SCINPUT.InputText
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
                render={({ message }) => (
                  <SCINPUT.ErrorNotice>{message}</SCINPUT.ErrorNotice>
                )}
              />
            </SCINPUT.InputContainer>
            <SCINPUT.InputContainer>
              <SCINPUT.Label>성별</SCINPUT.Label>
              <SCPET.RadioBox>
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
                      <SCINPUT.ErrorNotice>{message}</SCINPUT.ErrorNotice>
                    )}
                  />
                </div>
              </SCPET.RadioBox>
            </SCINPUT.InputContainer>
            <SCINPUT.InputContainer>
              <SCINPUT.Label htmlFor="information">짧은 자기소개</SCINPUT.Label>
              <SCINPUT.InputText
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
                render={({ message }) => (
                  <SCINPUT.ErrorNotice>{message}</SCINPUT.ErrorNotice>
                )}
              />
            </SCINPUT.InputContainer>
            <Button
              text="반려동물 등록"
              isgreen="true"
              size="lg"
              disabled={isDisabled}
            />
          </SCPET.Form>
        </SCPET.Container>
      </SC.PopupBackGround>
      {isError && (
        <Popup
          popupcontrol={() => {
            setIsError(false);
          }}
          title={AlertText.Photo}
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
