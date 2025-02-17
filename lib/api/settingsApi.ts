import { config } from "../config"
import { mockDb } from "../mock-db"
import { simulateApiDelay } from "@/lib/utils/mockApiUtils"
import type {
  SubscriptionPlan,
  Department,
  Role,
  Authorizer,
  CustomizationSettings,
  EmailTemplate,
  AdvancedSettings,
  PDFSettings,
  CertificateSettings,
  DSCSettings,
  BrandingSettings,
} from "@/lib/models/settings"

export const settingsApi = {
  // Subscription
  async getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
    if (config.useRealApi) {
      const response = await fetch(`${config.apiBaseUrl}/subscription-plans`)
      if (!response.ok) {
        throw new Error("Failed to fetch subscription plans")
      }
      return await response.json()
    } else {
      await simulateApiDelay()
      return mockDb.getSubscriptionPlans()
    }
  },

  async updateSubscription(planId: string): Promise<SubscriptionPlan> {
    if (config.useRealApi) {
      const response = await fetch(`${config.apiBaseUrl}/subscription`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      })
      if (!response.ok) {
        throw new Error("Failed to update subscription")
      }
      return await response.json()
    } else {
      await simulateApiDelay()
      return mockDb.updateSubscription(planId)
    }
  },

  // Departments
  async getDepartments(): Promise<Department[]> {
    if (config.useRealApi) {
      const response = await fetch(`${config.apiBaseUrl}/departments`)
      if (!response.ok) {
        throw new Error("Failed to fetch departments")
      }
      return await response.json()
    } else {
      await simulateApiDelay()
      return mockDb.getDepartments()
    }
  },

  async createDepartment(department: Omit<Department, "id">): Promise<Department> {
    if (config.useRealApi) {
      const response = await fetch(`${config.apiBaseUrl}/departments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(department),
      })
      if (!response.ok) {
        throw new Error("Failed to create department")
      }
      return await response.json()
    } else {
      await simulateApiDelay()
      return mockDb.createDepartment(department)
    }
  },

  async updateDepartment(id: string, updates: Partial<Department>): Promise<Department> {
    if (config.useRealApi) {
      const response = await fetch(`${config.apiBaseUrl}/departments/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      })
      if (!response.ok) {
        throw new Error("Failed to update department")
      }
      return await response.json()
    } else {
      await simulateApiDelay()
      return mockDb.updateDepartment(id, updates)
    }
  },

  async deleteDepartment(id: string): Promise<void> {
    if (config.useRealApi) {
      const response = await fetch(`${config.apiBaseUrl}/departments/${id}`, {
        method: "DELETE",
      })
      if (!response.ok) {
        throw new Error("Failed to delete department")
      }
    } else {
      await simulateApiDelay()
      mockDb.deleteDepartment(id)
    }
  },

  // Access Management (Roles)
  async getRoles(): Promise<Role[]> {
    if (config.useRealApi) {
      const response = await fetch(`${config.apiBaseUrl}/roles`)
      if (!response.ok) {
        throw new Error("Failed to fetch roles")
      }
      return await response.json()
    } else {
      await simulateApiDelay()
      return mockDb.getRoles()
    }
  },

  async createRole(role: Omit<Role, "id">): Promise<Role> {
    if (config.useRealApi) {
      const response = await fetch(`${config.apiBaseUrl}/roles`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(role),
      })
      if (!response.ok) {
        throw new Error("Failed to create role")
      }
      return await response.json()
    } else {
      await simulateApiDelay()
      return mockDb.createRole(role)
    }
  },

  async updateRole(id: string, updates: Partial<Role>): Promise<Role> {
    if (config.useRealApi) {
      const response = await fetch(`${config.apiBaseUrl}/roles/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      })
      if (!response.ok) {
        throw new Error("Failed to update role")
      }
      return await response.json()
    } else {
      await simulateApiDelay()
      return mockDb.updateRole(id, updates)
    }
  },

  async deleteRole(id: string): Promise<void> {
    if (config.useRealApi) {
      const response = await fetch(`${config.apiBaseUrl}/roles/${id}`, {
        method: "DELETE",
      })
      if (!response.ok) {
        throw new Error("Failed to delete role")
      }
    } else {
      await simulateApiDelay()
      mockDb.deleteRole(id)
    }
  },

  // Authorizer
  async getAuthorizers(): Promise<Authorizer[]> {
    if (config.useRealApi) {
      const response = await fetch(`${config.apiBaseUrl}/authorizers`)
      if (!response.ok) {
        throw new Error("Failed to fetch authorizers")
      }
      return await response.json()
    } else {
      await simulateApiDelay()
      return mockDb.getAuthorizers()
    }
  },

  async createAuthorizer(authorizer: Omit<Authorizer, "id">): Promise<Authorizer> {
    if (config.useRealApi) {
      const response = await fetch(`${config.apiBaseUrl}/authorizers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(authorizer),
      })
      if (!response.ok) {
        throw new Error("Failed to create authorizer")
      }
      return await response.json()
    } else {
      await simulateApiDelay()
      return mockDb.createAuthorizer(authorizer)
    }
  },

  async updateAuthorizer(id: string, updates: Partial<Authorizer>): Promise<Authorizer> {
    if (config.useRealApi) {
      const response = await fetch(`${config.apiBaseUrl}/authorizers/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      })
      if (!response.ok) {
        throw new Error("Failed to update authorizer")
      }
      return await response.json()
    } else {
      await simulateApiDelay()
      return mockDb.updateAuthorizer(id, updates)
    }
  },

  async deleteAuthorizer(id: string): Promise<void> {
    if (config.useRealApi) {
      const response = await fetch(`${config.apiBaseUrl}/authorizers/${id}`, {
        method: "DELETE",
      })
      if (!response.ok) {
        throw new Error("Failed to delete authorizer")
      }
    } else {
      await simulateApiDelay()
      mockDb.deleteAuthorizer(id)
    }
  },

  // Customization
  async getCustomizationSettings(): Promise<CustomizationSettings> {
    if (config.useRealApi) {
      const response = await fetch(`${config.apiBaseUrl}/customization-settings`)
      if (!response.ok) {
        throw new Error("Failed to fetch customization settings")
      }
      return await response.json()
    } else {
      await simulateApiDelay()
      return mockDb.getCustomizationSettings()
    }
  },

  async updateCustomizationSettings(settings: CustomizationSettings): Promise<void> {
    if (config.useRealApi) {
      const response = await fetch(`${config.apiBaseUrl}/customization-settings`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      })
      if (!response.ok) {
        throw new Error("Failed to update customization settings")
      }
    } else {
      await simulateApiDelay()
      mockDb.updateCustomizationSettings(settings)
    }
  },

  // Email Templates
  async getEmailTemplates(): Promise<EmailTemplate[]> {
    if (config.useRealApi) {
      const response = await fetch(`${config.apiBaseUrl}/email-templates`)
      if (!response.ok) {
        throw new Error("Failed to fetch email templates")
      }
      return await response.json()
    } else {
      await simulateApiDelay()
      return mockDb.getEmailTemplates()
    }
  },

  async createEmailTemplate(template: Omit<EmailTemplate, "id" | "createdAt" | "updatedAt">): Promise<EmailTemplate> {
    if (config.useRealApi) {
      const response = await fetch(`${config.apiBaseUrl}/email-templates`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(template),
      })
      if (!response.ok) {
        throw new Error("Failed to create email template")
      }
      return await response.json()
    } else {
      await simulateApiDelay()
      return mockDb.createEmailTemplate(template)
    }
  },

  async updateEmailTemplate(id: string, updates: Partial<EmailTemplate>): Promise<EmailTemplate | undefined> {
    if (config.useRealApi) {
      const response = await fetch(`${config.apiBaseUrl}/email-templates/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      })
      if (!response.ok) {
        throw new Error("Failed to update email template")
      }
      return await response.json()
    } else {
      await simulateApiDelay()
      return mockDb.updateEmailTemplate(id, updates)
    }
  },

  async deleteEmailTemplate(id: string): Promise<boolean> {
    if (config.useRealApi) {
      const response = await fetch(`${config.apiBaseUrl}/email-templates/${id}`, {
        method: "DELETE",
      })
      if (!response.ok) {
        throw new Error("Failed to delete email template")
      }
      return true
    } else {
      await simulateApiDelay()
      return mockDb.deleteEmailTemplate(id)
    }
  },

  // Advanced Settings
  async getAdvancedSettings(): Promise<AdvancedSettings> {
    if (config.useRealApi) {
      const response = await fetch(`${config.apiBaseUrl}/advanced-settings`)
      if (!response.ok) {
        throw new Error("Failed to fetch advanced settings")
      }
      return await response.json()
    } else {
      await simulateApiDelay()
      return mockDb.getAdvancedSettings()
    }
  },

  async updateAdvancedSettings(settings: Partial<AdvancedSettings>): Promise<AdvancedSettings> {
    if (config.useRealApi) {
      const response = await fetch(`${config.apiBaseUrl}/advanced-settings`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      })
      if (!response.ok) {
        throw new Error("Failed to update advanced settings")
      }
      return await response.json()
    } else {
      await simulateApiDelay()
      return mockDb.updateAdvancedSettings(settings)
    }
  },

  // PDF Settings
  async getPDFSettings(): Promise<PDFSettings> {
    if (config.useRealApi) {
      const response = await fetch(`${config.apiBaseUrl}/pdf-settings`)
      if (!response.ok) {
        throw new Error("Failed to fetch PDF settings")
      }
      return await response.json()
    } else {
      await simulateApiDelay()
      return mockDb.getPDFSettings()
    }
  },

  async updatePDFSettings(settings: Partial<PDFSettings>): Promise<PDFSettings> {
    if (config.useRealApi) {
      const response = await fetch(`${config.apiBaseUrl}/pdf-settings`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      })
      if (!response.ok) {
        throw new Error("Failed to update PDF settings")
      }
      return await response.json()
    } else {
      await simulateApiDelay()
      return mockDb.updatePDFSettings(settings)
    }
  },

  // Certificate Settings
  async getCertificateSettings(): Promise<CertificateSettings> {
    if (config.useRealApi) {
      const response = await fetch(`${config.apiBaseUrl}/certificate-settings`)
      if (!response.ok) {
        throw new Error("Failed to fetch certificate settings")
      }
      return await response.json()
    } else {
      await simulateApiDelay()
      return mockDb.getCertificateSettings()
    }
  },

  async updateCertificateSettings(settings: Partial<CertificateSettings>): Promise<CertificateSettings> {
    if (config.useRealApi) {
      const response = await fetch(`${config.apiBaseUrl}/certificate-settings`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      })
      if (!response.ok) {
        throw new Error("Failed to update certificate settings")
      }
      return await response.json()
    } else {
      await simulateApiDelay()
      return mockDb.updateCertificateSettings(settings)
    }
  },

  // DSC Settings
  async getDSCSettings(): Promise<DSCSettings> {
    if (config.useRealApi) {
      const response = await fetch(`${config.apiBaseUrl}/dsc-settings`)
      if (!response.ok) {
        throw new Error("Failed to fetch DSC settings")
      }
      return await response.json()
    } else {
      await simulateApiDelay()
      return mockDb.getDSCSettings()
    }
  },

  async updateDSCSettings(settings: Partial<DSCSettings>): Promise<DSCSettings> {
    if (config.useRealApi) {
      const response = await fetch(`${config.apiBaseUrl}/dsc-settings`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      })
      if (!response.ok) {
        throw new Error("Failed to update DSC settings")
      }
      return await response.json()
    } else {
      await simulateApiDelay()
      return mockDb.updateDSCSettings(settings)
    }
  },

  // Branding Settings
  async getBrandingSettings(): Promise<BrandingSettings> {
    if (config.useRealApi) {
      const response = await fetch(`${config.apiBaseUrl}/branding-settings`)
      if (!response.ok) {
        throw new Error("Failed to fetch branding settings")
      }
      return await response.json()
    } else {
      await simulateApiDelay()
      return mockDb.getBrandingSettings()
    }
  },

  async updateBrandingSettings(settings: Partial<BrandingSettings>): Promise<BrandingSettings> {
    if (config.useRealApi) {
      const response = await fetch(`${config.apiBaseUrl}/branding-settings`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      })
      if (!response.ok) {
        throw new Error("Failed to update branding settings")
      }
      return await response.json()
    } else {
      await simulateApiDelay()
      return mockDb.updateBrandingSettings(settings)
    }
  },
}

