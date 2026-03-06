import pulumi
import pulumi_aws as aws

config = pulumi.Config("network")
environment = pulumi.get_stack()

cidr_block = config.require("cidrBlock")
public_subnet_cidrs = config.require_object("publicSubnetCidrs")
private_subnet_cidrs = config.require_object("privateSubnetCidrs")
enable_multi_az_nat = config.get_bool("enableMultiAzNat") or False

vpc = aws.ec2.Vpc(
    f"{environment}-vpc",
    cidr_block=cidr_block,
    enable_dns_hostnames=True,
    enable_dns_support=True,
    tags={
        "Environment": environment,
        "ManagedBy": "Pulumi"
    }
)

pulumi.export("vpc_id", vpc.id)