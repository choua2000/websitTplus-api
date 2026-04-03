'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // 1. Insert new permissions
        // We use ignoreDuplicates just in case they already exist from previous failed attempt
        // But bulkInsert doesn't always support ignoreDuplicates across all dialects in older sequelize, 
        // however for mysql it usually works or we can check first. 
        // For simplicity, let's assume if they exist, it might error or duplicate. 
        // Since we are running UNDO first, they should be gone.

        // Check if permissions exist first to avoid duplication validity? 
        // Actually, UNDO will delete them. So simple insert is fine.

        await queryInterface.bulkInsert('permissions', [
            { name: 'create-job', description: 'Create a job', createdAt: new Date(), updatedAt: new Date() },
            { name: 'update-job', description: 'Update a job', createdAt: new Date(), updatedAt: new Date() },
            { name: 'delete-job', description: 'Delete a job', createdAt: new Date(), updatedAt: new Date() },
            { name: 'view-job', description: 'View a job', createdAt: new Date(), updatedAt: new Date() }
        ]);

        // 2. Assign to Super Admin role
        // First, get the role ID
        const [roles] = await queryInterface.sequelize.query(
            "SELECT id FROM roles WHERE name = 'Super-admin';"
        );

        if (roles.length > 0) {
            const roleId = roles[0].id;

            // Get the new permission IDs
            const [permissions] = await queryInterface.sequelize.query(
                "SELECT id FROM permissions WHERE name IN ('create-job', 'update-job', 'delete-job', 'view-job');"
            );

            // Create entries for rolePermissions
            // Table name: rolePermissions
            // Columns: roleId, permId
            const rolePermissionsData = permissions.map(perm => ({
                roleId: roleId,
                permId: perm.id,
                createdAt: new Date(),
                updatedAt: new Date()
            }));

            if (rolePermissionsData.length > 0) {
                await queryInterface.bulkInsert('rolePermissions', rolePermissionsData);
            }
        }
    },

    down: async (queryInterface, Sequelize) => {
        // 1. Remove from rolePermissions

        // Get permission IDs to remove references first
        const [permissions] = await queryInterface.sequelize.query(
            "SELECT id FROM permissions WHERE name IN ('create-job', 'update-job', 'delete-job', 'view-job');"
        );

        if (permissions.length > 0) {
            const permIds = permissions.map(p => p.id);
            if (permIds.length > 0) {
                await queryInterface.bulkDelete('rolePermissions', { permId: permIds });
            }
        }

        // 2. Delete permissions
        await queryInterface.bulkDelete('permissions', {
            name: ['create-job', 'update-job', 'delete-job', 'view-job']
        });
    }
};
