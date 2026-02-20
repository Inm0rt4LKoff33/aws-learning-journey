import pulumi
import pulumi_aws as aws

config = pulumi.Config("app")

app_name = config.require("name")
vpc_id = config.require("vpcId")

allowed_ssh_cidr = config.require("allowedSshCidr")
http_cidr = config.require("httpCidr")

environment = pulumi.get_stack()

common_tags = {
    "Project": pulumi.get_project(),
    "Environment": environment,
    "ManagedBy": "Pulumi"
}

security_group = aws.ec2.SecurityGroup(
    f"{app_name}-{environment}-sg",
    description=f"{app_name} security group ({environment})",
    vpc_id=vpc_id,
    ingress=[
        aws.ec2.SecurityGroupIngressArgs(
            protocol="tcp",
            from_port=80,
            to_port=80,
            cidr_blocks=[http_cidr],
            description="HTTP access"
        ),
        aws.ec2.SecurityGroupIngressArgs(
            protocol="tcp",
            from_port=22,
            to_port=22,
            cidr_blocks=[allowed_ssh_cidr],
            description="SSH access"
        )
    ],
    egress=[
        aws.ec2.SecurityGroupEgressArgs(
            protocol="-1",
            from_port=0,
            to_port=0,
            cidr_blocks=["0.0.0.0/0"],
            description="Allow all outbound"
        )
    ],
    tags=common_tags
)

pulumi.export("security_group_id", security_group.id)