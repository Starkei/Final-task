import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongoModule } from 'src/mongoose/mongo.module';
import { UserService } from 'src/users/user.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { FacebookStrategy } from './facebook.strategy';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
      inject: [ConfigService],
    }),
    MongoModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    ConfigService,
    UserService,
    FacebookStrategy,
    JwtStrategy,
    LocalStrategy,
  ],
  exports: [AuthService, FacebookStrategy, JwtStrategy, LocalStrategy],
})
export class AuthModule {}
