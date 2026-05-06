## Load balancer architecture explanation ##
Architecture components: 
Application Load Balancer (ALB) acts as the public entry point
Target Group manages a pool of EC2 instances
Multiple EC2 instances run the web application
Instances are distributed across Availability Zones for high availability

Request Flow 
A client sends a request to the ALB DNS endpoint
The ALB receives the request and selects a healthy target
The request is forwarded to one of the EC2 instances
The instance processes the request and returns a response
The ALB forwards the response back to the client

## Health check configuration and rationale ##
The load balancer regularly checks if each EC2 instance is working by sending requests to the /health endpoint on port 80.

If an instance responds with a 200 OK, it’s considered healthy and continues to receive traffic. If it fails several checks in a row, it’s marked as unhealthy and the load balancer stops sending requests to it.

Using a simple /health endpoint keeps the checks fast and reliable, helping ensure that only working instances handle user requests.


## Testing Methodology ##
None applicable as the lab ended at Part 7 because of the output after making 20 requests, it only showed 20 unknown. 

## Failover scenario documentation ##
NA

## Best practices learned ##
Use a load balancer to distribute traffic and improve reliability
Keep application instances in private subnets and expose only the load balancer
Use health checks to automatically detect and remove unhealthy instances
Design applications to be stateless when possible to improve scalability
Avoid relying on sticky sessions unless necessary
Use multiple instances and Availability Zones for high availability
Automate setup with user data instead of manual configuration

---

** Note: **
Load distribution could not be fully visualized because the application did not correctly expose instance-specific metadata (INSTANCE_ID and AZ). As a result, all responses appeared as "unknown" despite the load balancer functioning correctly.

---

## Reflection Questions ##
How does the load balancer know if an instance is healthy?
Load balancer will send a request to each registered instance and it checks for the HTTP response. If it is healthy then it will continue sending traffic and if not, load balancer will distribute it to a different server.

What happens when an instance fails a health check?
After failing the health check, it load balancer waits for a threshold then marks the instance unhealthy. Traffic will stop and existing instances will be used for connection to continue.

Why deploy instances across multiple Availability Zones?
For high availability, if ever one server crashes in one AZ, load balancer can still distribute it to other AX. Besides that, the closer to the users, the faster the queries. 

What is the purpose of the /health endpoint?
It is a simple and fast way for ALB to verify if server is alive and ready to receive requests. 

How would you implement sticky sessions? When would you need them?
I would enable session stickiness at the load balancer level. For example, with an Application Load Balancer in Amazon Web Services, I’d configure stickiness on the target group. The load balancer then issues a cookie (like AWSALB) to the client, and uses that cookie to route subsequent requests from the same user to the same backend instance. I would use them when the application stores session state locally on the instance, such as login sessions or carts in memory.