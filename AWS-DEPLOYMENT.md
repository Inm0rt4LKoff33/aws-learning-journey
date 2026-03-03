# KBLT API — AWS Deployment Guide

## Architecture
```
GitHub → CodePipeline → CodeBuild → ECR → ECS Fargate
                                              │
                                    ElastiCache (Redis)
                                    Supabase (PostgreSQL)
                                              │
                                    ALB (public HTTPS URL)
                                              │
                                         Vercel (frontend)
```

---

## Stage 1 — ECR (Container Registry)

Create a repository to store your Docker images.

```bash
aws ecr create-repository \
  --repository-name kblt-api \
  --region us-east-1
```

Note the `repositoryUri` from the output — you'll need it in later steps.

---

## Stage 2 — Secrets Manager

Store all sensitive values here instead of hardcoding them in the task definition. ECS pulls these at runtime.

```bash
# Run once for each secret
aws secretsmanager create-secret --name kblt/DATABASE_URL --secret-string "postgresql://..."
aws secretsmanager create-secret --name kblt/DIRECT_URL   --secret-string "postgresql://..."
aws secretsmanager create-secret --name kblt/REDIS_URL    --secret-string "rediss://..."
aws secretsmanager create-secret --name kblt/JWT_SECRET   --secret-string "your-64-char-hex"
aws secretsmanager create-secret --name kblt/CORS_ORIGIN  --secret-string "https://your-app.vercel.app"
```

---

## Stage 3 — ElastiCache (Redis)

1. Go to **ElastiCache → Create cluster**
2. Choose **Redis OSS**
3. Cluster mode: **Disabled** (single node is fine for portfolio)
4. Node type: **cache.t3.micro** (free tier eligible)
5. Place it in the **same VPC** as your ECS cluster
6. Note the **Primary endpoint** — this becomes your `REDIS_URL`:
   ```
   rediss://your-cluster.xxxxx.cache.amazonaws.com:6379
   ```
   Note the `rediss://` (with double s) — ElastiCache uses TLS by default.

Update the secret:
```bash
aws secretsmanager update-secret \
  --secret-id kblt/REDIS_URL \
  --secret-string "rediss://your-cluster.xxxxx.cache.amazonaws.com:6379"
```

---

## Stage 4 — IAM Roles

Two roles are needed for ECS.

**ecsTaskExecutionRole** — allows ECS to pull images from ECR and read secrets:
```bash
# Create the role
aws iam create-role \
  --role-name ecsTaskExecutionRole \
  --assume-role-policy-document '{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Principal":{"Service":"ecs-tasks.amazonaws.com"},"Action":"sts:AssumeRole"}]}'

# Attach AWS managed policies
aws iam attach-role-policy --role-name ecsTaskExecutionRole \
  --policy-arn arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy

aws iam attach-role-policy --role-name ecsTaskExecutionRole \
  --policy-arn arn:aws:iam::aws:policy/SecretsManagerReadWrite
```

**ecsTaskRole** — permissions your running container has (can be minimal for now):
```bash
aws iam create-role \
  --role-name ecsTaskRole \
  --assume-role-policy-document '{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Principal":{"Service":"ecs-tasks.amazonaws.com"},"Action":"sts:AssumeRole"}]}'
```

---

## Stage 5 — ECS Cluster + Service

1. Go to **ECS → Create cluster**
2. Name: `kblt-cluster`
3. Infrastructure: **AWS Fargate** (serverless)

**Register the task definition:**
- Update `ecs-task-definition.json` replacing all `YOUR_ACCOUNT_ID` and `YOUR_REGION` placeholders
- Go to **ECS → Task Definitions → Create new**
- Switch to JSON view and paste the file contents

**Create the service:**
1. Go to your cluster → **Create service**
2. Launch type: **Fargate**
3. Task definition: `kblt-api` (the one you just created)
4. Desired tasks: `1`
5. VPC: same VPC as ElastiCache
6. Security group: allow inbound on port 3001 from the ALB security group

**Create a CloudWatch log group:**
```bash
aws logs create-log-group --log-group-name /ecs/kblt-api --region us-east-1
```

---

## Stage 6 — ALB (Application Load Balancer)

The ALB gives your API a stable public HTTPS URL.

1. Go to **EC2 → Load Balancers → Create**
2. Type: **Application Load Balancer**
3. Scheme: **Internet-facing**
4. Listeners: **HTTPS on port 443** (requires an ACM certificate)
5. Target group: **IP type**, port 3001, health check path `/health`
6. Register your ECS service with this target group

**Get a free SSL certificate via ACM:**
1. Go to **Certificate Manager → Request certificate**
2. Add your domain (e.g. `api.kblt.com`) or use the ALB DNS name
3. Validate via DNS — add the CNAME record to your domain registrar

The ALB DNS name (e.g. `kblt-api-xxxxx.us-east-1.elb.amazonaws.com`) is your production API URL.

Update the CORS secret to your Vercel URL:
```bash
aws secretsmanager update-secret \
  --secret-id kblt/CORS_ORIGIN \
  --secret-string "https://your-app.vercel.app"
```

---

## Stage 7 — CodePipeline (CI/CD)

1. Go to **CodePipeline → Create pipeline**
2. Source: **GitHub (v2)** → connect your repo → branch: `main`
3. Build: **CodeBuild** → create a new project:
   - Environment: **Managed image**, Amazon Linux, Standard runtime
   - Privileged mode: **ON** (required for Docker builds)
   - Buildspec: **Use buildspec.yml in source**
   - Environment variables:
     ```
     AWS_DEFAULT_REGION = us-east-1
     AWS_ACCOUNT_ID     = your-12-digit-id
     ECR_REPO_NAME      = kblt-api
     CONTAINER_NAME     = kblt-api
     ```
4. Deploy: **Amazon ECS** → cluster: `kblt-cluster` → service: `kblt-api`
   - Image definitions file: `imagedefinitions.json`

Give the CodeBuild role permission to push to ECR:
```bash
aws iam attach-role-policy \
  --role-name codebuild-kblt-api-service-role \
  --policy-arn arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryPowerUser
```

---

## Stage 8 — Vercel (Frontend)

In your Vercel project dashboard → **Settings → Environment Variables**, add:

```
NEXT_PUBLIC_API_URL = https://kblt-api-xxxxx.us-east-1.elb.amazonaws.com
API_URL             = https://kblt-api-xxxxx.us-east-1.elb.amazonaws.com
```

Redeploy the frontend. Your Next.js app will now call the live AWS API.

---

## Verification Checklist

```bash
# 1. API health check
curl https://your-alb-url/health

# 2. Products endpoint
curl https://your-alb-url/products

# 3. Register a user
curl -X POST https://your-alb-url/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"password123"}'
```

---

## File Locations

| File | Location in repo |
|------|-----------------|
| `Dockerfile` | `apps/backend/kblt-api/Dockerfile` |
| `buildspec.yml` | `apps/backend/kblt-api/buildspec.yml` |
| `ecs-task-definition.json` | `apps/backend/kblt-api/ecs-task-definition.json` |
| `docker-compose.yml` | `aws-learning-journey/docker-compose.yml` |
