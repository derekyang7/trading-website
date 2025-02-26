# terraform/main.tf
provider "azurerm" {
  features {}
  subscription_id = var.subscription_id
}

# Create a resource group
resource "azurerm_resource_group" "rg" {
  name     = "trading-resources"
  location = "Canada Central"
}

# ACR to store Docker images
resource "azurerm_container_registry" "acr" {
  name                = "tradingwebsiteacr"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  sku                 = "Basic"
  admin_enabled       = true
}

# Azure SQL Server
resource "azurerm_mssql_server" "sql_server" {
  name                         = "trading-website"
  resource_group_name          = azurerm_resource_group.rg.name
  location                     = azurerm_resource_group.rg.location
  version                      = "12.0"
  administrator_login          = var.db_username
  administrator_login_password = var.db_password
  minimum_tls_version          = "1.2"
}

# Azure SQL Database
resource "azurerm_mssql_database" "sql_db" {
  name        = var.db_database
  server_id   = azurerm_mssql_server.sql_server.id
  sku_name    = "GP_S_Gen5_1"
  max_size_gb = 4

  # Prevents Terraform from trying to change these settings
  # which would cause downtime during apply
  # lifecycle {
  #   ignore_changes = [
  #     create_mode
  #   ]
  # }
}

# Create a container group for trading-data
resource "azurerm_container_group" "trading_data" {
  name                = "trading-data"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  ip_address_type     = "None"
  os_type             = "Linux"
  restart_policy      = "OnFailure"

  container {
    name   = "trading-data"
    image  = "tradingwebsiteacr.azurecr.io/trading-data:latest"
    cpu    = "0.5"
    memory = "1.5"

    environment_variables = {
      "DB_SERVER"   = var.db_server,
      "DB_USERNAME" = var.db_username,
      "DB_PASSWORD" = var.db_password,
      "DB_DATABASE" = var.db_database
    }

    commands = ["python3", "tradingdatadownload.py", "-i", "daily"]
  }

  image_registry_credential {
    server   = azurerm_container_registry.acr.login_server
    username = azurerm_container_registry.acr.admin_username
    password = azurerm_container_registry.acr.admin_password
  }
}

# Create a container group for first-api
resource "azurerm_container_group" "first_api" {
  name                = "first-api"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  ip_address_type     = "Public"
  dns_name_label      = "trading-website-api"
  os_type             = "Linux"

  container {
    name   = "first-api"
    image  = "tradingwebsiteacr.azurecr.io/first-api:latest"
    cpu    = "0.5"
    memory = "1.5"

    ports {
      port     = 3001
      protocol = "TCP"
    }

    environment_variables = {
      "DB_SERVER"   = var.db_server,
      "DB_USERNAME" = var.db_username,
      "DB_PASSWORD" = var.db_password,
      "DB_DATABASE" = var.db_database
    }
  }

  image_registry_credential {
    server   = azurerm_container_registry.acr.login_server
    username = azurerm_container_registry.acr.admin_username
    password = azurerm_container_registry.acr.admin_password
  }
}

# Create a container group for first-app
resource "azurerm_container_group" "first_app" {
  name                = "first-app"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  ip_address_type     = "Public"
  dns_name_label      = "trading-website"
  os_type             = "Linux"

  container {
    name   = "first-app"
    image  = "tradingwebsiteacr.azurecr.io/first-app:latest"
    cpu    = "0.5"
    memory = "1.5"

    ports {
      port     = 3000
      protocol = "TCP"
    }

    environment_variables = {
      "REACT_APP_API_URL" = "http://${azurerm_container_group.first_api.fqdn}:3001"
    }
  }

  image_registry_credential {
    server   = azurerm_container_registry.acr.login_server
    username = azurerm_container_registry.acr.admin_username
    password = azurerm_container_registry.acr.admin_password
  }
}

# Outputs
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

output "first_app_url" {
  value = "http://${azurerm_container_group.first_app.fqdn}:3000"
}

output "first_api_url" {
  value = "http://${azurerm_container_group.first_api.fqdn}:3001"
}
