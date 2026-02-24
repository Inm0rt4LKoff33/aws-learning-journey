import pulumi
import pulumi_aws as aws

# --------------------------------------------------
# Environment & Stack Reference
# --------------------------------------------------

environment = pulumi.get_stack()
project = pulumi.get_project()

# Reference network stack (org/project/stack format)
network_stack = pulumi.StackReference(
    f"F4b1/network/{environment}"
)

vpc_id = network_stack.get_output("vpc_id")

# --------------------------------------------------
# App Configuration
# --------------------------------------------------

config = pulumi.Config("app")

app_name = config.require("name")
allowed_ssh_cidr = config.require("allowedSshCidr")
http_cidr = config.require("httpCidr")

disable_ssh = config.get_bool("disableSsh") or False

# --------------------------------------------------
# Common Tags
# --------------------------------------------------

common_tags = {
    "Project": project,
    "Environment": environment,
    "ManagedBy": "Pulumi"
}

# --------------------------------------------------
# Ingress Rules (Conditional Logic)
# --------------------------------------------------

ingress_rules = [
    aws.ec2.SecurityGroupIngressArgs(
        protocol="tcp",
        from_port=80,
        to_port=80,
        cidr_blocks=[http_cidr],
        description="HTTP access"
    )
]

if not disable_ssh:
    ingress_rules.append(
        aws.ec2.SecurityGroupIngressArgs(
            protocol="tcp",
            from_port=22,
            to_port=22,
            cidr_blocks=[allowed_ssh_cidr],
            description="SSH access"
        )
    )

# --------------------------------------------------
# Security Group
# --------------------------------------------------

security_group = aws.ec2.SecurityGroup(
    f"{app_name}-{environment}-sg",
    description=f"{app_name} security group ({environment})",
    vpc_id=vpc_id,
    ingress=ingress_rules,
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