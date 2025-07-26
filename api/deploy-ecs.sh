#!/bin/bash

# Cryptics API ECS Deployment Script
set -e

# Configuration - Update these values for your AWS environment
AWS_REGION="${AWS_REGION:-us-west-2}"
AWS_ACCOUNT_ID="374966519234"
ECR_REPOSITORY="${ECR_REPOSITORY:-cryptics-api}"
ECS_CLUSTER="${ECS_CLUSTER:-cryptics-cluster}"
ECS_SERVICE="${ECS_SERVICE:-cryptics-api-service}"
TASK_DEFINITION_FAMILY="${TASK_DEFINITION_FAMILY:-cryptics-api-task}"
IMAGE_TAG="${IMAGE_TAG:-latest}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Starting ECS deployment for Cryptics API${NC}"

# Validate required environment variables
if [ -z "$AWS_ACCOUNT_ID" ]; then
    echo -e "${RED}❌ AWS_ACCOUNT_ID environment variable is required${NC}"
    exit 1
fi

# Set ECR registry URL
ECR_REGISTRY="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"

echo -e "${YELLOW}📋 Deployment Configuration:${NC}"
echo "  AWS Region: $AWS_REGION"
echo "  AWS Account: $AWS_ACCOUNT_ID"
echo "  ECR Registry: $ECR_REGISTRY"
echo "  ECR Repository: $ECR_REPOSITORY"
echo "  ECS Cluster: $ECS_CLUSTER"
echo "  ECS Service: $ECS_SERVICE"
echo "  Image Tag: $IMAGE_TAG"

# Step 1: Build Docker image
echo -e "${GREEN}🔨 Building Docker image...${NC}"
docker build -t $ECR_REPOSITORY:$IMAGE_TAG .

# Step 2: Login to ECR
echo -e "${GREEN}🔑 Logging into ECR...${NC}"
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $ECR_REGISTRY

# Step 3: Create ECR repository if it doesn't exist
echo -e "${GREEN}📦 Ensuring ECR repository exists...${NC}"
aws ecr describe-repositories --repository-names $ECR_REPOSITORY --region $AWS_REGION 2>/dev/null || \
aws ecr create-repository --repository-name $ECR_REPOSITORY --region $AWS_REGION

# Step 4: Tag and push image to ECR
echo -e "${GREEN}⬆️  Pushing image to ECR...${NC}"
docker tag $ECR_REPOSITORY:$IMAGE_TAG $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG
docker push $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG

# Step 5: Update task definition with new image
echo -e "${GREEN}📝 Updating ECS task definition...${NC}"
# Replace placeholders in task definition
sed -e "s/YOUR_ACCOUNT_ID/$AWS_ACCOUNT_ID/g" \
    -e "s/YOUR_REGION/$AWS_REGION/g" \
    ecs-task-definition.json > ecs-task-definition-updated.json

# Register new task definition
TASK_DEFINITION_ARN=$(aws ecs register-task-definition \
    --cli-input-json file://ecs-task-definition-updated.json \
    --region $AWS_REGION \
    --query 'taskDefinition.taskDefinitionArn' \
    --output text)

echo "  Task Definition ARN: $TASK_DEFINITION_ARN"

# Step 6: Update ECS service
echo -e "${GREEN}🔄 Updating ECS service...${NC}"
aws ecs update-service \
    --cluster $ECS_CLUSTER \
    --service $ECS_SERVICE \
    --task-definition $TASK_DEFINITION_ARN \
    --region $AWS_REGION

# Step 7: Wait for deployment to complete
echo -e "${GREEN}⏳ Waiting for deployment to complete...${NC}"
aws ecs wait services-stable \
    --cluster $ECS_CLUSTER \
    --services $ECS_SERVICE \
    --region $AWS_REGION

echo -e "${GREEN}✅ Deployment completed successfully!${NC}"

# Cleanup
rm -f ecs-task-definition-updated.json

# Show service status
echo -e "${GREEN}📊 Service Status:${NC}"
aws ecs describe-services \
    --cluster $ECS_CLUSTER \
    --services $ECS_SERVICE \
    --region $AWS_REGION \
    --query 'services[0].{Status:status,TaskDefinition:taskDefinition,DesiredCount:desiredCount,RunningCount:runningCount}' \
    --output table

echo -e "${GREEN}🎉 Cryptics API deployment to ECS is complete!${NC}"