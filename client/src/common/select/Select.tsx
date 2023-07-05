import { useState, useRef } from 'react';
import useZipCode from '../../hook/useZipCode';
import { Size } from '../../types/propType';
import { changeCityCode, changeCountryCode } from '../../util/changezip';
import { SelectContainer, SelectInput } from './select.styled';

interface Prop {
  size: Size;
  direction: 'row' | 'column';
}

const BASE_PATTERN = '*00000000';

export default function SelectComponent({ size, direction }: Prop) {
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
  const { data: counrtyData } = useZipCode({
    zipPattern: BASE_PATTERN,
  });
  const { data: cityData } = useZipCode({
    zipPattern: countryCode as string,
    stoped: true,
    key: countryCode,
  });
  const { data: villageData } = useZipCode({
    zipPattern: cityCode as string,
    stoped: true,
    key: cityCode,
  });

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
          setZipNameCity(valueArr[1]);
          setZipNameVillage('');
        }}>
        <option>선택</option>
        {cityData &&
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
        <option>선택</option>
        {villageData &&
          villageData?.regcodes.slice(1).map(({ code, name }) => (
            <option key={code} value={name.split(' ')[2]}>
              {name.split(' ')[2]}
            </option>
          ))}
      </SelectInput>
    </SelectContainer>
  );
}
