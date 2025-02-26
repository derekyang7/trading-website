# terraform/variables.tf
variable "db_server" {
  description = "Database server address"
  type        = string
}

variable "db_username" {
  description = "Database username"
  type        = string
}

variable "db_password" {
  description = "Database password"
  type        = string
}

variable "db_database" {
  description = "Database name"
  type        = string
}

variable "subscription_id" {
  description = "Azure subscription ID"
  type        = string
}
