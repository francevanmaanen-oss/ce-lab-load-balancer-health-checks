# Wait for ALB to be ready
sleep 60

# Test ALB endpoint
curl http://web-alb-1415714975.us-east-1.elb.amazonaws.com

# Load distribution test
for i in {1..20}; do
  curl -s http://web-alb-1415714975.us-east-1.elb.amazonaws.com | grep "Instance:" | sed 's/.*Instance: //'
done | sort | uniq -c

# Health endpoint test
curl http://web-alb-1415714975.us-east-1.elb.amazonaws.com/health

# Check target health
aws elbv2 describe-target-health --target-group-arn $TG_ARN

# Simulate instance failure (not executed fully)
aws ec2 stop-instances --instance-ids $INSTANCE_1

sleep 30

aws elbv2 describe-target-health --target-group-arn $TG_ARN

# Restart instance
aws ec2 start-instances --instance-ids $INSTANCE_1

sleep 60

aws elbv2 describe-target-health --target-group-arn $TG_ARN
