# K8s-Windows-WSL2

> CKA 자격증 준비를 위한 Kubernetes 학습 프로젝트

![Kubernetes](https://img.shields.io/badge/Kubernetes-326CE5?style=flat-square&logo=kubernetes&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white)
![Minikube](https://img.shields.io/badge/Minikube-F7931E?style=flat-square&logo=kubernetes&logoColor=white)

---

## Status

```
🚧 학습 진행 중
```

| Lab | 진행 상황 |
|-----|----------|
| Flask-K8s | ✅ 완료 |
| K8s-Troubleshooting | 🔄 진행 중 (2/4) |

---

## Labs

### 1. Flask-K8s

Flask + React + Kubernetes 3-tier 애플리케이션

```
Frontend (React) → Backend (Flask) → Database (PostgreSQL)
        ↓                ↓                  ↓
   Deployment       Deployment           StatefulSet
        ↓                ↓                  ↓
     Service          Service             Service
```

**학습 내용:**
- Deployment, Service, ConfigMap, Secret
- Pod 간 통신 및 서비스 디스커버리
- Ingress 설정

---

### 2. K8s-Troubleshooting

Kubernetes 배포 시 자주 발생하는 오류 해결 실습

| 시나리오 | 상태 | 설명 |
|----------|------|------|
| ImagePullBackOff | ✅ | 이미지 가져오기 실패 |
| CrashLoopBackOff | ✅ | 컨테이너 재시작 반복 |
| Pending | 🔲 | Pod 스케줄링 실패 |
| ConfigError | 🔲 | YAML 설정 오류 |

**디버깅 명령어:**
```bash
kubectl describe pod <pod-name>
kubectl logs <pod-name>
kubectl get events --sort-by='.lastTimestamp'
```

---

## Environment

| 항목 | 버전 |
|------|------|
| OS | Windows 11 + WSL2 (Ubuntu) |
| Kubernetes | Minikube / Docker Desktop |
| Tools | kubectl, helm |

---

## Quick Start

```bash
# Minikube 시작
minikube start

# 프로젝트 클론
git clone https://github.com/leelaeloo/K8s-Windows-WSL2.git
cd K8s-Windows-WSL2

# Lab 선택
cd Flask-K8s           # 3-tier 앱 배포
cd K8s-Troubleshooting # 트러블슈팅 실습
```

---

## Project Structure

```
K8s-Windows-WSL2/
├── Flask-K8s/                  # 3-tier 애플리케이션
│   ├── frontend/
│   ├── backend/
│   └── k8s/
└── K8s-Troubleshooting/        # 트러블슈팅 시나리오
    ├── ImagePullBackOff/       ✅
    ├── CrashLoopBackOff/       ✅
    ├── Pending/                🔲
    └── ConfigError/            🔲
```

---

## Related

- [MovieSir 프로젝트](https://github.com/Movigation) - 실제 운영 중인 인프라 프로젝트
- [클라우드 인프라 구축기](https://velog.io/@leelaeloo) - 기술 블로그

---

## Goal

```
[ ] CKA (Certified Kubernetes Administrator) 취득 준비 중
```
