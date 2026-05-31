import { PrismaClient } from "@prisma/client";
import argon2 from "argon2";

const prisma = new PrismaClient();

const PERMISSIONS_LIST = [
  { resource: "user", action: "create" },
  { resource: "user", action: "read" },
  { resource: "user", action: "update" },
  { resource: "user", action: "delete" },
  { resource: "nurse", action: "read" },
  { resource: "nurse", action: "update" },
  { resource: "nurse", action: "approve" },
  { resource: "nurse", action: "reject" },
  { resource: "patient", action: "read" },
  { resource: "patient", action: "update" },
  { resource: "service", action: "create" },
  { resource: "service", action: "read" },
  { resource: "service", action: "update" },
  { resource: "service", action: "delete" },
  { resource: "contact", action: "read" },
  { resource: "contact", action: "update" },
  { resource: "waitlist", action: "read" },
  { resource: "waitlist", action: "update" },
  { resource: "waitlist", action: "export" },
  { resource: "admin", action: "create" },
  { resource: "admin", action: "read" },
  { resource: "admin", action: "update" },
  { resource: "admin", action: "suspend" },
  { resource: "role", action: "create" },
  { resource: "role", action: "read" },
  { resource: "role", action: "update" },
  { resource: "role", action: "delete" },
  { resource: "audit", action: "read" },
  { resource: "settings", action: "read" },
  { resource: "settings", action: "update" },
];

const ROLE_DEFINITIONS = [
  {
    name: "Super Admin",
    slug: "super-admin",
    description: "Full system access",
    hierarchy: 0,
    isSystem: true,
    permissionKeys: PERMISSIONS_LIST.map((p) => `${p.resource}:${p.action}`),
  },
  {
    name: "Admin",
    slug: "admin",
    description: "Platform management access",
    hierarchy: 1,
    isSystem: true,
    permissionKeys: [
      "nurse:read", "nurse:update", "nurse:approve", "nurse:reject",
      "patient:read", "patient:update",
      "service:create", "service:read", "service:update", "service:delete",
      "contact:read", "contact:update",
      "waitlist:read", "waitlist:update", "waitlist:export",
      "audit:read",
    ],
  },
  {
    name: "Nurse",
    slug: "nurse",
    description: "Nurse portal access",
    hierarchy: 2,
    isSystem: true,
    permissionKeys: ["nurse:read", "nurse:update", "service:read"],
  },
  {
    name: "Patient",
    slug: "patient",
    description: "Patient portal access",
    hierarchy: 3,
    isSystem: true,
    permissionKeys: ["patient:read", "patient:update", "service:read"],
  },
];

const SERVICES_DATA = [
  {
    name: "Home Nursing",
    slug: "home-nursing",
    shortDesc: "Professional nursing care delivered to your doorstep",
    description: "Our verified and experienced nurses provide comprehensive healthcare services right at your home. From post-surgical care to chronic disease management, we ensure you receive hospital-quality nursing in the comfort of your home.",
    icon: "Heart",
    features: JSON.stringify(["24/7 nursing care availability", "Wound care and dressing", "IV therapy and injections", "Vital signs monitoring", "Medication management", "Post-surgical care"]),
    pricingRange: "₹800 – ₹3,000/day",
  },
  {
    name: "Elder Care Support",
    slug: "elder-care-support",
    shortDesc: "Compassionate care for your loved ones",
    description: "Dedicated caregivers who provide personalized support for elderly family members. Our elder care services ensure safety, comfort, and companionship while helping seniors maintain their independence and dignity at home.",
    icon: "Users",
    features: JSON.stringify(["Daily living assistance", "Companionship and emotional support", "Mobility assistance", "Meal preparation and nutrition", "Hygiene and personal care", "Fall prevention and safety"]),
    pricingRange: "₹600 – ₹2,000/day",
  },
  {
    name: "Physiotherapy",
    slug: "physiotherapy",
    shortDesc: "Rehabilitation and recovery at home",
    description: "Licensed physiotherapists bring professional rehabilitation services to your home. Whether recovering from surgery, managing chronic pain, or improving mobility, our therapists create personalized treatment plans for optimal recovery.",
    icon: "Activity",
    features: JSON.stringify(["Post-surgical rehabilitation", "Chronic pain management", "Stroke recovery programs", "Sports injury treatment", "Mobility and strength training", "Home exercise programs"]),
    pricingRange: "₹700 – ₹1,500/session",
  },
  {
    name: "Post-Operative Care",
    slug: "post-operative-care",
    shortDesc: "Expert recovery support after surgery",
    description: "Specialized post-operative nursing care designed to support your recovery journey after surgery. Our trained nurses monitor your progress, manage pain, prevent complications, and ensure a smooth transition from hospital to home.",
    icon: "Stethoscope",
    features: JSON.stringify(["Surgical wound management", "Pain monitoring and management", "Complication prevention", "Mobility rehabilitation", "Nutrition and diet guidance", "Doctor coordination"]),
    pricingRange: "₹1,000 – ₹4,000/day",
  },
  {
    name: "Medical Equipment Rental",
    slug: "medical-equipment-rental",
    shortDesc: "Quality medical equipment for home use",
    description: "Access hospital-grade medical equipment for home use without the burden of purchase. We offer well-maintained, sanitized equipment with delivery, setup, and training included to support your care needs at home.",
    icon: "Wrench",
    features: JSON.stringify(["Hospital beds and mattresses", "Oxygen concentrators", "Wheelchairs and walkers", "Patient monitors", "Nebulizers and CPAP machines", "Delivery and setup included"]),
    pricingRange: "₹500 – ₹5,000/month",
  },
  {
    name: "Emergency Assistance",
    slug: "emergency-assistance",
    shortDesc: "Rapid response healthcare support",
    description: "When medical situations arise unexpectedly, our emergency assistance team provides rapid response healthcare support. Trained professionals arrive quickly to stabilize, assess, and coordinate care until further medical help is available.",
    icon: "AlertTriangle",
    features: JSON.stringify(["Rapid response team", "First aid and stabilization", "Emergency vitals assessment", "Hospital transfer coordination", "24/7 helpline access", "Critical care nurse dispatch"]),
    pricingRange: "₹2,000 – ₹8,000/visit",
  },
];

