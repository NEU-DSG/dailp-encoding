# Input for the backup-storage module

variable "env_prefix" {
  description = "Environment prefix used to build the bucket name."
  type = string

  validation {
    condition = can(regex("^[a-z0-9-]+$", var.env_prefix))
    error_message = "Prefix must only be lowercase with dashes."
  }
}
