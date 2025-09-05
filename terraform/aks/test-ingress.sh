kubectl create namespace test-ingress

# tiny HTTP server
kubectl run hello-server -n test-ingress \
  --image=hashicorp/http-echo \
  --port=5678 \
  --restart=Never \
  -- \
  "-text=Hello from AKS"

# expose it inside cluster
kubectl expose pod hello-server -n test-ingress \
  --port=80 --target-port=5678

# ingress rule
cat <<EOF | kubectl apply -f -
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: hello-ingress
  namespace: test-ingress
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  ingressClassName: nginx
  rules:
  - host: test.devdeploy.site   # use any DNS record pointing to your LB IP
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: hello-server
            port:
              number: 80
EOF
