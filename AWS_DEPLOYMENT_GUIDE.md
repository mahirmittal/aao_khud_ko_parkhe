# AWS Deployment Guide for CG Portal Feedback System

## ☁️ Complete AWS Deployment - Step by Step Guide

This guide provides multiple AWS deployment options for the Chhattisgarh Government Portal Feedback System, from simple to enterprise-grade solutions.

## Table of Contents
1. [AWS Prerequisites](#aws-prerequisites)
2. [Deployment Options Overview](#deployment-options-overview)
3. [Option 1: EC2 with Docker (Simplest)](#option-1-ec2-with-docker-simplest)
4. [Option 2: ECS with Fargate (Recommended)](#option-2-ecs-with-fargate-recommended)
5. [Option 3: EKS (Enterprise)](#option-3-eks-enterprise)
6. [Option 4: Serverless with Lambda](#option-4-serverless-with-lambda)
7. [Database Options](#database-options)
8. [Security Configuration](#security-configuration)
9. [Cost Optimization](#cost-optimization)
10. [Monitoring and Logging](#monitoring-and-logging)
11. [CI/CD Pipeline Setup](#cicd-pipeline-setup)

---

## AWS Prerequisites

### 1. AWS Account Setup
1. **Create AWS Account**: https://aws.amazon.com/
2. **Install AWS CLI**:
   ```bash
   # Windows (using Chocolatey)
   choco install awscli
   
   # Mac (using Homebrew)
   brew install awscli
   
   # Linux
   curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
   unzip awscliv2.zip
   sudo ./aws/install
   ```

3. **Configure AWS CLI**:
   ```bash
   aws configure
   # Enter your Access Key ID
   # Enter your Secret Access Key
   # Default region: us-east-1 (or your preferred region)
   # Default output format: json
   ```

### 2. Required AWS Services
- **Compute**: EC2, ECS, or EKS
- **Database**: RDS (MongoDB Atlas) or DocumentDB
- **Storage**: S3 for static files
- **Networking**: VPC, Security Groups, Load Balancer
- **DNS**: Route 53 (optional)
- **SSL**: Certificate Manager

### 3. Cost Estimation
- **Small Setup (EC2)**: $20-50/month
- **Medium Setup (ECS)**: $50-150/month
- **Large Setup (EKS)**: $150-500/month

---

## Deployment Options Overview

| Option | Best For | Complexity | Cost | Scalability |
|--------|----------|------------|------|-------------|
| EC2 + Docker | Beginners, Small Apps | Low | $20-50/mo | Manual |
| ECS Fargate | Production Apps | Medium | $50-150/mo | Auto |
| EKS | Enterprise | High | $150-500/mo | Enterprise |
| Lambda | Specific Use Cases | Medium | Variable | Auto |

---

## Option 1: EC2 with Docker (Simplest)

### Perfect for: Small to medium applications, beginners to AWS

### Step 1: Launch EC2 Instance

1. **Go to EC2 Console**: https://console.aws.amazon.com/ec2/
2. **Launch Instance**:
   - **AMI**: Ubuntu Server 22.04 LTS
   - **Instance Type**: t3.medium (2 vCPU, 4GB RAM)
   - **Storage**: 20GB GP3
   - **Security Group**: Create new with ports 22, 80, 443, 3000, 8081

3. **Security Group Rules**:
   ```
   Type          Protocol    Port Range    Source
   SSH           TCP         22            Your IP/0.0.0.0/0
   HTTP          TCP         80            0.0.0.0/0
   HTTPS         TCP         443           0.0.0.0/0
   Custom TCP    TCP         3000          0.0.0.0/0
   Custom TCP    TCP         8081          Your IP
   ```

### Step 2: Connect and Setup

```bash
# Connect to EC2 instance
ssh -i "your-key.pem" ubuntu@your-ec2-public-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker ubuntu
sudo systemctl enable docker
sudo systemctl start docker

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verify installation
docker --version
docker-compose --version
```

### Step 3: Deploy Application

```bash
# Clone your repository
git clone https://github.com/prince04kumar/cg_portal_feedback.git
cd cg_portal_feedback

# Create production environment file
cat > .env.production << EOF
MONGODB_URI=mongodb://admin:password123@localhost:27017/cg_portal_feedback?authSource=admin
MONGO_ROOT_USERNAME=admin
MONGO_ROOT_PASSWORD=password123
NODE_ENV=production
PORT=3000
NEXTAUTH_URL=http://your-ec2-public-ip:3000
NEXTAUTH_SECRET=$(openssl rand -base64 32)
EOF

# Start services
docker-compose up -d

# Check status
docker-compose ps
```

### Step 4: Setup Nginx (Optional)

```bash
# Install Nginx
sudo apt install nginx -y

# Create Nginx config
sudo tee /etc/nginx/sites-available/cg-portal << EOF
server {
    listen 80;
    server_name your-domain.com your-ec2-public-ip;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# Enable site
sudo ln -s /etc/nginx/sites-available/cg-portal /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## Option 2: ECS with Fargate (Recommended)

### Perfect for: Production applications, auto-scaling needs

### Step 1: Create ECR Repository

```bash
# Create ECR repository for your application
aws ecr create-repository --repository-name cg-portal-feedback --region us-east-1

# Get login command
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com
```

### Step 2: Build and Push Docker Image

```bash
# Build production image
docker build -t cg-portal-feedback .

# Tag for ECR
docker tag cg-portal-feedback:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/cg-portal-feedback:latest

# Push to ECR
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/cg-portal-feedback:latest
```

### Step 3: Create ECS Cluster

```bash
# Create ECS cluster
aws ecs create-cluster --cluster-name cg-portal-cluster --capacity-providers FARGATE

# Create task execution role (save this as task-execution-role-policy.json)
cat > task-execution-role-policy.json << EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "ecs-tasks.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF

# Create IAM role
aws iam create-role --role-name ecsTaskExecutionRole --assume-role-policy-document file://task-execution-role-policy.json
aws iam attach-role-policy --role-name ecsTaskExecutionRole --policy-arn arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy
```

### Step 4: Create Task Definition

```json
{
  "family": "cg-portal-task",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "1024",
  "memory": "2048",
  "executionRoleArn": "arn:aws:iam::<account-id>:role/ecsTaskExecutionRole",
  "containerDefinitions": [
    {
      "name": "nextjs-app",
      "image": "<account-id>.dkr.ecr.us-east-1.amazonaws.com/cg-portal-feedback:latest",
      "portMappings": [
        {
          "containerPort": 3000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "NODE_ENV",
          "value": "production"
        },
        {
          "name": "MONGODB_URI",
          "value": "your-mongodb-connection-string"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/cg-portal",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
```

### Step 5: Create ECS Service

```bash
# Register task definition
aws ecs register-task-definition --cli-input-json file://task-definition.json

# Create service
aws ecs create-service \
  --cluster cg-portal-cluster \
  --service-name cg-portal-service \
  --task-definition cg-portal-task:1 \
  --desired-count 2 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-xxx,subnet-yyy],securityGroups=[sg-xxx],assignPublicIp=ENABLED}"
```

---

## Option 3: EKS (Enterprise)

### Perfect for: Large-scale applications, microservices, enterprise needs

### Step 1: Install kubectl and eksctl

```bash
# Install kubectl
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl

# Install eksctl
curl --silent --location "https://github.com/weaveworks/eksctl/releases/latest/download/eksctl_$(uname -s)_amd64.tar.gz" | tar xz -C /tmp
sudo mv /tmp/eksctl /usr/local/bin
```

### Step 2: Create EKS Cluster

```bash
# Create EKS cluster (takes 15-20 minutes)
eksctl create cluster \
  --name cg-portal-cluster \
  --version 1.24 \
  --region us-east-1 \
  --nodegroup-name standard-workers \
  --node-type t3.medium \
  --nodes 3 \
  --nodes-min 1 \
  --nodes-max 4 \
  --managed
```

### Step 3: Deploy Application to EKS

```yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: cg-portal-deployment
spec:
  replicas: 3
  selector:
    matchLabels:
      app: cg-portal
  template:
    metadata:
      labels:
        app: cg-portal
    spec:
      containers:
      - name: nextjs-app
        image: <account-id>.dkr.ecr.us-east-1.amazonaws.com/cg-portal-feedback:latest
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "production"
        - name: MONGODB_URI
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: mongodb-uri
---
apiVersion: v1
kind: Service
metadata:
  name: cg-portal-service
spec:
  selector:
    app: cg-portal
  ports:
  - port: 80
    targetPort: 3000
  type: LoadBalancer
```

```bash
# Apply deployment
kubectl apply -f deployment.yaml

# Check status
kubectl get pods
kubectl get services
```

---

## Option 4: Serverless with Lambda

### Perfect for: API-heavy applications, cost optimization

### Step 1: Install Serverless Framework

```bash
npm install -g serverless
serverless login
```

### Step 2: Create serverless.yml

```yaml
service: cg-portal-feedback

provider:
  name: aws
  runtime: nodejs18.x
  region: us-east-1
  environment:
    MONGODB_URI: ${env:MONGODB_URI}
    NODE_ENV: production

functions:
  api:
    handler: lambda.handler
    events:
      - http:
          path: /{proxy+}
          method: ANY
          cors: true
      - http:
          path: /
          method: ANY
          cors: true

plugins:
  - serverless-next-js
  - serverless-offline

custom:
  serverless-offline:
    httpPort: 3000
```

### Step 3: Deploy

```bash
# Deploy to AWS
serverless deploy

# Check status
serverless info
```

---

## Database Options

### Option A: MongoDB Atlas (Recommended)
```bash
# 1. Create Atlas account: https://www.mongodb.com/cloud/atlas
# 2. Create cluster (M0 Free tier available)
# 3. Get connection string
# 4. Update MONGODB_URI in environment
```

### Option B: AWS DocumentDB
```bash
# Create DocumentDB cluster
aws docdb create-db-cluster \
  --db-cluster-identifier cg-portal-docdb \
  --engine docdb \
  --master-username admin \
  --master-user-password YourSecurePassword123 \
  --vpc-security-group-ids sg-xxxxxxxx \
  --db-subnet-group-name default
```

### Option C: Self-hosted MongoDB on EC2
```bash
# Launch separate EC2 instance for MongoDB
# Install MongoDB
# Configure security groups
# Setup backup strategy
```

---

## Security Configuration

### 1. VPC Setup
```bash
# Create VPC
aws ec2 create-vpc --cidr-block 10.0.0.0/16

# Create subnets
aws ec2 create-subnet --vpc-id vpc-xxx --cidr-block 10.0.1.0/24 --availability-zone us-east-1a
aws ec2 create-subnet --vpc-id vpc-xxx --cidr-block 10.0.2.0/24 --availability-zone us-east-1b
```

### 2. Security Groups
```bash
# Web tier security group
aws ec2 create-security-group \
  --group-name web-tier-sg \
  --description "Security group for web tier" \
  --vpc-id vpc-xxx

# Database tier security group
aws ec2 create-security-group \
  --group-name db-tier-sg \
  --description "Security group for database tier" \
  --vpc-id vpc-xxx
```

### 3. SSL Certificate
```bash
# Request SSL certificate
aws acm request-certificate \
  --domain-name your-domain.com \
  --domain-name *.your-domain.com \
  --validation-method DNS
```

### 4. Secrets Management
```bash
# Store secrets in AWS Secrets Manager
aws secretsmanager create-secret \
  --name cg-portal/database \
  --description "Database credentials" \
  --secret-string '{"username":"admin","password":"YourSecurePassword123"}'
```

---

## Cost Optimization

### 1. Right-sizing Instances
```bash
# Use AWS Cost Explorer
# Monitor CloudWatch metrics
# Consider Reserved Instances for production
```

### 2. Auto Scaling
```yaml
# Auto Scaling configuration
Resources:
  AutoScalingGroup:
    Type: AWS::AutoScaling::AutoScalingGroup
    Properties:
      MinSize: 1
      MaxSize: 10
      DesiredCapacity: 2
      TargetGroupARNs:
        - !Ref ApplicationLoadBalancerTargetGroup
```

### 3. Spot Instances (for non-critical workloads)
```bash
# Use Spot instances for development/testing
aws ec2 run-instances \
  --image-id ami-xxx \
  --instance-type t3.medium \
  --instance-market-options '{"MarketType":"spot","SpotOptions":{"MaxPrice":"0.05"}}'
```

---

## Monitoring and Logging

### 1. CloudWatch Setup
```bash
# Create log group
aws logs create-log-group --log-group-name /aws/ecs/cg-portal

# Create custom metrics
aws cloudwatch put-metric-data \
  --namespace "CG-Portal" \
  --metric-data MetricName=UserLogins,Value=1,Unit=Count
```

### 2. Application Monitoring
```javascript
// Add to your Next.js app
const AWS = require('aws-sdk');
const cloudwatch = new AWS.CloudWatch();

// Custom metrics
const putMetric = (metricName, value) => {
  const params = {
    Namespace: 'CG-Portal',
    MetricData: [
      {
        MetricName: metricName,
        Value: value,
        Unit: 'Count'
      }
    ]
  };
  cloudwatch.putMetricData(params).promise();
};
```

### 3. Alerting
```bash
# Create CloudWatch alarm
aws cloudwatch put-metric-alarm \
  --alarm-name "High-CPU-Usage" \
  --alarm-description "Alarm when CPU exceeds 80%" \
  --metric-name CPUUtilization \
  --namespace AWS/ECS \
  --statistic Average \
  --period 300 \
  --threshold 80 \
  --comparison-operator GreaterThanThreshold \
  --evaluation-periods 2
```

---

## CI/CD Pipeline Setup

### 1. GitHub Actions Workflow
```yaml
# .github/workflows/deploy.yml
name: Deploy to AWS

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v1
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1

      - name: Build and push Docker image
        run: |
          aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin ${{ secrets.ECR_REGISTRY }}
          docker build -t ${{ secrets.ECR_REGISTRY }}/cg-portal-feedback:${{ github.sha }} .
          docker push ${{ secrets.ECR_REGISTRY }}/cg-portal-feedback:${{ github.sha }}

      - name: Deploy to ECS
        run: |
          aws ecs update-service --cluster cg-portal-cluster --service cg-portal-service --force-new-deployment
```

### 2. AWS CodePipeline
```bash
# Create CodePipeline
aws codepipeline create-pipeline --cli-input-json file://pipeline.json
```

---

## Production Checklist

### Before Going Live
- [ ] **Security**: Change all default passwords
- [ ] **SSL**: Configure HTTPS with valid certificates
- [ ] **Backup**: Setup automated database backups
- [ ] **Monitoring**: Configure CloudWatch alarms
- [ ] **Scaling**: Configure auto-scaling policies
- [ ] **DNS**: Setup Route 53 with custom domain
- [ ] **CDN**: Consider CloudFront for static assets
- [ ] **WAF**: Setup Web Application Firewall
- [ ] **Load Testing**: Perform load testing
- [ ] **Disaster Recovery**: Plan and test DR procedures

### Performance Optimization
- [ ] **Caching**: Implement Redis/ElastiCache
- [ ] **CDN**: Setup CloudFront distribution
- [ ] **Database**: Optimize queries and indexes
- [ ] **Image Optimization**: Use S3 + CloudFront
- [ ] **Compression**: Enable gzip compression
- [ ] **Minification**: Minify CSS/JS assets

---

## Cost Estimates

### Small Setup (EC2)
- **EC2 t3.medium**: ~$25/month
- **EBS 20GB**: ~$2/month
- **Data Transfer**: ~$5/month
- **Total**: ~$32/month

### Medium Setup (ECS)
- **Fargate (2 tasks)**: ~$60/month
- **Application Load Balancer**: ~$20/month
- **MongoDB Atlas M10**: ~$57/month
- **Data Transfer**: ~$10/month
- **Total**: ~$147/month

### Large Setup (EKS)
- **EKS Control Plane**: ~$73/month
- **EC2 Worker Nodes (3x t3.medium)**: ~$75/month
- **Load Balancer**: ~$20/month
- **MongoDB Atlas M30**: ~$95/month
- **Data Transfer**: ~$20/month
- **Total**: ~$283/month

---

## Support and Troubleshooting

### Common AWS Issues

1. **Permission Denied**
   ```bash
   # Check IAM permissions
   aws iam list-attached-role-policies --role-name your-role
   ```

2. **Service Unavailable**
   ```bash
   # Check service health
   aws ecs describe-services --cluster your-cluster --services your-service
   ```

3. **High Costs**
   ```bash
   # Use AWS Cost Explorer
   # Set up billing alerts
   aws budgets create-budget --account-id 123456789012 --budget file://budget.json
   ```

### Getting Help
- **AWS Support Center**: https://console.aws.amazon.com/support/
- **AWS Documentation**: https://docs.aws.amazon.com/
- **AWS Forums**: https://forums.aws.amazon.com/
- **Stack Overflow**: Tag your questions with 'amazon-web-services'

---

## Conclusion

This guide provides multiple deployment options for the CG Portal Feedback System on AWS:

- ✅ **EC2 + Docker**: Simple, cost-effective for small applications
- ✅ **ECS Fargate**: Managed containers, auto-scaling, production-ready
- ✅ **EKS**: Enterprise-grade Kubernetes for complex applications
- ✅ **Lambda**: Serverless option for specific use cases

Choose the option that best fits your:
- **Budget constraints**
- **Technical expertise**
- **Scalability requirements**
- **Maintenance preferences**

For government applications, we recommend starting with **ECS Fargate** for its balance of simplicity, scalability, and cost-effectiveness.

**Happy Deploying! 🚀☁️**
