<h1>📮 Share Petment</h1>
<div  align="center">
  <img width="40%" src="https://github.com/codestates-seb/seb44_main_018/assets/82816029/9df8aab4-d5c8-4502-8749-4897dd6af963" alt="roobits">
</div>
</br>

- **팀 명 :**  Team 색도18
- **프로젝트 명 :** Share Petment
- **프로젝트 기간 :** 2023.06.28 - 2023.7.24
- **한줄 소개 : 🐶 반려동물 일상 공유 SNS 및 산책 서비스 ‘Share Petment’**
- **팀원 :** 김준영(BE 팀장), 오민성, 손기배, 김다은(FE 부팀장), 이재린, 손준석
- **배포 링크 :** [📮 share-petment](https://sharepetment.site)

## 🛫 Intro
> 🐶 반려동물 일상 공유 SNS 및 산책 서비스 ‘Share Petment’
>
- ✍️ 다른 SNS말고, 반려동물을 키우는 사람들 사이에서 내 아이를 자랑하고 싶어요!
- 👍🏻실제로 키우고 있는 동물을 사진을 보고 좋아요를 누르고 싶어요!
- 💌 강아지, 고양이 말고 다른 귀여운 동물들 사진도 보고싶어요!
- 🧐 근데 그런 서비스가 있어요?


## 실행 방법 (로컬환경)
### 📌 <span style="color: red">_회원가입 시, 카카오 동의를 무조건 전체 동의한 후에 가입해주세요_</span>


```
# Client 
cd client
npm i
npm run dev
```

```
# Server
1. server/server-application/src/main/java/com/saecdo18/petmily/jwt/JwtAuthenticationFilter.java
  (33 line) 주석처리
  (34 line) 주석해제
2. server/server-application/src/main/java/com/saecdo18/petmily/kakaoLogin/service/KakaoService.java
  (51 line) 주석처리
  (52 line) 주석해제
3. mysql 설치 후 실행
  - 설치 후 application.yml 파일에서 자신의  mysql id, password 입력
  - mysql에 testdb 생성
4. redis 설치 후 실행
5. S3 생성 후 application.yml 파일에 S3 정보 입력
6. server/server-application/src/main/java/com/saecdo18/petmily/ServerApplication.java
Run 'ServerApplication.main()' 
```

## 👨‍👩‍👧‍👦 Team
| 김준영<br>(BE, 팀장) | 오민성<br>(BE) | 손기배<br>(BE) | 김다은<br>(FE, 부팀장) | 이재린<br>(FE) | 손준석<br> (FE) |
| :---: | :---: | :---: | :---: | :---: | :---: |
| <img width="100" alt="sharepetment flow" src="https://github.com/codestates-seb/seb44_main_018/assets/82816029/0f5fe22d-b2ef-4b5b-85a3-ffbe03a1429c">  | <img width="190" alt="오민성" src="https://github.com/codestates-seb/seb44_main_018/assets/82816029/d92bc9ae-e522-44fa-9fe7-35018e218931"> | <img width="190" alt="손기배" src="https://github.com/codestates-seb/seb44_main_018/assets/82816029/4073e035-a669-425c-bab0-9f7d76f2631d"> | <img width="125" alt="김다은" src="https://github.com/codestates-seb/seb44_main_018/assets/82816029/552cc2c2-b309-4f68-ac22-7e169ed43b3d"> | <img width="110" alt="이재린" src="https://github.com/codestates-seb/seb44_main_018/assets/82816029/dd95f800-5579-43b0-a334-d4e0e92aaa51"> | <img width="125" alt="손준석" src="https://github.com/codestates-seb/seb44_main_018/assets/82816029/d9dcbd97-5ffd-4bc5-be82-baf6d50f0196"> |
| [김준영](https://github.com/Junyoungs7) | [오민성](https://github.com/gutack54321) | [손기배](https://github.com/7lpear) | [김다은](https://github.com/ddaeunbb) | [이재린](https://github.com/leejaelll) |[손준석](https://github.com/kd02109) |
| - JWT<br> - Feed Function<br> - Building a deployment environment<br>| - Kakao Oauth2<br> - Member CRUD<br>  - Follow CRUD<br> - Pet CRUD<br>| - WalkMate <br> - WalkMate Comment <br>| - Home page<br> - Login page<br> - My page<br> - FeedPopUp page<br> - Feed CRUD<br> - Feed Comment CRUD<br> - useForm Login<br> - 404 page<br> - Responsive Design<br> - Deploy<br>| - Login page<br> - WalkMate page<br> - WalkFeed page<br> - WalkFeed CRUD<br> - WalkFeed Comment CRUD<br> - GEO API<br> - useForm login<br> - Pet PopUp<br> - Responsive Design<br> - Deploy<br> | - Home page<br> - WalkMate page<br> - WalkFeed page<br> - GEO API<br> - Kakao Map<br> - Pet PopUp<br> - Pet CRUD <br> - React Crop<br> - Responsive Design<br> - PWA<br> - Deploy<br>|





## 📺 Demo
<a href="https://www.youtube.com/watch?v=4TP6GJvfvts">유튜브 영상 링크</a>

<br />

## ➡️ User flow
<img width="60%" alt="sharepetment flow" src="https://github.com/codestates-seb/seb44_main_018/assets/82816029/12a2a583-6de0-4014-8c45-7567bf0dfe60">


## ➡️ 화면 정의서
### [피그마 링크](https://www.figma.com/file/X1rQFh5BxIihpJFPSMyyPU/Main-Project-Prototype?type=design&node-id=0-1&mode=design&t=fQ4k2PiuRBYK0vOI-0)

### Tools
| Git | Github | Discord | Notion |
| :---: | :---: | :---: |:---: |
| <img alt="git logo" src="https://git-scm.com/images/logos/logomark-orange@2x.png" width="65" height="65" > | <img alt="github logo" src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" width="65" height="65"> | <img alt="Discord logo" src="https://assets-global.website-files.com/6257adef93867e50d84d30e2/62595384e89d1d54d704ece7_3437c10597c1526c3dbd98c737c2bcae.svg" height="65" width="65"> |<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Notion-logo.svg/150px-Notion-logo.svg.png" alt="notion" height="65" width="65"> |
### Front-end
| Html | JavaScript | React | Styled-<br>Components  | esLint | axios | react-router-dom |
| :---: | :---: | :---: | :---: | :---: |  :---: |  :---: |
| <img alt="Html" src ="https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/HTML5_logo_and_wordmark.svg/440px-HTML5_logo_and_wordmark.svg.png" width="65" height="65" /> | <div style="display: flex; align-items: flex-start;"><img src="https://techstack-generator.vercel.app/js-icon.svg" alt="icon" width="75" height="75" /></div> | <div style="display: flex; align-items: flex-start;"><img src="https://techstack-generator.vercel.app/react-icon.svg" alt="icon" width="65" height="65" /></div> | <img src="https://styled-components.com/logo.png" alt="styled-components icon" width="65" height="65" /> | <div style="display: flex; align-items: flex-start;"><img src="https://techstack-generator.vercel.app/eslint-icon.svg" alt="icon" width="65" height="65" /></div> |<img src="https://axios-http.com/assets/logo.svg" width="65" height="65"/> | <img src="https://github.com/codestates-seb/seb44_main_018/assets/57277708/e4cfe63e-a388-4cde-bcd3-900ff30a2f4f" width="100" />
 |
<br>

|Prettier |  TypeScript |  React-query | Tailwindcss | React Hook Form | vite | husky |
|:---: | :---: | :---: | :---: | :---: |  :---: |  :---: | 
|<div style="display: flex; align-items: flex-start;"><img src="https://techstack-generator.vercel.app/prettier-icon.svg" alt="icon" width="65" height="65" /></div>  | <img src="https://techstack-generator.vercel.app/ts-icon.svg" alt="icon" width="75" height="75" /> |<img src="https://seeklogo.com/images/R/react-query-logo-1340EA4CE9-seeklogo.com.png" alt="icon" width="75" height="75" /> |<img src="https://avatars.githubusercontent.com/u/67109815?s=280&v=4" alt="icon" width="75" height="75" /> | <img alt="hook form" src="https://avatars.githubusercontent.com/u/53986236?s=48&v=4" /> | <img alt="Vite" src ="https://upload.wikimedia.org/wikipedia/commons/f/f1/Vitejs-logo.svg" width="50" height="65" />| <img alt='husky' src='https://github.com/codestates-seb/seb44_main_018/assets/57277708/5919837a-ab4d-43b5-8570-5d4edce92df4' width='100'/> |




### Back-end
| Java | mySQL | Rest | AWS | Spring | Spring<br>Boot | 
| :---: | :---: | :---: | :---: | :---: | :---: |
| <div style="display: flex; align-items: flex-start;"><img src="https://techstack-generator.vercel.app/java-icon.svg" alt="icon" width="65" height="65" /></div> | <div style="display: flex; align-items: flex-start;"><img src="https://techstack-generator.vercel.app/mysql-icon.svg" alt="icon" width="65" height="65" /></div> | <div style="display: flex; align-items: flex-start;"><img src="https://techstack-generator.vercel.app/restapi-icon.svg" alt="icon" width="65" height="65" /></div> | <div style="display: flex; align-items: flex-start;"><img src="https://techstack-generator.vercel.app/aws-icon.svg" alt="icon" width="65" height="65" /></div> | <img alt="spring logo" src="https://www.vectorlogo.zone/logos/springio/springio-icon.svg" height="50" width="50" > | <img alt="spring-boot logo" src="https://t1.daumcdn.net/cfile/tistory/27034D4F58E660F616" width="65" height="65" > |:---:| :---:| :---:| :---:| :---:|:---:|
Spring Security| Swagger | Redis| KaKao OAuth2 | Github Actions| Docker|
| <div style="display: flex;"><img src="https://cdn.discordapp.com/attachments/1123421841659273287/1132956123872370698/image.png" alt="icon" width="65" height="65" /></div>  | <div style="display: flex;"><img src="https://cdn.discordapp.com/attachments/1123421841659273287/1132956236569120879/Swagger-logo.png" alt="icon" width="65" height="65" /></div> | <div style="display: flex;"><img src="https://cdn.discordapp.com/attachments/1123421841659273287/1132956398054031400/tfile.png" alt="icon" width="65" height="65" /></div>  | <div style="display: flex;"><img src="https://cdn.discordapp.com/attachments/1123421841659273287/1132957662758326282/1e2x6biTeTNWeMc-C4aPogw.png" alt="icon" width="65" height="65" /></div> |<div style="display: flex;"><img src="https://cdn.discordapp.com/attachments/1123421841659273287/1132956694830383205/44036562.png" alt="icon" width="65" height="65" /></div> | <div style="display: flex;"><img src="https://techstack-generator.vercel.app/docker-icon.svg" alt="icon" width="65" height="65" /></div> |
<br/>




## 🌲 ERD
<a href="https://dbdiagram.io/d/649e3e2a02bd1c4a5e482416">ERD 링크</a>
<div style="display: flex;"><img src="https://cdn.discordapp.com/attachments/1123422149756067931/1132964064713261117/E18489E185B3E1848FE185B3E18485E185B5E186ABE18489E185A3E186BA_2023-07-17_E1848BE185A9E18492E185AE_8.png" /></div>

## API 명세서
[API 명세서.pdf 다운로드](https://github.com/codestates-seb/seb44_main_018/files/12143992/API.6b79986a7d904a4b90cc15b8b8d05af5.pdf)





## Screen Shot

| 로그인 화면 | 홈 화면 | 
| :---: | :---: |
|<img src="https://github.com/codestates-seb/seb44_main_018/assets/57277708/d5778b7b-fb4f-4dd9-a455-acde54604e56"  alt="home" width="500"/>| <img src="https://github.com/codestates-seb/seb44_main_018/assets/57277708/b86b8b82-9b3c-4d33-bfb2-6c8b0a944c9b" alt="feed" width="500"/>|

| 피드 상세 페이 | 산책 페이지 | 
| :---: | :---: |
|<img src="https://github.com/codestates-seb/seb44_main_018/assets/57277708/eea436f5-a095-4193-a9ba-588c46c00026"  alt="home" width="500"/>| <img src="https://github.com/codestates-seb/seb44_main_018/assets/57277708/7cf7e30b-eca5-429b-8471-904765e2aa11" alt="feed" width="500"/>|

| 산책 상세 페이지 | 산책 생성, 수정 페이지 | 
| :---: | :---: |
|<img src="https://github.com/codestates-seb/seb44_main_018/assets/57277708/f2adaa66-b7f1-401c-ae59-c30a82cbd4e1"  alt="home" width="500"/>| <img src="https://github.com/codestates-seb/seb44_main_018/assets/57277708/b28000bc-ea15-4e4b-85d5-eb7451bc3d59" alt="feed" width="500"/>|


| 마이 페이지 | 유저 페이지 | 
| :---: | :---: |
|<img src="https://github.com/codestates-seb/seb44_main_018/assets/57277708/7727b970-6207-4cb0-8b12-52a4a56ff018"  alt="home" width="500"/>| <img src="https://github.com/codestates-seb/seb44_main_018/assets/57277708/42883685-6946-4e4c-b708-5faab6779b75" alt="feed" width="500"/>|


| 유저 정보 수정 페이지 | 펫 등록 & 수정 페이지 | 
| :---: | :---: |
|<img src="https://github.com/codestates-seb/seb44_main_018/assets/57277708/ba31acb9-3ee2-4068-a8bd-ea2667279504"  alt="home" width="500"/>| <img src="https://github.com/codestates-seb/seb44_main_018/assets/57277708/79c8ec9e-51b4-4299-90a9-40828cfae9ec" alt="feed" width="500"/>|

