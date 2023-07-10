import { useQuery } from '@tanstack/react-query';
import { useState, useRef, useEffect } from 'react';
import { getLocal } from '../../api/queryfn';
import useZipCode, { getData } from '../../hook/useZipCode';
import { Size } from '../../types/propType';
import { changeCityCode, changeCountryCode } from '../../util/changezip';
import { SelectContainer, SelectInput } from './select.styled';

interface Prop {
  size: Size;
  direction: 'row' | 'column';
  setZip: React.Dispatch<React.SetStateAction<string>>;
}

const BASE_PATTERN = '*00000000';

export default function SelectComponent({ size, direction, setZip }: Prop) {
  //state
  const [countryCode, setCountryCode] = useState<undefined | string>(undefined);
  const [cityCode, setCityCode] = useState<undefined | string>(undefined);

  // 실제 서버에 보낼 주소
  const [zipNameCountry, setZipNameCountry] = useState('');
  const [zipNameCity, setZipNameCity] = useState('');
  const [zipNameVillage, setZipNameVillage] = useState('');
  const zipRef = useRef('');
  //  주소 저장
  zipRef.current = `${zipNameCountry} ${zipNameCity} ${zipNameVillage}`;

  // hook 사용하기
  const { data: counrtyData, isLoading: countryLoading } = useQuery<getData>({
    queryKey: ['country'],
    queryFn: () => getLocal(BASE_PATTERN),
    staleTime: 1000 * 60 * 60,
    cacheTime: 1000 * 60 * 60,
  });
  const { data: cityData, isLoading: cityLdading } = useZipCode({
    zipPattern: countryCode as string,
    stoped: true,
    key: countryCode,
  });
  const { data: villageData, isLoading: villageLoading } = useZipCode({
    zipPattern: cityCode as string,
    stoped: true,
    key: cityCode,
  });

  // 초기 값 세팅
  useEffect(() => {
    if (!countryLoading) {
      setCountryCode(changeCountryCode(cityData?.regcodes[0].code as string));
      setZipNameCountry('서울특별시');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countryLoading]);

  useEffect(() => {
    setZip(zipRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zipRef.current, setZip]);

  return (
    <SelectContainer direction={direction}>
      <SelectInput
        name="country"
        id="country"
        selectsize={size}
        direction={direction}
        onChange={e => {
          const valueArr = e.target.value.split(' ');
          setCountryCode(changeCountryCode(valueArr[0]));
          setCityCode('');
          setZipNameCountry(valueArr[1]);
          setZipNameCity('');
          setZipNameVillage('');
        }}>
        {counrtyData &&
          counrtyData?.regcodes.map(({ code, name }) => (
            <option key={code} value={`${code} ${name}`}>
              {name}
            </option>
          ))}
      </SelectInput>

      <SelectInput
        name="city"
        selectsize={size}
        direction={direction}
        id="city"
        onChange={e => {
          const valueArr = e.target.value.split(' ');
          setCityCode(changeCityCode(valueArr[0]));
          setZipNameCity(valueArr[1] !== 'undefined' ? valueArr[1] : '');
          setZipNameVillage('');
        }}>
        <option value={''}>선택</option>
        {!cityLdading &&
          cityData?.regcodes.slice(1).map(({ code, name }) => (
            <option key={code} value={`${code} ${name.split(' ')[1]}`}>
              {name.split(' ')[1]}
            </option>
          ))}
      </SelectInput>

      <SelectInput
        name="city"
        id="city"
        selectsize={size}
        direction={direction}
        onChange={e => {
          setZipNameVillage(e.target.value);
        }}>
        <option value={''}>선택</option>
        {!villageLoading &&
          villageData?.regcodes.slice(1).map(({ code, name }) => (
            <option
              key={code}
              value={
                name.split(' ').length === 3
                  ? name.split(' ')[2]
                  : name.split(' ').length === 4
                  ? `${name.split(' ')[2]} ${name.split(' ')[3]}`
                  : ''
              }>
              {name.split(' ').length === 3
                ? name.split(' ')[2]
                : name.split(' ').length === 4
                ? `${name.split(' ')[2]} ${name.split(' ')[3]}`
                : ''}
            </option>
          ))}
      </SelectInput>
    </SelectContainer>
  );
}
