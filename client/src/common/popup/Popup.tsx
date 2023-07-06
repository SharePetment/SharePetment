import { BooleanStr, Size, Handler } from '../../types/propType';
import Button from '../button/Button';
import {
  PopupBackGround,
  PopupBox,
  Title,
  ButtonBox,
  Overlay,
} from './popup.styled';

interface Prop {
  title: string;
  handler: Handler[];
  isgreen: BooleanStr[];
  btnsize: Size[];
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
    <div className="relative">
      <Overlay />
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
    </div>
  );
}
