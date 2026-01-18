# 🐋 Flask-K8s

Flask + React + Kubernetes 풀스택 이미지 갤러리 애플리케이션

---

## Preview

<img src="./screenshots/main.png" width="600">

## 프로젝트 구조

```
Flask-K8s/
├── backend/              # Flask API 서버
│   ├── homework.py       # 메인 애플리케이션
│   ├── requirements.txt  # Python 의존성
│   └── Dockerfile        # Backend 이미지
├── frontend/             # React 웹 앱
│   ├── src/
│   │   └── App.js        # 메인 컴포넌트
│   ├── package.json
│   └── Dockerfile        # Frontend 이미지
└── k8s/                  # Kubernetes 매니페스트
    ├── backend-deployment.yaml
    └── frontend-deployment.yaml
```

---

## 실행 방법

### 1. Minikube 시작 및 Docker 환경 설정

```bash
# Minikube 시작
minikube start --driver=docker

# Minikube Docker 환경 사용
eval $(minikube docker-env)
```

### 2. Docker 이미지 빌드

#### Backend 빌드

```bash
cd backend
docker build -t flask-backend:latest .
cd ..
```

#### Frontend 빌드

```bash
cd frontend
docker build -t react-frontend:latest .
cd ..
```

### 3. Kubernetes 배포

```bash
cd k8s

# Backend 배포
kubectl apply -f backend-deployment.yaml

# Frontend 배포
kubectl apply -f frontend-deployment.yaml

# 배포 상태 확인
kubectl get pods
kubectl get svc
```

### 4. 포트 포워딩

```bash
# Frontend 포트 포워딩 (백그라운드)
kubectl port-forward svc/react-service 3000:3000 &

# Backend 포트 포워딩 (백그라운드)
kubectl port-forward svc/flask-service 5000:5000 &
```

### 5. 애플리케이션 접속

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

---

## 주요 기능

### 1. User Information

- REST API를 통한 사용자 정보 조회
- JSON 형식으로 데이터 반환

### 2. Image Upload

- 파일 업로드 기능
- 카테고리별 분류 (Colleague, Family, Etc)
- 서버 측 파일 저장

### 3. Image Gallery

- 카테고리별 이미지 뷰어
- 전체 갤러리 보기
- 실시간 이미지 로딩

---

## 개발 환경에서 실행

### Backend (Flask)

```bash
cd backend
pip install -r requirements.txt
python homework.py
# http://localhost:5000
```

### Frontend (React)

```bash
cd frontend
npm install
npm start
# http://localhost:3000
```

---

## API 엔드포인트

### GET /friend

사용자 정보 조회

```json
{
  "name": "Lee Tae Soo",
  "birth": "2001-04-13",
  "phone": "010-1234-5678",
  "email": "lee@example.com",
  "mbti": "CUTE"
}
```

### POST /upload

이미지 업로드

- **Parameters**:
  - `file`: 이미지 파일
  - `category`: colleague | family | etc

### GET /gallery/{category}

카테고리별 이미지 목록 조회

```json
{
  "images": ["20251030_120000_image1.jpg", "..."]
}
```

### GET /uploads/{category}/{filename}

이미지 파일 다운로드

---

## 트러블슈팅

### Pod이 CrashLoopBackOff 상태일 때

```bash
# 로그 확인
kubectl logs <pod-name>

# Pod 상세 정보 확인
kubectl describe pod <pod-name>
```

### 포트 포워딩이 안 될 때

```bash
# 기존 포트포워딩 종료
pkill -f "port-forward"

# 다시 시도
kubectl port-forward svc/react-service 3000:3000
```

### 이미지가 보이지 않을 때

```bash
# Minikube Docker 환경 확인
eval $(minikube docker-env)

# 이미지 존재 확인
docker images | grep flask-backend
docker images | grep react-frontend

# 없으면 다시 빌드
```

### CORS 에러가 발생할 때

- Flask backend에 `flask-cors`가 설치되어 있는지 확인
- `homework.py`에 `CORS(app)` 설정 확인

---

## 배포 업데이트

코드 수정 후 배포:

```bash
# 1. 이미지 다시 빌드
eval $(minikube docker-env)
cd backend && docker build -t flask-backend:latest . && cd ..
cd frontend && docker build -t react-frontend:latest . && cd ..

# 2. Deployment 재시작
kubectl rollout restart deployment flask-backend
kubectl rollout restart deployment react-frontend

# 3. 상태 확인
kubectl get pods -w
```

---

## 정리

```bash
# Deployment 삭제
kubectl delete deployment flask-backend react-frontend

# Service 삭제
kubectl delete service flask-service react-service

# Minikube 정지
minikube stop

# Minikube 삭제 (완전 초기화)
minikube delete
```

---

## 참고 자료

- [Kubernetes 공식 문서](https://kubernetes.io/docs/)
- [Flask 공식 문서](https://flask.palletsprojects.com/)
- [React 공식 문서](https://react.dev/)
- [Minikube 공식 문서](https://minikube.sigs.k8s.io/docs/)

---
