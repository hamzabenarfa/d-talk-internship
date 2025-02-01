const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createResources = async ( files, resourceType, resourceId ) => {
  // Validate resourceType
  if (!['USER', 'CANDIDATURE', 'SUJET'].includes(resourceType)) {
    throw new Error('Invalid resourceType');
  }

  return await Promise.all(
    files.map(async (file) => {
      // Construct the data object dynamically based on resourceType
      const data = {
        filename: file.filename,
        type: file.mimetype,
        resourceType: resourceType,
      };

      // Add the appropriate foreign key based on resourceType
      if (resourceType === 'USER') {
        data.userId = resourceId;
      } else if (resourceType === 'CANDIDATURE') {
        data.candidatureId = resourceId;
      } else if (resourceType === 'SUJET') {
        data.sujetId = resourceId;
      }

      return await prisma.resource.create({ data });
    })
  );
};

module.exports = { createResources };
