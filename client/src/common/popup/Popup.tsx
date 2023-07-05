import { BooleanStr, BtnSize, Handler } from '../../types/buttonType';
import Button from '../button/Button';
import { PopupBackGround, PopupBox, Title, ButtonBox } from './popup.styled';

interface Prop {
  title: string;
  handler: Handler[];
  isgreen: BooleanStr[];
  btnsize: BtnSize[];
  buttontext: string[];
  countbtn: 1 | 2;
  popupcontrol: Handler;
}

export default function Popup({
  title,
  handler,
  isgreen,
  btnsize,
  buttontext,
  countbtn,
  popupcontrol,
}: Prop) {
  return (
    <PopupBackGround
      onClick={e => {
        e.preventDefault();
        popupcontrol();
      }}>
      <PopupBox
        onClick={e => {
          e.stopPropagation();
        }}>
        <Title>{title}</Title>
        <ButtonBox>
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
                text={buttontext[1]}
                handler={handler[1]}
              />
            </>
          )}
        </ButtonBox>
      </PopupBox>
    </PopupBackGround>
  );
}
