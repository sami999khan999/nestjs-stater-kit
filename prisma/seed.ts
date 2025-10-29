import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create roles
  const roles = await Promise.all([
    prisma.role.upsert({
      where: { name: 'ADMIN' },
      update: {},
      create: {
        name: 'ADMIN',
        description: 'Administrator with full access',
      },
    }),
    prisma.role.upsert({
      where: { name: 'USER' },
      update: {},
      create: {
        name: 'USER',
        description: 'Standard user with limited access',
      },
    }),
    prisma.role.upsert({
      where: { name: 'SELLER' },
      update: {},
      create: {
        name: 'SELLER',
        description: 'Seller with marketplace access',
      },
    }),
  ]);

  console.log('✅ Roles created:', roles.map((r) => r.name).join(', '));

  // Create permissions
  const permissions = await Promise.all([
    prisma.permission.upsert({
      where: { name: 'users:read' },
      update: {},
      create: {
        name: 'users:read',
        description: 'Read user information',
      },
    }),
    prisma.permission.upsert({
      where: { name: 'users:write' },
      update: {},
      create: {
        name: 'users:write',
        description: 'Create and update users',
      },
    }),
    prisma.permission.upsert({
      where: { name: 'users:delete' },
      update: {},
      create: {
        name: 'users:delete',
        description: 'Delete users',
      },
    }),
  ]);

  console.log('✅ Permissions created:', permissions.map((p) => p.name).join(', '));

  // Assign permissions to ADMIN role
  const adminRole = roles.find((r) => r.name === 'ADMIN');
  if (adminRole) {
    for (const permission of permissions) {
      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: adminRole.id,
            permissionId: permission.id,
          },
        },
        update: {},
        create: {
          roleId: adminRole.id,
          permissionId: permission.id,
        },
      });
    }
    console.log('✅ Admin role permissions assigned');
  }

  // Create admin user
  const hashedPassword = await bcrypt.hash('Admin@123456', 12);
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin User',
      password: hashedPassword,
      isEmailVerified: true,
      status: 'ACTIVE',
      accounts: {
        create: {
          provider: 'credentials',
          type: 'credentials',
        },
      },
      roles: {
        create: {
          roleId: adminRole!.id,
        },
      },
      notificationSettings: {
        create: {
          newBooking: true,
        },
      },
    },
  });

  console.log('✅ Admin user created:', adminUser.email);

  // Create test user
  const testHashedPassword = await bcrypt.hash('Test@123456', 12);
  const userRole = roles.find((r) => r.name === 'USER');
  const testUser = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      name: 'Test User',
      password: testHashedPassword,
      isEmailVerified: true,
      status: 'ACTIVE',
      accounts: {
        create: {
          provider: 'credentials',
          type: 'credentials',
        },
      },
      roles: {
        create: {
          roleId: userRole!.id,
        },
      },
      notificationSettings: {
        create: {
          newBooking: true,
        },
      },
    },
  });

  console.log('✅ Test user created:', testUser.email);

  console.log('\n🎉 Seeding completed successfully!');
  console.log('\n📝 Default Credentials:');
  console.log('   Admin: admin@example.com / Admin@123456');
  console.log('   User:  user@example.com / Test@123456');
  console.log('\n⚠️  IMPORTANT: Change these passwords in production!\n');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
