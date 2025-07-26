# ECS Deployment Guide for Cryptics API

This guide explains how to deploy the Cryptics API to AWS ECS using the provided task definition and deployment scripts.

## Prerequisites

### AWS Setup
1. **AWS CLI** installed and configured with appropriate permissions
2. **Docker** installed and running
3. **AWS Account** with ECS, ECR, and IAM permissions

### Required AWS Services
- **Amazon ECS** - Container orchestration
- **Amazon ECR** - Container registry
- **AWS Secrets Manager** - Database password storage
- **Amazon CloudWatch** - Logging
- **AWS IAM** - Roles and permissions

## Files Overview

### 1. `ecs-task-definition.json`
Complete ECS task definition with:
- **Fargate compatibility** (256 CPU, 512 MB memory)
- **Two containers**: PostgreSQL database and Node.js API
- **Health checks** for both containers
- **CloudWatch logging** configuration
- **Secrets management** for database password

### 2. `docker-compose.ecs.yml`
Docker Compose file optimized for ECS deployment with:
- **AWS CloudWatch logging** driver
- **External secrets** integration
- **Health check** configurations
- **Environment variable** templating

### 3. `deploy-ecs.sh`
Automated deployment script that:
- Builds and pushes Docker image to ECR
- Updates ECS task definition
- Deploys to ECS service
- Waits for deployment completion

## Setup Instructions

### Step 1: Configure AWS Environment Variables

```bash
export AWS_ACCOUNT_ID="123456789012"
export AWS_REGION="us-east-1"
export ECR_REPOSITORY="cryptics-api"
export ECS_CLUSTER="cryptics-cluster"
export ECS_SERVICE="cryptics-api-service"
```

### Step 2: Create AWS Secrets Manager Secret

```bash
# Create database password secret
aws secretsmanager create-secret \
    --name "cryptics-db-password" \
    --description "Database password for Cryptics API" \
    --secret-string "your-secure-database-password" \
    --region $AWS_REGION
```

### Step 3: Create IAM Roles

#### ECS Task Execution Role
```bash
aws iam create-role \
    --role-name ecsTaskExecutionRole \
    --assume-role-policy-document '{
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
    }'

aws iam attach-role-policy \
    --role-name ecsTaskExecutionRole \
    --policy-arn arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy
```

#### ECS Task Role (for application permissions)
```bash
aws iam create-role \
    --role-name ecsTaskRole \
    --assume-role-policy-document '{
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
    }'
```

### Step 4: Create CloudWatch Log Group

```bash
aws logs create-log-group \
    --log-group-name "/ecs/cryptics-api" \
    --region $AWS_REGION
```

### Step 5: Create ECS Cluster

```bash
aws ecs create-cluster \
    --cluster-name $ECS_CLUSTER \
    --capacity-providers FARGATE \
    --default-capacity-provider-strategy capacityProvider=FARGATE,weight=1 \
    --region $AWS_REGION
```

### Step 6: Deploy Application

```bash
# Make sure you're in the api directory
cd /path/to/cryptics/api

# Run the deployment script
./deploy-ecs.sh
```

## Task Definition Configuration

### Resource Allocation
- **CPU**: 256 CPU units (0.25 vCPU)
- **Memory**: 512 MB
- **Network Mode**: awsvpc (required for Fargate)

### Container Configuration

#### PostgreSQL Container
- **Image**: `postgres:16-alpine`
- **Port**: 5432
- **Environment**: Database configuration
- **Secrets**: Password from AWS Secrets Manager
- **Health Check**: `pg_isready` command
- **Volumes**: Persistent data storage

#### API Container
- **Image**: Your ECR repository image
- **Port**: 3001
- **Environment**: Application configuration
- **Dependencies**: Waits for PostgreSQL to be healthy
- **Health Check**: HTTP request to `/health` endpoint

### Security Features
- **Secrets Management**: Database password stored in AWS Secrets Manager
- **Network Isolation**: awsvpc network mode provides isolated networking
- **IAM Roles**: Separate execution and task roles for security
- **Health Checks**: Automatic container health monitoring

## Environment Variables

### Required for Deployment
```bash
AWS_ACCOUNT_ID=123456789012
AWS_REGION=us-east-1
ECR_REPOSITORY=cryptics-api
ECS_CLUSTER=cryptics-cluster
ECS_SERVICE=cryptics-api-service
```

### Application Environment Variables
```bash
NODE_ENV=production
PORT=3001
DB_HOST=localhost
DB_PORT=5432
DB_NAME=cryptics
DB_USER=postgres
DB_SSL=false
```

## Monitoring and Logging

### CloudWatch Logs
- **Log Group**: `/ecs/cryptics-api`
- **Stream Prefixes**: 
  - `postgres` - Database logs
  - `api` - Application logs

### Health Checks
- **PostgreSQL**: `pg_isready` every 30 seconds
- **API**: HTTP GET to `/health` every 30 seconds

## Scaling Configuration

### Auto Scaling (Optional)
```bash
# Create auto scaling target
aws application-autoscaling register-scalable-target \
    --service-namespace ecs \
    --resource-id service/$ECS_CLUSTER/$ECS_SERVICE \
    --scalable-dimension ecs:service:DesiredCount \
    --min-capacity 1 \
    --max-capacity 10 \
    --region $AWS_REGION
```

## Troubleshooting

### Common Issues

1. **Task fails to start**
   - Check CloudWatch logs for error messages
   - Verify IAM role permissions
   - Ensure secrets are properly configured

2. **Database connection issues**
   - Verify security group rules allow port 5432
   - Check database password in Secrets Manager
   - Ensure containers are in same network

3. **Image pull errors**
   - Verify ECR repository exists and has image
   - Check ECR permissions for ECS task execution role

### Useful Commands

```bash
# Check service status
aws ecs describe-services \
    --cluster $ECS_CLUSTER \
    --services $ECS_SERVICE

# View recent logs
aws logs tail /ecs/cryptics-api --follow

# List running tasks
aws ecs list-tasks \
    --cluster $ECS_CLUSTER \
    --service-name $ECS_SERVICE
```

## Cost Optimization

### Fargate Pricing
- **CPU**: $0.04048 per vCPU per hour
- **Memory**: $0.004445 per GB per hour
- **Estimated Monthly Cost**: ~$15-30 for 24/7 operation

### Optimization Tips
- Use Spot capacity for non-production environments
- Set up auto scaling to scale down during low usage
- Monitor CloudWatch metrics for right-sizing

## Security Best Practices

1. **Use AWS Secrets Manager** for sensitive data
2. **Enable VPC Flow Logs** for network monitoring
3. **Use least privilege IAM policies**
4. **Enable CloudTrail** for audit logging
5. **Regular security updates** for container images

## Next Steps

1. Set up Application Load Balancer for public access
2. Configure Route 53 for custom domain
3. Add SSL/TLS certificate via ACM
4. Set up CI/CD pipeline with GitHub Actions
5. Implement monitoring and alerting with CloudWatch

This ECS deployment provides a production-ready, scalable infrastructure for your Cryptics API with proper security, monitoring, and logging configurations.