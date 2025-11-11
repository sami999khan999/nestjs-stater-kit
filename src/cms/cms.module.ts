import { Module } from '@nestjs/common';
import { CmsController } from './cms.controller';
import { SeoService } from './services/seo.service';
import { DashboardService } from './services/dashboard.service';
import { SitemapService } from './services/sitemap.service';
import { SettingsService } from './services/settings.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { UploadModule } from 'src/upload/upload.module';

@Module({
  imports: [PrismaModule, ConfigModule, UploadModule],
  controllers: [CmsController],
  providers: [SeoService, DashboardService, SitemapService, SettingsService],
  exports: [SeoService, DashboardService, SitemapService, SettingsService],
})
export class CmsModule {}
