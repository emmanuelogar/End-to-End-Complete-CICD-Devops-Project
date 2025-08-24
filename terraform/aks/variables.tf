variable "resource_group_name" {
  description = "The name of the resource group"
  type        = string
  default     = "tws-aks-cluster-rg"
}

variable "location" {
  description = "The Azure region where the resource group will be created"
  type        = string
  default     = "East US"
}

variable "prefix" {
  description = "Prefix for naming resources"
  type        = string
  default     = "tws"
}

variable "vm_size" {
  description = "The size of the VM for the AKS node pool"
  type        = string
  default     = "Standard_DS2_v2"
}