// ESC 눌렀을시 창 닫기
import { useEffect } from 'react';
import { NavigateFunction } from 'react-router-dom';

type Prop = {
  navigate: NavigateFunction;
};

export default function useHandleKeyBoard({ navigate }: Prop) {
  useEffect(() => {
    const getBackPage = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        navigate(-1);
      }
    };
    window.addEventListener('keydown', getBackPage);
    return () => window.removeEventListener('keydown', getBackPage);
  }, [navigate]);
}
