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