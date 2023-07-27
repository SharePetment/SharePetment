/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useReadLocalStorage } from 'usehooks-ts';
import { getServerDataWithJwt } from '../../api/queryfn.ts';
import { SERVER_URL } from '../../api/url.ts';
import { InputText } from '../../common/input/Input.styled.tsx';
import { UserInfo } from '../../types/userType.ts';

interface placeType {
  place_name: string;
  road_address_name: string;
  address_name: string;
  phone: string;
  place_url: string;
}

interface Prop {
  mainAddress: string;
  setMainAddress: React.Dispatch<React.SetStateAction<string>>;
  setDetailAddress: React.Dispatch<React.SetStateAction<string>>;
  setCoordinates: React.Dispatch<
    React.SetStateAction<{
      La: number;
      Ma: number;
    }>
  >;
}

export default function Map({
  mainAddress,
  setMainAddress,
  setDetailAddress,
  setCoordinates,
}: Prop) {
  // 마커를 담는 배열
  let markers: any[] = [];

  const accessToken = useReadLocalStorage('accessToken');

  // 쿼리를 통해 주소 값을 받아옵니다.
  const { isLoading } = useQuery<UserInfo>({
    queryKey: ['myMap'],
    queryFn: () =>
      getServerDataWithJwt(`${SERVER_URL}/members`, accessToken as string),
    onSuccess(data) {
      setMainAddress(data.address);
    },
  });

  // 지도 검색 기능
  const [searchKeyword, setSearchKeyword] = useState('');
  const [inputValue, setInputValue] = useState('');
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };
  const handleSendAddress = (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setSearchKeyword(inputValue);
    setInputValue('');
  };

  const { kakao }: any = window;
  // 마커를 생성합니다.

  useEffect(() => {
    const container = document.getElementById('myMap');

    const options = {
      center: new kakao.maps.LatLng(37.566, 126.977),
      level: 3,
    };
    // 지도를 생성합니다.
    const map = new kakao.maps.Map(container, options);
    const marker = new kakao.maps.Marker({
      map: map,
      position: map.getCenter(),
    });

    // 해당 유저가 지정한 주소 값을 바탕으로 최초 지도 마커 표시를 결정합니다.
    if (!isLoading) {
      // 주소-좌표 변환 객체를 생성합니다.
      const geocoder = new kakao.maps.services.Geocoder();
      // 주소로 좌표를 검색합니다..
      geocoder.addressSearch(mainAddress, function (result: any, status: any) {
        if (status === kakao.maps.services.Status.OK) {
          const coords = new kakao.maps.LatLng(result[0].y, result[0].x);
          // 결과값으로 받은 위치를 마커로 표시합니다
          marker.setPosition(coords);
          // state에 coords 값 저장
          setCoordinates(coords);
          // 지도의 중심을 결과값으로 받은 위치로 이동시킵니다
          map.setCenter(coords);
        }
      });
    }
    // typeControl 설정
    const mapTypeControl = new kakao.maps.MapTypeControl();
    map.addControl(mapTypeControl, kakao.maps.ControlPosition.TOPRIGHT);

    // zoomControl 설정
    const zoomControl = new kakao.maps.ZoomControl();
    map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);

    // 마커 클릭 핸들러
    const handlerMarker = (e: any) => {
      const latlng = e.latLng;
      marker.setPosition(latlng);
      map.setCenter(latlng);
      const geocoder = new kakao.maps.services.Geocoder();
      // callback 함수
      const callback = (result: any) => {
        const totalAddress = result[0].address;
        setMainAddress(
          `${totalAddress.region_1depth_name} ${totalAddress.region_2depth_name} ${totalAddress.region_3depth_name}`,
        );
        const detailAddress = totalAddress.sub_address_no
          ? `${totalAddress.main_address_no}-${totalAddress.sub_address_no}`
          : `${totalAddress.main_address_no}`;
        setDetailAddress(detailAddress);
      };
      geocoder.coord2Address(latlng.La, latlng.Ma, callback);
      setCoordinates({ La: latlng.La, Ma: latlng.Ma });
    };

    kakao.maps.event.addListener(map, 'click', handlerMarker);

    // 검색 기능 구현
    const keyword = searchKeyword;

    const ps = new kakao.maps.services.Places();
    const infowindow = new kakao.maps.InfoWindow({ zIndex: 1 });
    if (keyword) {
      searchPlaces();
    }

    // 키워드 검색을 요청하는 함수입니다
    function searchPlaces() {
      if (!keyword.replace(/^\s+|\s+$/g, '')) {
        alert('키워드를 입력해주세요!');
        return false;
      }
      // 장소검색 객체를 통해 키워드로 장소검색을 요청합니다
      ps.keywordSearch(keyword, placesSearchCB);
    }

    // 장소검색이 완료됐을 때 호출되는 콜백함수 입니다
    function placesSearchCB(data: any, status: any) {
      if (status === kakao.maps.services.Status.OK) {
        // 정상적으로 검색이 완료됐으면
        // 검색 목록과 마커를 표출합니다
        displayPlaces(data);
      } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
        alert('검색 결과가 존재하지 않습니다.');
        return;
      } else if (status === kakao.maps.services.Status.ERROR) {
        alert('검색 결과 중 오류가 발생했습니다.');
        return;
      }
    }

    // 검색 결과 목록과 마커를 표출하는 함수입니다
    function displayPlaces(places: string | any[]) {
      const listEl = document.getElementById('places-list'),
        menuEl = document.getElementById('search-result'),
        fragment = document.createDocumentFragment(),
        bounds = new kakao.maps.LatLngBounds();

      // 검색 결과 목록에 추가된 항목들을 제거합니다
      listEl && removeAllChildNods(listEl);

      // 지도에 표시되고 있는 마커를 제거합니다
      removeMarker();

      for (let i = 0; i < places.length; i++) {
        // 마커를 생성하고 지도에 표시합니다
        const placePosition = new kakao.maps.LatLng(places[i].y, places[i].x),
          marker = addMarker(placePosition, i),
          itemEl = getListItem(i, places[i]); // 검색 결과 항목 Element를 생성합니다

        // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
        // LatLngBounds 객체에 좌표를 추가합니다
        bounds.extend(placePosition);

        // 마커와 검색결과 항목에 mouseover 했을때
        // 해당 장소에 인포윈도우에 장소명을 표시합니다
        // mouseout 했을 때는 인포윈도우를 닫습니다
        (function (marker, title) {
          kakao.maps.event.addListener(marker, 'mouseover', function () {
            displayInfowindow(marker, title);
          });

          kakao.maps.event.addListener(marker, 'mouseout', function () {
            infowindow.close();
          });

          itemEl.onmouseover = function () {
            displayInfowindow(marker, title);
          };

          itemEl.onmouseout = function () {
            infowindow.close();
          };
        })(marker, places[i].place_name);

        fragment.appendChild(itemEl);
      }

      // 검색결과 항목들을 검색결과 목록 Element에 추가합니다
      listEl && listEl.appendChild(fragment);
      if (menuEl) {
        menuEl.scrollTop = 0;
      }

      // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
      map.setBounds(bounds);
    }
    // list item에 클릭 함수 추가
    const handleAddress = (address: string) => {
      const addressArr = address.split(' ');
      setMainAddress(`${addressArr[0]} ${addressArr[1]} ${addressArr[2]}`);
      addressArr[3] && setDetailAddress(`${addressArr[3]}`);

      const geocoder = new kakao.maps.services.Geocoder();
      geocoder.addressSearch(address, function (result: any, status: any) {
        if (status === kakao.maps.services.Status.OK) {
          const coords = new kakao.maps.LatLng(result[0].y, result[0].x);
          setCoordinates({ La: coords.La, Ma: coords.Ma });
          // 결과값으로 받은 위치를 마커로 표시합니다

          marker.setPosition(coords);
          // 지도의 중심을 결과값으로 받은 위치로 이동시킵니다
          map.setCenter(coords);
        }
      });
    };

    // 검색결과 항목을 Element로 반환하는 함수입니다
    function getListItem(index: number, places: placeType) {
      const el = document.createElement('li');

      const itemStr = `
          <div id='list_${index}' class="flex border-y border-[#d9d9d9] px-3 py-2 cursor-pointer" >
            <span class="marker marker_${index + 1} mr-2 ">
              ${index + 1}.
            </span>
            <div>
              <h5 class="font-semibold text-lg hover:text-deepgreen max-sm:text-base">${
                places.place_name
              }</h5>
              ${
                places.road_address_name
                  ? `<span class="info-item road-address-name">
                    ${places.road_address_name}
                   </span>`
                  : `<span class="info-item address-name">
             	     ${places.address_name}
                  </span>`
              }
            </div>
          </div>`;
      el.innerHTML = itemStr;
      el.className = `li_${index}`;
      el.addEventListener('click', () => {
        handleAddress(places.address_name);
      });
      return el;
    }

    // 마커를 생성하고 지도 위에 마커를 표시하는 함수입니다
    function addMarker(position: any, idx: number) {
      const imageSrc =
          'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_number_blue.png', // 마커 이미지 url, 스프라이트 이미지를 씁니다
        imageSize = new kakao.maps.Size(36, 37), // 마커 이미지의 크기
        imgOptions = {
          spriteSize: new kakao.maps.Size(36, 691), // 스프라이트 이미지의 크기
          spriteOrigin: new kakao.maps.Point(0, idx * 46 + 10), // 스프라이트 이미지 중 사용할 영역의 좌상단 좌표
          offset: new kakao.maps.Point(13, 37), // 마커 좌표에 일치시킬 이미지 내에서의 좌표
        },
        markerImage = new kakao.maps.MarkerImage(
          imageSrc,
          imageSize,
          imgOptions,
        ),
        marker = new kakao.maps.Marker({
          position: position, // 마커의 위치
          image: markerImage,
        });

      marker.setMap(map); // 지도 위에 마커를 표출합니다
      markers.push(marker); // 배열에 생성된 마커를 추가합니다

      return marker;
    }

    // 지도 위에 표시되고 있는 마커를 모두 제거합니다
    function removeMarker() {
      for (let i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
      }
      markers = [];
    }

    // 검색결과 목록 또는 마커를 클릭했을 때 호출되는 함수
    // 인포윈도우에 장소명을 표시
    function displayInfowindow(marker: any, title: string) {
      const content =
        '<div class="p-5 z-1 w-[230px]"><span>' + title + '</span></div>';

      infowindow.setContent(content);
      infowindow.open(map, marker);
    }

    // 검색결과 목록의 자식 Element를 제거하는 함수
    function removeAllChildNods(el: HTMLElement) {
      while (el.hasChildNodes()) {
        el.lastChild && el.removeChild(el.lastChild);
      }
    }
  }, [isLoading, mainAddress, searchKeyword]);

  return (
    <div className="flex flex-col items-center mb-1">
      <div className="relative">
        <InputText
          placeholder="주소 검색"
          type="text"
          value={inputValue}
          onChange={handleInput}
        />
        <button
          onClick={handleSendAddress}
          className="font-semibold border border-[#d9d9d9] px-3 py-1 rounded-xl
           bg-deepgreen text-[#ffffff] absolute right-2 top-[12px] text-sm">
          검색
        </button>
      </div>
      <div className="flex  mt-3 justify-between gap-5 max-sm:w-80 max-sm:flex-col">
        {searchKeyword ? (
          <div id="search-result" className="h-[400px]">
            <p className="mb-3">
              <span className="font-semibold">{searchKeyword} </span>
              {!!searchKeyword && '검색결과'}
            </p>
            <div className="no-scrollbar w-100 h-[300px] overflow-y-scroll max-sm:w-[300px]">
              <ul id="places-list" className="flex flex-col"></ul>
            </div>
            <div id="pagination" className="flex mt-2"></div>
          </div>
        ) : null}

        <div id="myMap" className="h-[350px] w-[350px] max-sm:w-[300px]"></div>
      </div>
    </div>
  );
}
