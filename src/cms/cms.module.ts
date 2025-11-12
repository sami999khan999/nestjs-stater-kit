import { Module } from '@nestjs/common';
import { SeoService } from './services/seo.service';
import { DashboardService } from './services/dashboard.service';
import { SitemapService } from './services/sitemap.service';
import { SettingsService } from './services/settings.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { UploadModule } from 'src/upload/upload.module';
import { HeroService } from './services/hero.service';
import { BannerService } from './services/banner.service';
import { HeroPublicController } from './hero.controller';
import { BannerPublicController } from './banner.controller';
import { TestimonialService } from './services/testimonial.service';
import { TestimonialPublicController } from './testimonial.controller';
import { CmsPublicController } from './public.controller';

@Module({
  imports: [PrismaModule, ConfigModule, UploadModule],
  controllers: [
    HeroPublicController,
    BannerPublicController,
    TestimonialPublicController,
    CmsPublicController,
  ],
  providers: [
    SeoService,
    DashboardService,
    SitemapService,
    SettingsService,
    HeroService,
    BannerService,
    TestimonialService,
  ],
  exports: [
    SeoService,
    DashboardService,
    SitemapService,
    SettingsService,
    HeroService,
    BannerService,
    TestimonialService,
  ],
})
export class CmsModule {}
