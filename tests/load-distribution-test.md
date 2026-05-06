## Load Distribution Test

### Method
Sent multiple HTTP requests to the ALB endpoint using a loop.

### Command Used
for i in {1..20}; do
  curl -s http://web-alb-1415714975.us-east-1.elb.amazonaws.com | grep "Instance:" | sed 's/.*Instance: //'
done | sort | uniq -c

### Result
20 unknown

### Analysis
Requests successfully reached backend instances through the load balancer.

However, all responses returned "unknown" because environment variables (INSTANCE_ID and AZ) were not properly set on the instances.

This prevented verification of traffic distribution across instances.
