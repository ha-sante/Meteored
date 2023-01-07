import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";

// Deployment of product image to aws ec2 instance
// Deployment of product image to an aws eks instance/setup
// Deployment of product image to aws fargate instance/setup



// 1. Prepare an EC2 Instance Image
const size = "t2.micro";     // t2.micro is available in the AWS free tier
const ami = aws.ec2.getAmiOutput({
    filters: [{
        name: "name",
        values: ["amzn-ami-hvm-*"],
    }],
    owners: ["137112412989"], // This owner ID is Amazon
    mostRecent: true,
});

// 2. Prepare a public network domain to ports of the ec2 instance
const group = new aws.ec2.SecurityGroup("pipelined_secgrp", {
    ingress: [
        { protocol: "tcp", fromPort: 22, toPort: 22, cidrBlocks: ["0.0.0.0/0"] },
        { protocol: "tcp", fromPort: 80, toPort: 80, cidrBlocks: ["0.0.0.0/0"] },
        { protocol: "tcp", fromPort: 443, toPort: 443, cidrBlocks: ["0.0.0.0/0"] },
    ],
    egress: [
        { protocol: "-1", fromPort: 0, toPort: 0, cidrBlocks: ["0.0.0.0/0"] },
    ]
});

// 3. Prepare Instance Init script
let userData = `
#!/bin/bash
yum update -y
yum install docker
service docker start
`;

// 3. Create the AWS EC2 instance
const server = new aws.ec2.Instance("pipelined_www", {
    instanceType: size,
    vpcSecurityGroupIds: [ group.id ], // reference the security group resource above
    ami: ami.id,
    keyName: "instance-keypair", // tag the name of an already created instance keypair
    userData: userData,
});

export const publicIp = server.publicIp;
export const publicHostName = server.publicDns;


// 3. Build a docker image into a private image registry in aws

// 4. Setup the instance for the docker instance/image

// 5. Pull the project folder & it's docker config into the ec2 instance

// 6. Execute the docker image to run
