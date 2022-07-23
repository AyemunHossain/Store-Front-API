export default () => ({
  productionBuild: process.env.PRODUCTION_BUILD === 'true',
  hostname: `http://localhost:${process.env.PORT || 3000}`,
  port: parseInt(process.env.PORT, 10) || 3000,
  mongoCluster: `mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@localhost:${process.env.DB_PORT}/${process.env.DB_NAME}?authSource=${process.env.AUTH_SOURCE}`,
  userJwtSecret: process.env.JWT_PRIVATE_KEY_USER,
  merchantJwtSecret: process.env.JWT_PRIVATE_KEY_MERCHANT,
  adminJwtSecret: process.env.JWT_PRIVATE_KEY_ADMIN,
  userTokenExpiredTime: 86400,
  merchantTokenExpiredTime:86400,
  adminTokenExpiredTime: 86400,
});