const SYSTEM_SETTINGS = [
  { key: "maintenance_mode", value: "false", type: "boolean", group: "general", description: "Enable maintenance mode" },
  { key: "registration_enabled", value: "true", type: "boolean", group: "auth", description: "Allow new registrations" },
  { key: "nurse_registration_enabled", value: "true", type: "boolean", group: "auth", description: "Allow nurse registrations" },
  { key: "patient_registration_enabled", value: "true", type: "boolean", group: "auth", description: "Allow patient registrations" },
  { key: "waitlist_enabled", value: "true", type: "boolean", group: "general", description: "Show waitlist signup" },
  { key: "contact_email", value: "support@mendyr.app", type: "string", group: "general", description: "Support email" },
  { key: "company_phone", value: "+91-XXXXXXXXXX", type: "string", group: "general", description: "Company phone" },
];

async function main() {
  console.log("🌱 Starting seed...\n");

  // 1. Create permissions
  console.log("  📝 Creating permissions...");
  const permissionRecords: Record<string, string> = {};
  for (const perm of PERMISSIONS_LIST) {
    const record = await prisma.permission.upsert({
      where: { resource_action: { resource: perm.resource, action: perm.action } },
      update: {},
      create: {
        resource: perm.resource,
        action: perm.action,
        description: `${perm.action} ${perm.resource}`,
      },
    });
    permissionRecords[`${perm.resource}:${perm.action}`] = record.id;
  }
  console.log(`    ✅ ${PERMISSIONS_LIST.length} permissions created/verified`);

  // 2. Create roles + assign permissions
  console.log("  📝 Creating roles...");
  for (const roleDef of ROLE_DEFINITIONS) {
    const role = await prisma.role.upsert({
      where: { slug: roleDef.slug },
      update: { description: roleDef.description, hierarchy: roleDef.hierarchy },
      create: {
        name: roleDef.name,
        slug: roleDef.slug,
        description: roleDef.description,
        hierarchy: roleDef.hierarchy,
        isSystem: roleDef.isSystem,
      },
    });

    // Assign permissions
    for (const permKey of roleDef.permissionKeys) {
      const permId = permissionRecords[permKey];
      if (permId) {
        await prisma.rolePermission.upsert({
          where: { roleId_permissionId: { roleId: role.id, permissionId: permId } },
          update: {},
          create: { roleId: role.id, permissionId: permId },
        });
      }
    }
    console.log(`    ✅ Role "${roleDef.name}" with ${roleDef.permissionKeys.length} permissions`);
  }

  // 3. Create super admin user
  console.log("  📝 Creating super admin...");
  const superAdminEmail = process.env.SUPER_ADMIN_EMAIL || "admin@mendyr.app";
  const superAdminPassword = process.env.SUPER_ADMIN_PASSWORD || "Admin@123456";
  const passwordHash = await argon2.hash(superAdminPassword, {
    type: argon2.argon2id,
    memoryCost: 65536,
    timeCost: 3,
    parallelism: 4,
  });

  const superAdmin = await prisma.user.upsert({
    where: { email: superAdminEmail },
    update: {},
    create: {
      email: superAdminEmail,
      fullName: "Super Admin",
      passwordHash,
      role: "SUPER_ADMIN",
      status: "ACTIVE",
      emailVerified: true,
    },
  });

  // Assign super-admin role
  const superAdminRole = await prisma.role.findUnique({ where: { slug: "super-admin" } });
  if (superAdminRole) {
    await prisma.userRoleAssignment.upsert({
      where: { userId_roleId: { userId: superAdmin.id, roleId: superAdminRole.id } },
      update: {},
      create: { userId: superAdmin.id, roleId: superAdminRole.id },
    });
  }
  console.log(`    ✅ Super admin: ${superAdminEmail}`);

  // 4. Create services
  console.log("  📝 Creating services...");
  for (let i = 0; i < SERVICES_DATA.length; i++) {
    const svc = SERVICES_DATA[i];
    await prisma.service.upsert({
      where: { slug: svc.slug },
      update: { sortOrder: i },
      create: {
        ...svc,
        sortOrder: i,
        isActive: true,
        seoTitle: `${svc.name} — Mendyr Home Healthcare`,
        seoDescription: svc.shortDesc,
      },
    });
  }
  console.log(`    ✅ ${SERVICES_DATA.length} services seeded`);

  // 5. Create system settings
  console.log("  📝 Creating system settings...");
  for (const setting of SYSTEM_SETTINGS) {
    await prisma.systemSetting.upsert({
      where: { key: setting.key },
      update: {},
      create: setting,
    });
  }
  console.log(`    ✅ ${SYSTEM_SETTINGS.length} system settings seeded`);

  console.log("\n🎉 Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
