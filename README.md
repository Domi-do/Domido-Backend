<div align="center">

![compressed_image_under_1MB (1)](https://github.com/user-attachments/assets/b78436a3-0832-4696-b9ce-71a4e1e6f4a6)

**Domido - 3D 도미노 시뮬레이터**<br/>
<sub>프로젝트 기간: 2025.05.19 - 2025.06.20</sub><br/>
<br/>
마우스로 직접 도미노를 배치하고, 중력의 법칙에 따라 쓰러지는 도미노의 연쇄 반응을 시뮬레이션할 수 있습니다.

</div>

<p align="center">
  <a href="https://trapezoidal-sort-f9c.notion.site/Domido-2000b8357eee80589a24f4556b81e092?source=copy_link">팀 협업문서</a>
  <span> | </span>
  <a href="https://www.domido.co.kr/">배포 사이트</a>
  <span> | </span>
  <a href="https://github.com/Domi-do/Domido">프론트엔드 저장소</a>
</p>

## 주요 기능

### 🚀 핵심 게임플레이

<table>
<tr>
<td width="45%">

- **3D 도미노 배치**: 마우스 클릭으로 정확한 위치에 배치
- **물리 시뮬레이션**: 중력과 충돌을 통한 현실적인 연쇄 반응
- **다양한 오브젝트**: 12가지 이상의 다양한 3D 오브젝트
- **실시간 멀티플레이**: 최대 4명까지 동시 협업

</td>
<td width="55%">

![Image](https://github.com/user-attachments/assets/6c83427c-19ed-47dc-b9f9-d2e660d76a08)

</td>
</tr>
</table>

### 🎨 커스터마이징

<table>
<tr>
<td width="45%">

- **색상 변경**: 9가지 색상 팔레트로 도미노 커스터마이징 기능
- **테마 변경**: 정원, 바다, 밤 테마로 배경 변경
- **음량 조절**: 배경음악과 효과음 개별 조절

</td>
<td width="55%">

![녹화_2025_07_23_17_03_29_833 (2)](https://github.com/user-attachments/assets/a48bbc64-3918-4cdc-8b85-e37d198e1ef2)

</td>
</tr>
</table>

### 👥 협업 기능

<table>
<tr>
<td width="45%">

- **실시간 동기화**: 다른 사용자의 도미노 배치 실시간 반영
- **커서 추적**: 다른 사용자의 마우스 커서 실시간 표시
- **프로젝트 공유**: 초대 코드를 통한 프로젝트 공유 및 참여

</td>
<td width="55%">

![화면-기록-2025-07-23-오후-5 02 09](https://github.com/user-attachments/assets/70660232-d9dc-41f3-8be4-57b88a5a277c)

</td>
</tr>
</table>

<br>


## 📊 ERD

![erd](https://github.com/user-attachments/assets/59317178-3e35-456a-9863-2315aecf8e9c)

- [ERD 상세 보기](https://dbdiagram.io/d/683efe8561dc3bf08d5d9140)

---

## 📄 API 명세서
- [API 명세서](https://www.notion.so/API-2000b8357eee814ab521d3849e9f114d)

---

## 🛠️ 기술 스택

### Backend
- **Core**: <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white"/>, <img src="https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white"/>, <img src="https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white"/>  
- **Database**: <img src="https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white"/>  
- **Realtime & Auth**: <img src="https://img.shields.io/badge/Socket.IO-010101?style=flat&logo=socketdotio&logoColor=white"/>, <img src="https://img.shields.io/badge/JSON_Web_Token-000000?style=flat&logo=JSONwebtokens&logoColor=white"/>  
- **Utilities**: <img src="https://img.shields.io/badge/Dotenv-ECD53F?style=flat&logo=dotenv&logoColor=black"/>, <img src="https://img.shields.io/badge/CORS-000000?style=flat&logo=CORS&logoColor=white"/>, <img src="https://img.shields.io/badge/Body_Parser-000000?style=flat&logo=bodyparser&logoColor=white"/>  
- **Quality & Dev Tools**: <img src="https://img.shields.io/badge/ESLint-4B32C3?style=flat&logo=eslint&logoColor=white"/>, <img src="https://img.shields.io/badge/Prettier-F7B93E?style=flat&logo=prettier&logoColor=white"/>, <img src="https://img.shields.io/badge/Husky-000000?style=flat&logo=husky&logoColor=white"/>, <img src="https://img.shields.io/badge/Lint-staged-000000?style=flat&logo=lintstaged&logoColor=white"/>, <img src="https://img.shields.io/badge/Nodemon-76D04B?style=flat&logo=nodemon&logoColor=black"/>, <img src="https://img.shields.io/badge/TSX-3178C6?style=flat&logo=typescript&logoColor=white"/>  

---

### 배포 환경 (AWS)

| 서비스                                              | 역할                                               |
|-----------------------------------------------------|----------------------------------------------------|
| <img src="https://img.shields.io/badge/AWS S3-569A31?style=flat&logo=amazons3&logoColor=white"/>           | 프론트엔드 정적 파일 (React 빌드) 저장             |
| <img src="https://img.shields.io/badge/AWS CloudFront-232F3E?style=flat&logo=amazonaws&logoColor=white"/> | CDN을 통한 프론트엔드 배포 및 캐싱 최적화           |
| <img src="https://img.shields.io/badge/AWS EC2-FF9900?style=flat&logo=amazonec2&logoColor=white"/>        | 백엔드 서버 호스팅 (Node.js + Express)             |
| <img src="https://img.shields.io/badge/PM2-2B037A?style=flat&logo=pm2&logoColor=white"/>                  | 백엔드 프로세스 관리 및 자동 재시작     
