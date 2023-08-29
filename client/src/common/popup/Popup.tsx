import * as SC from './popup.styled.tsx';
import Button from '@/common/button/Button.tsx';
import { BooleanStr, Size, Handler } from '@/types/propType.ts';

interface Prop {
  title: string;
  handler: Handler[];
  isgreen?: BooleanStr[];
  btnsize?: Size[];
  buttontext?: string[];
  countbtn?: 1 | 2;
  popupcontrol: Handler;
}

export default function Popup({
  title,
  handler,
  isgreen = ['true', 'false'],
  btnsize = ['md', 'md'],
  buttontext = ['확인', '취소'],
  countbtn = 1,
  popupcontrol,
}: Prop) {
  return (
    <>
      <SC.PopupBackGround
        onClick={e => {
          e.preventDefault();
          popupcontrol();
        }}>
        <SC.PopupBox
          onClick={e => {
            e.stopPropagation();
          }}>
          <SC.Title>{title}</SC.Title>
          <SC.ButtonBox countbtn={`${countbtn}`}>
            {countbtn === 1 && (
              <Button
                size={btnsize[0]}
                isgreen={isgreen[0]}
                text={buttontext[0]}
                handler={handler[0]}
              />
            )}
            {countbtn === 2 && (
              <>
                <Button
                  size={btnsize[0]}
                  isgreen={isgreen[0]}
                  text={buttontext[0]}
                  handler={handler[0]}
                />
                <Button
                  size={btnsize[1]}
                  isgreen={isgreen[1]}
                  text={buttontext && buttontext[1]}
                  handler={handler[1]}
                />
              </>
            )}
          </SC.ButtonBox>
        </SC.PopupBox>
      </SC.PopupBackGround>
    </>
  );
}
