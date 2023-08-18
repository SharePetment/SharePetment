/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect } from 'react';
import { ReactComponent as Kakao } from '@/assets/label/kakao-talk.svg';
import * as FC from '@/components/map-show/showMap.styled';

interface Prop {
  address: string;
  lat: string | undefined;
  lng: string | undefined;
}

export default function ShowMap({ address, lat, lng }: Prop) {
  const { kakao }: any = window;

  useEffect(() => {
    const container = document.getElementById('myMap');
    const LA = Number(lat);
    const MA = Number(lng);
    const options = {
      center: new kakao.maps.LatLng(MA, LA),
      level: 3,
    };

    // 지도를 생성합니다.
    const map = new kakao.maps.Map(container, options);
    // 마커를 생성합니다.
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const marker = new kakao.maps.Marker({
      map: map,
      position: map.getCenter(),
    });
    //

    // typeControl 설정
    const mapTypeControl = new kakao.maps.MapTypeControl();
    map.addControl(mapTypeControl, kakao.maps.ControlPosition.TOPRIGHT);

    // zoomControl 설정
    const zoomControl = new kakao.maps.ZoomControl();
    map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);

    // 지도 드래그 기능 막기
    function setDraggable(draggable: boolean) {
      // 마우스 드래그로 지도 이동 가능여부를 설정합니다
      map.setDraggable(draggable);
    }
    setDraggable(true);
  }, [address, lat, lng]);

  return (
    <>
      <FC.Wrapper>
        <FC.Address>{address}</FC.Address>
        <FC.Map id="myMap" />
        <FC.Button>
          <FC.KakaoHref
            target="_blank"
            href={`https://map.kakao.com/link/map/${lng},${lat}`}>
            <Kakao />
            카카오맵
          </FC.KakaoHref>
        </FC.Button>
      </FC.Wrapper>
    </>
  );
}
