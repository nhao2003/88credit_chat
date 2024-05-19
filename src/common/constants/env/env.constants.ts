import { ConfigService } from '@nestjs/config';

abstract class EnvConstants {
  public static readonly env = 'ENV';
  public static readonly isProduction = 'IS_PRODUCTION';
  public static readonly isDevelopment = 'IS_DEVELOPMENT';
  public static readonly port = 'PORT';
  public static readonly mongoUri = 'MONGO_URI';
}

export { EnvConstants };
