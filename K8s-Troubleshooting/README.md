# 🐋 Kubernetes 트러블슈팅 시나리오

## 개요

실무에서 자주 발생하는 Kubernetes Pod 문제를 재현하고 해결하는 실습 프로젝트입니다.

## 학습 목표

- Kubernetes에서 발생하는 일반적인 에러 패턴 이해
- `kubectl` 명령어를 활용한 디버깅 능력 향상
- 문제 원인 분석 및 해결 경험 축적

## 환경

- **Kubernetes**: Minikube on WSL2
- **kubectl**: v1.28+
- **Namespace**: troubleshooting

---

## 시나리오 목록

### 1. [ImagePullBackOff](./ImagePullBackOff)

<img src="./ImagePullBackOff/screenshots/pod-status.png" width="500">

**문제**: 컨테이너 이미지를 가져오지 못함  
**원인**: 존재하지 않는 이미지 태그 사용  
**학습 포인트**:

- 이미지 레지스트리 인증
- 태그 검증
- imagePullSecrets 설정

[자세히 보기 →](./ImagePullBackOff)

---

### 2. [CrashLoopBackOff](./CrashLoopBackOff)

<img src="./CrashLoopBackOff/screenshots/pod-status.png" width="500">

**문제**: 컨테이너가 시작 후 계속 재시작됨  
**원인**: 필수 환경변수 누락  
**학습 포인트**:

- 컨테이너 로그 분석
- 환경변수 설정
- Exit Code 의미
- Exponential Backoff

[자세히 보기 →](./CrashLoopBackOff)

---

### 3. [Pending](./Pending)

**Coming Soon**

**문제**: Pod가 스케줄링되지 않음  
**예정 원인**:

- 리소스 부족 (CPU/Memory)
- Node Selector 불일치
- PVC 마운트 실패

---

### 4. [ConfigError](./ConfigError)

**Coming Soon**

**문제**: YAML 설정 오류  
**예정 원인**:

- 문법 오류
- 필수 필드 누락
- 잘못된 indentation

---

## 시작하기

### 1. 네임스페이스 생성

```bash
kubectl create namespace troubleshooting
```

### 2. 시나리오 선택 및 실행

```bash
cd ImagePullBackOff  # 원하는 시나리오로 이동
kubectl apply -f broken-deployment.yaml
kubectl get pods -n troubleshooting
```

### 3. 문제 분석

```bash
kubectl describe pod <pod-name> -n troubleshooting
kubectl logs <pod-name> -n troubleshooting
```

### 4. 해결 및 확인

```bash
kubectl apply -f fixed-deployment.yaml
kubectl get pods -n troubleshooting
```

---

## 트러블슈팅 플로우차트

```
Pod 문제 발견
    ↓
kubectl get pods
    ↓
┌─────────────────────────────────┐
│  STATUS 확인                     │
└─────────────────────────────────┘
    ↓
┌──────────┬──────────────┬──────────────┬──────────┐
│ Pending  │ ImagePull    │ CrashLoop    │ Error    │
│          │ BackOff      │ BackOff      │          │
└──────────┴──────────────┴──────────────┴──────────┘
    ↓            ↓              ↓              ↓
describe     describe        logs          logs
Events       Events          +             +
+            +               describe      describe
리소스확인    이미지확인       Exit Code
```

---

## 공통 디버깅 명령어

### 기본 확인

```bash
# Pod 상태 확인
kubectl get pods -n troubleshooting
kubectl get pods -n troubleshooting -o wide

# 실시간 모니터링
kubectl get pods -n troubleshooting -w
```

### 상세 정보

```bash
# Pod 상세 정보 (Events가 핵심!)
kubectl describe pod <pod-name> -n troubleshooting

# Events만 보기
kubectl describe pod <pod-name> -n troubleshooting | tail -20
```

### 로그 확인

```bash
# 현재 컨테이너 로그
kubectl logs <pod-name> -n troubleshooting

# 이전 컨테이너 로그 (재시작된 경우)
kubectl logs <pod-name> -n troubleshooting --previous

# 실시간 로그 (-f: follow)
kubectl logs <pod-name> -n troubleshooting -f

# 특정 컨테이너 로그 (멀티 컨테이너인 경우)
kubectl logs <pod-name> -c <container-name> -n troubleshooting
```

### 리소스 확인

```bash
# 리소스 사용량
kubectl top pod <pod-name> -n troubleshooting
kubectl top nodes

# Events 확인
kubectl get events -n troubleshooting --sort-by='.lastTimestamp'
```

### 대화형 디버깅

```bash
# Pod 내부 접속
kubectl exec -it <pod-name> -n troubleshooting -- /bin/bash

# 명령어 실행
kubectl exec <pod-name> -n troubleshooting -- env
kubectl exec <pod-name> -n troubleshooting -- ls -la
```

---

## 에러별 빠른 참조

| STATUS                         | 첫 번째 확인 사항           | 주요 명령어                 |
| ------------------------------ | --------------------------- | --------------------------- |
| **Pending**                    | Events, Node 리소스         | `describe pod`, `top nodes` |
| **ImagePullBackOff**           | 이미지 이름/태그, Secret    | `describe pod`              |
| **CrashLoopBackOff**           | 컨테이너 로그, Exit Code    | `logs`, `logs --previous`   |
| **Error**                      | 컨테이너 로그               | `logs`                      |
| **OOMKilled**                  | 메모리 사용량               | `top pod`, `describe pod`   |
| **CreateContainerConfigError** | ConfigMap, Secret 존재 여부 | `describe pod`              |

---

## 사전 준비사항

### 필수 도구

```bash
# kubectl 설치 확인
kubectl version --client

# Minikube 실행 확인
minikube status

# 네임스페이스 생성
kubectl create namespace troubleshooting
```

### 권장 도구

```bash
# k9s (선택사항 - 터미널 대시보드)
brew install k9s  # macOS
# 또는
curl -sS https://webinstall.dev/k9s | bash

# kubectx (네임스페이스 전환)
kubectl config set-context --current --namespace=troubleshooting
```

---

## 추가 학습 자료

### Kubernetes 공식 문서

- [Debug Pods](https://kubernetes.io/docs/tasks/debug/debug-application/debug-pods/)
- [Debug Services](https://kubernetes.io/docs/tasks/debug/debug-application/debug-service/)
- [Troubleshooting Applications](https://kubernetes.io/docs/tasks/debug/debug-application/)

### 유용한 도구

- [kubectl-debug](https://github.com/aylei/kubectl-debug) - 디버깅 컨테이너 추가
- [stern](https://github.com/wercker/stern) - 멀티 Pod 로그
- [kubetail](https://github.com/johanhaleby/kubetail) - 여러 Pod 로그 동시 확인

---

## 전체 정리

### 개별 시나리오 정리

```bash
kubectl delete -f <scenario>/broken-deployment.yaml
kubectl delete -f <scenario>/fixed-deployment.yaml
```

### 네임스페이스 전체 삭제

```bash
kubectl delete namespace troubleshooting
```

---

## 프로젝트 구조

```
K8s-Troubleshooting/
├── README.md                    # 이 파일
├── ImagePullBackOff/
│   ├── README.md
│   ├── broken-deployment.yaml
│   ├── fixed-deployment.yaml
│   ├── screenshots/
│   └── logs/
├── CrashLoopBackOff/
│   ├── README.md
│   ├── broken-deployment.yaml
│   ├── fixed-deployment.yaml
│   ├── screenshots/
│   └── logs/
├── Pending/
└── ConfigError/
```

---
