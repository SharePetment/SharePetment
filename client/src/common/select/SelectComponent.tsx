import { SelectInput } from '@/common/select/select.styled.tsx';
import { getData } from '@/hook/useZipCode';
import { BASE_CODE } from '@/util/region';

type Prop = {
  name: 'country' | 'city' | 'village';
  size: string;
  direction: string;
  fn: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  data: getData | undefined;
  isLoading: boolean;
};

export default function SelectComponent({
  size,
  direction,
  fn,
  name,
  data,
  isLoading,
}: Prop) {
  return (
    <>
      {!isLoading && (
        <SelectInput
          name={name}
          id={name}
          selectsize={size}
          direction={direction}
          onChange={fn}>
          {name === 'country' &&
            data?.regcodes.map(({ code, name }) => (
              <option key={code} value={`${code} ${name}`}>
                {BASE_CODE[name] === '제주특별자치도'
                  ? '제주'
                  : BASE_CODE[name] === '강원특별자치도'
                  ? '강원도'
                  : BASE_CODE[name]}
              </option>
            ))}

          {name === 'city' && <option value={' '}>선택</option>}
          {Array.isArray(data?.regcodes) &&
            name === 'city' &&
            data?.regcodes.slice(1).map(({ code, name }) => (
              <option key={code} value={`${code} ${name.split(' ')[1]}`}>
                {name.split(' ')[1]}
              </option>
            ))}

          {name === 'village' && <option value={' '}>선택</option>}
          {Array.isArray(data?.regcodes) &&
            name === 'village' &&
            data?.regcodes.slice(1).map(({ code, name }) => (
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
      )}
    </>
  );
}
