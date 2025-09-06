# 🛍️ EasyShop - Modern E-commerce Platform

[![Next.js](https://img.shields.io/badge/Next.js-14.1.0-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.1.1-green?style=flat-square&logo=mongodb)](https://www.mongodb.com/)
[![Redux](https://img.shields.io/badge/Redux-2.2.1-purple?style=flat-square&logo=redux)](https://redux.js.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

EasyShop is a modern, full-stack e-commerce platform built with Next.js 14, TypeScript, and MongoDB. It features a beautiful UI with Tailwind CSS, secure authentication, real-time cart updates, and a seamless shopping experience.

## ✨ Features

- 🎨 Modern and responsive UI with dark mode support
- 🔐 Secure JWT-based authentication
- 🛒 Real-time cart management with Redux
- 📱 Mobile-first design approach
- 🔍 Advanced product search and filtering
- 💳 Secure checkout process
- 📦 Multiple product categories
- 👤 User profiles and order history
- 🌙 Dark/Light theme support

## 🏗️ Architecture

EasyShop follows a three-tier architecture pattern:

### 1. Presentation Tier (Frontend)
- Next.js React Components
- Redux for State Management
- Tailwind CSS for Styling
- Client-side Routing
- Responsive UI Components

### 2. Application Tier (Backend)
- Next.js API Routes
- Business Logic
- Authentication & Authorization
- Request Validation
- Error Handling
- Data Processing

### 3. Data Tier (Database)
- MongoDB Database
- Mongoose ODM
- Data Models
- CRUD Operations
- Data Validation

## PreRequisites

> [!IMPORTANT]  
> Before you begin setting up this project, make sure the following tools are installed and configured properly on your system:

## Setup & Initialization <br/>

### 1. Install [Kubectl](https://kubernetes.io/docs/tasks/tools/#kubectl)
#### Linux
```bash
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl
kubectl version --client
```
### 2. Install [Helm](https://helm.sh/docs/intro/install/)
#### Linux
```bash
curl -fsSL -o get_helm.sh https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3
chmod 700 get_helm.sh
./get_helm.sh
```
### 3. Install Terraform
* Install Terraform<br/>
#### Linux & macOS
```bash
curl -fsSL https://apt.releases.hashicorp.com/gpg | sudo apt-key add -
sudo apt-add-repository "deb [arch=amd64] https://apt.releases.hashicorp.com $(lsb_release -cs) main"
sudo apt-get update && sudo apt-get install terraform
```
### Verify Installation
```bash
terraform -v
```
### Initialize Terraform
```bash
terraform init
```
### 4. Setup Azure CLI
Start by logging into Azure by run the following command and follow the prompts:

```az login --use-device-code```

###  Authentication with Azure CLI
Terraform needs to authenticate with Azure to create and manage resources. Since you are already logged in to the Azure CLI, you can run the following command to set up Terraform authentication:

```export ARM_SUBSCRIPTION_ID=$(az account show --query id -o tsv)```

> [!NOTE] 
> This environment variable will be used by Terraform to determine which Azure subscription to use when creating resources.

## Getting Started

> Follow the steps below to get your infrastructure up and running using Terraform:<br/>

1. **Clone the Repository:**
First, clone this repo to your local machine:<br/>
```bash
git clone https://github.com/emmanuelogar/End-to-End-Complete-CICD-Devops-Project.git
cd terraform/aks
```
2. **Initialize Terraform:**
Initialize the Terraform working directory to download required providers:
```bash
terraform init
```
3. **Review the Execution Plan:**
Before applying changes, always check the execution plan:
```bash
terraform plan
```
4. **Apply the Configuration:**
Now, apply the changes and create the infrastructure:
```bash
terraform apply
```
> Confirm with `yes` when prompted.

5. **Update your kubeconfig:**
Now, let's connect to the AKS cluster using the Azure CLI. You can do this by running the following command to pass Terraform outputs to the Azure CLI command:
```bash
az aks get-credentials \
--resource-group $(terraform output -raw rg_name) \
--name $(terraform output -raw aks_name)
```
6. **Check your cluster:**
```bash
kubectl get nodes
```

### Nginx ingress controller:<br/>
> 1. Install the Nginx Ingress Controller using Helm: Add the Nginx Ingress Controller Helm repository:
```bash
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo update
```
> 2. Install the Nginx Ingress Controller:
```bash
#> - move to the root directory of this repo: 
cd ../../
helm install nginx-ingress ingress-nginx/ingress-nginx \
  --namespace ingress-nginx --create-namespace \
  -f helm-values/ingress_nginx-values.yaml
```
> 3. Check the status of the Nginx Ingress Controller:
```bash
kubectl get pods -n ingress-nginx
```
> 4. Get the external IP address of the LoadBalancer service:
```bash
kubectl get svc -n ingress-nginx
```

### Install Cert-Manager

> 1. **Jetpack:** Add the Jetstack Helm repository:
```bash
helm repo add jetstack https://charts.jetstack.io
helm repo update
```
> 2. **Cert-Manager:** Install the Cert-Manager Helm chart:
```bash
helm install cert-manager jetstack/cert-manager \
  --namespace cert-manager \
  --create-namespace \
  --version v1.12.0 \
  --set installCRDs=true
``` 
> 3. **Check pods:**Check the status of the Cert-Manager pods:
```bash
kubectl get pods -n cert-manager
```

> 4. Apply the Clusterissuer:
```bash
kubectl apply -f helm-values/clusterissuer.yaml
```

> 5. **DNS Setup:** Find your IP from the LoadBalancer service:
```bash
kubectl get svc nginx-ingress-ingress-nginx-controller -n ingress-nginx \
  -o jsonpath='{.status.loadBalancer.ingress[0].ip}'
```
> 6. Create a DNS record for your domain pointing to the LoadBalancer IP.
> - Go to your godaddy dashboard or your prefered Domain name registrar and create a new A record and map the IP you just got in the terminal.

**1. Argo CD Setup**<br/>
1. Install Argo CD using helm  
(https://artifacthub.io/packages/helm/argo/argo-cd)

```bash
kubectl create namespace argocd
helm repo add argo https://argoproj.github.io/argo-helm
helm install argo-cd argo/argo-cd -f helm-values/argocd-values.yaml -n argocd
```
create easyshop namespace
```bash
kubectl create ns easyshop
```

2. add the record in your domain registrar “argocd.domain” with load balancer ip.

3. access it in browser.

4. Retrive the secret for Argocd

```jsx
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d
```

5. login to argocd “admin” and retrieved password

6. Change the password by going to “user info” tab in the UI.

**Deploy Your Application in Argo CD GUI**

> On the Argo CD homepage, click on the “New App” button.
> 

> Fill in the following details:
> 
> - **Application Name:** `Enter your desired app name`
> - **Project Name:** Select `default` from the dropdown.
> - **Sync Policy:** Choose `Automatic`.

> In the Source section:
> 
> - **Repo URL:** Add the Git repository URL that contains your Kubernetes helm.
> - **Path:** `Kubernetes/helm` (or the actual path inside the repo where your manifests reside)

> In the “Destination” section:
> 
> - **Cluster URL:** [https://kubernetes.default.svc](https://kubernetes.default.svc/) (usually shown as "default")
> - **Namespace:** easyshop (or your desired namespace)

### Install Metric Server

- metric server install through helm chart
```
https://artifacthub.io/packages/helm/metrics-server/metrics-server
```
verify metric server.
```
kubectl get pods -w
kubectl top pods
```
### Monitoring Using kube-prometheus-stack

```
https://artifacthub.io/packages/helm/prometheus-community/kube-prometheus-stack
```

```jsx
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm install my-kube-prometheus-stack prometheus-community/kube-prometheus-stack -f helm-values/kube-prom-stack.yaml \
    -n monitoring \
```

verify deployment :

```jsx
kubectl get pods -n monitoring
```

**Grafana:**

**Prometheus:** 

**Alertmanger:**

**Alerting to Slack** 

Create a new workspace in slack, create a new channel e.g. “#alerts”

go to https://api.slack.com/apps to create the webhook.

1. create an app “alertmanager”
2. go to incoming webhook
3. create a webhook and copy it.

Note: you can refer this DOCs for the slack configuration. “https://prometheus.io/docs/alerting/latest/configuration/#slack_config” 

get grafana secret “user = admin”

```jsx
kubectl --namespace monitoring get secrets my-kube-prometheus-stack-grafana -o jsonpath="{.data.admin-password}" | base64 -d ; echo
```

You would get the notification in the slack’s respective channel.

## **Logging**
- we will use elasticsearch for logstore, filebeat for log shipping and kibana for the visualization. 

**Install Elastic Search:**

```jsx
helm repo add elastic https://helm.elastic.co
helm install my-elasticsearch elastic/elasticsearch -f helm-values/elasticsearch.yaml  -n logging
```
make sure the pod is running .

```jsx
kubectl get po -n logging
NAME                     READY   STATUS    RESTARTS   AGE
elastic-operator-0       1/1     Running   0          6h33m
elasticsearch-master-0   1/1     Running   0          87m
```

**FileBeat:**

install filebeat for log shipping.

```jsx
helm repo add elastic https://helm.elastic.co
helm install my-filebeat elastic/filebeat -f helm-values/elasticsearch.yaml -n logging
```
Filebeat runs as a daemonset. check if its up.

```jsx
kubectl get po -n logging
NAME                         READY   STATUS    RESTARTS   AGE
elastic-operator-0           1/1     Running   0          6h38m
elasticsearch-master-0       1/1     Running   0          93m
my-filebeat-filebeat-g79qs   1/1     Running   0          25s
my-filebeat-filebeat-kh8mj   1/1     Running   0          25s
```

**Install Kibana:**

install kibana through helm.

```jsx
helm repo add elastic https://helm.elastic.co
helm install my-kibana elastic/kibana -n logging
```

Verify if it runs.

```jsx
k get po -n logging
NAME                               READY   STATUS    RESTARTS       AGE
elastic-operator-0                 1/1     Running   0              8h
elasticsearch-master-0             1/1     Running   0              3h50m
my-filebeat-filebeat-g79qs         1/1     Running   0              138m
my-filebeat-filebeat-jz42x         1/1     Running   0              108m
my-filebeat-filebeat-kh8mj         1/1     Running   1 (137m ago)   138m
my-kibana-kibana-559f75574-9s4xk   1/1     Running   0              130m
```

add all the records to dns registrar and give the value as load balancer IP. and try to access one by one. 

retrive the secret of elastic search as kibana’s password, username is “elastic”

```jsx
kubectl get secrets --namespace=logging elasticsearch-master-credentials -ojsonpath='{.data.password}' | base64 -d
```

## **Congratulations!** <br/>
![EasyShop Website Screenshot](./public/easyshop.JPG)

---

### 📌 Architecture Diagram
![Diagram](./public/diagram-export.JPG)

---

### 📌 ArgoCD
![ArgoCD](./public/Argocd.JPG)

---

### 📌 Capture
![Capture](./public/Capture.JPG)

---

### 📌 AlertManager
![AlertManager](./public/alertManager.JPG)


---

### 📌 Grafana Dashboard
![Grafana](./public/grafana.JPG)

---

### 📌 Kibana Logs View
![Kibana](./public/kibana.JPG)

---

### 📌 Prometheus Dashboard
![Prometheus](./public/prometheus.JPG)

### WO! ooo!!! ...Your project is now deployed.