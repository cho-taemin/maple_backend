## Description

[메이플스토리 PC] 웹 백엔드 엔지니어 포지션의 과제전형

## Project setup

```bash
auth-server 
$ cd /auth-server
$ npm install

event-server
$ cd /event-server
$ npm install

gateway-server
$ cd /gateway-server
$ npm install
```

## Deployment

```bash
전체 배포
$ docker compose up --build -d

auth-server 배포
$ docker compose up --build -d auth

event-server 배포
$ docker compose up --build -d event

gateway-server 배포
$ docker compose up --build -d gateway
```

## 설계 내용 링크
https://sepia-aster-267.notion.site/Readme-md-1f976439b755800a83e2dc07099f1503
