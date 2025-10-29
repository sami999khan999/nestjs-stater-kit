import { Module } from '@nestjs/common';
import { CmsController } from './cms.controller';
import { SeoService } from './services/seo.service';
import { DashboardService } from './services/dashboard.service';
import { SitemapService } from './services/sitemap.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [PrismaModule, ConfigModule],
  controllers: [CmsController],
  providers: [SeoService, DashboardService, SitemapService],
  exports: [SeoService, DashboardService, SitemapService],
})
export class CmsModule {}
