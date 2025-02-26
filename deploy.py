#!/usr/bin/env python3
import os
import subprocess
import json
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

def run_command(command):
    """Run a shell command and return the output."""
    print(f"Running: {command}")
    result = subprocess.run(command, shell=True, capture_output=True, text=True)
    if result.returncode != 0:
        print(f"Error executing command: {command}")
        print(result.stderr)
        exit(1)
    return result.stdout.strip()

def deploy_to_azure():
    # Step 1: Get database credentials from environment variables
    db_server = os.getenv('DB_SERVER')
    db_username = os.getenv('DB_USERNAME')
    db_password = os.getenv('DB_PASSWORD')
    db_database = os.getenv('DB_DATABASE')

    # Make sure environment variables are set
    if not all([db_server, db_username, db_password, db_database]):
        print("Error: Missing database environment variables in .env file")
        exit(1)

    # Step 2: Initialize Terraform
    os.chdir("terraform")
    run_command("terraform init")

    # Step 3: Create tfvars file
    with open("terraform.tfvars", "w") as f:
        f.write(f'db_server = "{db_server}"\n')
        f.write(f'db_username = "{db_username}"\n')
        f.write(f'db_password = "{db_password}"\n')
        f.write(f'db_database = "{db_database}"\n')

    # Step 4: Apply Terraform to create the resource group and ACR
    # We need to do this in two phases because we need the ACR before building images
    with open("first_phase.tf", "w") as f:
        f.write('''
provider "azurerm" {
  features {}
}

resource "azurerm_resource_group" "rg" {
  name     = "trading-website-rg"
  location = "East US"
}

resource "azurerm_container_registry" "acr" {
  name                = "tradingwebsiteacr"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  sku                 = "Basic"
  admin_enabled       = true
}

output "acr_login_server" {
  value = azurerm_container_registry.acr.login_server
}

output "acr_admin_username" {
  value = azurerm_container_registry.acr.admin_username
}

output "acr_admin_password" {
  value     = azurerm_container_registry.acr.admin_password
  sensitive = true
}
''')

    run_command("terraform -chdir=. apply -auto-approve -target=azurerm_resource_group.rg -target=azurerm_container_registry.acr")

    # Step 5: Get ACR details
    acr_server = run_command("terraform output -raw acr_login_server")
    acr_username = run_command("terraform output -raw acr_admin_username")
    acr_password = run_command("terraform output -raw acr_admin_password")

    # Step 6: Build and push Docker images
    os.chdir("..")

    # Login to ACR
    run_command(f"az acr login --name tradingwebsiteacr")

    # Build and push images
    for service in ["first-api", "first-app", "trading-data"]:
        print(f"Building and pushing {service} image...")
        run_command(f"docker build -t {acr_server}/{service}:latest ./{service}")
        run_command(f"docker push {acr_server}/{service}:latest")

    # Step 7: Apply complete Terraform configuration
    os.chdir("terraform")
    run_command("terraform apply -auto-approve")

    # Step 8: Get output URLs
    first_app_url = run_command("terraform output -raw first_app_url")
    first_api_url = run_command("terraform output -raw first_api_url")

    print(f"\nDeployment complete!")
    print(f"Access your app at: {first_app_url}")
    print(f"API endpoint: {first_api_url}")

if __name__ == "__main__":
    deploy_to_azure()
