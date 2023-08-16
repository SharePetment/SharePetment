import { useState, useRef, useEffect } from 'react';
import { SelectContainer } from '@/common/select/select.styled.tsx';
import SelectComponent from '@/common/select/SelectComponent';
import useZipCode from '@/hook/useZipCode.tsx';
import { Size } from '@/types/propType.ts';
import { changeCityCode, changeCountryCode } from '@/util/changezip.ts';
import { BASE_CODE, BASE_PATTERN } from '@/util/region';

interface Prop {
  size: Size;
  direction: 'row' | 'column';
  setZip: React.Dispatch<React.SetStateAction<string>>;
}

export default function Select({ size, direction, setZip }: Prop) {
  //state
  const [countryCode, setCountryCode] = useState<undefined | string>(undefined);
  const [cityCode, setCityCode] = useState<undefined | string>(undefined);

  // 실제 서버에 보낼 주소
  const [zipNameCountry, setZipNameCountry] = useState('');
  const [zipNameCity, setZipNameCity] = useState('');
  const [zipNameVillage, setZipNameVillage] = useState('');
  const zipRef = useRef('');
  //  주소 저장
  zipRef.current = `${zipNameCountry} ${zipNameCity} ${zipNameVillage}`.trim();

  const { data: counrtyData, isLoading: countryLoading } = useZipCode({
    zipPattern: BASE_PATTERN,
    stoped: true,
    type: 'country',
  });
  const { data: cityData, isLoading: cityLdading } = useZipCode({
    zipPattern: countryCode as string,
    stoped: true,
    key: countryCode,
    type: 'city',
  });
  const { data: villageData, isLoading: villageLoading } = useZipCode({
    zipPattern: cityCode as string,
    stoped: true,
    key: cityCode,
    type: 'village',
  });

  const handleCountry = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const valueArr = e.target.value.split(' ');
    setCountryCode(changeCountryCode(valueArr[0]));
    setCityCode('');
    setZipNameCountry(BASE_CODE[valueArr[1]]);
    setZipNameCity('');
    setZipNameVillage('');
  };

  const handleCity = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const valueArr = e.target.value.split(' ');
    setCityCode(changeCityCode(valueArr[0]));
    setZipNameCity(valueArr[1] !== 'undefined' ? valueArr[1] : '');
    setZipNameVillage(' ');
  };

  const handleVillage = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setZipNameVillage(e.target.value);
  };
  // 초기 값 세팅
  useEffect(() => {
    if (!countryLoading) {
      setCountryCode(changeCountryCode(cityData?.regcodes[0].code as string));
      setZipNameCountry(BASE_CODE.서울특별시);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countryLoading]);

  useEffect(() => {
    setZip(zipRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zipRef.current, setZip]);
  return (
    <>
      {
        <SelectContainer direction={direction}>
          <SelectComponent
            name={'country'}
            size={size}
            direction={direction}
            fn={handleCountry}
            data={counrtyData}
            isLoading={countryLoading}
          />
          <SelectComponent
            name={'city'}
            size={size}
            direction={direction}
            fn={handleCity}
            data={cityData}
            isLoading={cityLdading}
          />
          <SelectComponent
            name={'village'}
            size={size}
            direction={direction}
            fn={handleVillage}
            data={villageData}
            isLoading={villageLoading}
          />
        </SelectContainer>
      }
    </>
  );
}
