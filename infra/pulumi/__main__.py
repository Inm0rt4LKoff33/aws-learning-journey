"""An AWS Python Pulumi program"""

import pulumi
import pulumi_aws as aws

# Get default VPC
default_vpc = aws.ec2.get_vpc(default=True)

# Create Security Group
security_group = aws.ec2.SecurityGroup(
    "web-sg",
    description="Allow HTTP and SSH",
    vpc_id=default_vpc.id,
    ingress=[
        aws.ec2.SecurityGroupIngressArgs(
            protocol="tcp",
            from_port=80,
            to_port=80,
            cidr_blocks=["0.0.0.0/0"],
            description="Allow HTTP"
        ),
        aws.ec2.SecurityGroupIngressArgs(
            protocol="tcp",
            from_port=22,
            to_port=22,
            cidr_blocks=["0.0.0.0/0"],
            description="Allow SSH"
        )
    ],
    egress=[
        aws.ec2.SecurityGroupEgressArgs(
            protocol="-1",
            from_port=0,
            to_port=0,
            cidr_blocks=["0.0.0.0/0"],
            description="Allow all outbound traffic"
        )
    ]
)

pulumi.export("security_group_id", security_group.id)
