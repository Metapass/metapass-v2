# Creating a deployment on gke

### Prerequisites

- Node >10.13
- [gcloud](https://cloud.google.com/sdk/docs/install-sdk)
- Docker
- Kubectl

## Setup GCloud Project

- `gcloud project set project [PROJECT_ID]`
- `gcloud config set compute/zone ap-south-1a`

## Create Docker Image

- Enable Container Registry API
- Make Dockerfile to install node, set workdir, copy everything to workdir, install packages, build next, CMD npm start and expose port 3000
- `docker build -t gcr.io/PROJECT_ID/app-name:latest --platform linux/amd64 . (platform mentioned cause mine was an m1 mac and the compute engine was running x64)`
- Verify if the image runs locally by running the image in a container
  `docker run --rm -d -p 3000:3000 gcr.io/PROJECT_ID/app-name:latest` (--rm will auto remove container when it exits, -d will run in detached mode, can also do docker ps + docker kill)
- `docker push gcr.io/PROJECT_ID/app-name:latest`

## Create GKE Cluster

- Enable Kubernetes Engine API
- `gcloud container clusters create clyster-name`( 3 node cluster by default)
- Verify using `kubectl get nodes`
- Create two yaml files, one for deployment and one for service
- Deployment.yaml

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: app-name
  labels:
    app: app-name
spec:
  selector:
    matchLabels:
      app: app-name
      tier: web
  template:
    metadata:
      labels:
        app: app-name
        tier: web
    spec:
      terminationGracePeriodSeconds: 30
      containers:
        - name: app-name-app
          image: gcr.io/PROJECT_ID/app-name:tag
          imagePullPolicy: Always
          ports:
            - containerPort: 3000
```

- kubectl apply -f deployment.yaml
- kubectl get deploy app-name

## Adding a load balancer(ingress)

- First make a static ip address
  `gcloud compute addresses create app-name-ip --global`
- Verify, it should display the ip `gcloud compute addresses describe app-name-ip --global`
- Create Service.yaml

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: app-name
  annotations:
    kubernetes.io/ingress.global-static-ip-name: app-name-ip
    kubernetes.io/ingress.class: 'gce'
    networking.gke.io/managed-certificates: tm-haproxy-managed-cert
  labels:
    app: app-name
spec:
  rules:
    - http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: app-name-backend
                port:
                  number: 8080
---
apiVersion: v1
kind: Service
metadata:
  name: app-name-backend
  labels:
    app: app-name
spec:
  type: NodePort
  selector:
    app: app-name
    tier: web
  ports:
    - port: 8080
      targetPort: 3000
---
apiVersion: networking.gke.io/v1
kind: ManagedCertificate
metadata:
  name: tm-haproxy-managed-cert
spec:
  domains:
    - app-name.com
```

Ingress here is like a network filter for your cluster that routes traffic appropriately. Services are dedicated constant abstraction of pods meaning pods can fail and be replaced but services dont so you an always rely on the service regardless of whether the pod was changed or not.I like to see it as have a backend which has multiple dbs with the same data, if one of the dbs fail it will simply query the other one. The managed certificate is for https.

- `kubectl apply -f service.yaml`
- Verify `kubectl get ingress` it should show you the ingress with static ip
- Now set this IP in your DNS A record and you should be able to access your app

# Updating the app

- Make changes to your app or even docker file
- Build docker using same command as before( you can cgange tags but you will have to change it everywhere else as well idk if theres a way for the pods to pull latest version number)
- Push docker image with same command
- If you have made changes to yaml files then use apply cmd again( no need to if you haven't)
- `kubectl rollout restart deployment` Will replace old revision with new one
- You're gtg!

# Debug and monitor

- `kubectl get pods` to see all pods
- `kubectl get ingress` to see all ingresses
- `kubectl logs [POD_NAME]` to see logs of your app
- `kubectl get services` to see all services
- `kubectl describe service [SERVICE_NAME]` to see more info about a service
- `kubectl get events` to see all events
- `kubectl describe pod [POD_NAME]` to see more info about a pod whether theres a failure etc.
- `kubectl exec -it [POD_NAME] -- cmd` to run cmmds in pod

[project_id]: metapass-supabase
[app-name]: app-name
