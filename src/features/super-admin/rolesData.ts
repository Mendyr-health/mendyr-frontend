export const mockRoles = [
  { name: "Super Admin", slug: "super-admin", hierarchy: 0, isSystem: true, permissions: 30, users: 1, description: "Full system access" },
  { name: "Admin", slug: "admin", hierarchy: 1, isSystem: true, permissions: 15, users: 2, description: "Platform management access" },
  { name: "Nurse", slug: "nurse", hierarchy: 2, isSystem: true, permissions: 3, users: 0, description: "Nurse portal access" },
  { name: "Patient", slug: "patient", hierarchy: 3, isSystem: true, permissions: 3, users: 0, description: "Patient portal access" },
];
