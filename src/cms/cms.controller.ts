import {
  Controller,
  Get,
  Param,
  Query,
  Res,
  UseGuards,
  HttpCode,
  HttpStatus,
  Header,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { SeoService } from './services/seo.service';
import { DashboardService } from './services/dashboard.service';
import { SitemapService } from './services/sitemap.service';
import {
  AnalyticsQueryDto,
  analyticsQuerySchema,
  TrafficSourcesQueryDto,
  trafficSourcesQuerySchema,
} from './dto/analytics.dto';
import { NotAcceptableException } from '@nestjs/common';

@Controller('cms')
export class CmsController {
  constructor(
    private readonly seoService: SeoService,
    private readonly dashboardService: DashboardService,
    private readonly sitemapService: SitemapService,
  ) {}

  // ==================== Dashboard Endpoints ====================

  /**
   * Get comprehensive dashboard statistics
   */
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Permissions('admin.dashboard.view')
  @Get('dashboard/stats')
  async getDashboardStats() {
    return this.dashboardService.getDashboardStats();
  }

  /**
   * Get analytics for date range
   */
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Permissions('admin.analytics.view')
  @Get('dashboard/analytics')
  async getAnalytics(@Query() query: AnalyticsQueryDto) {
    const parsed = analyticsQuerySchema.safeParse(query);
    if (!parsed.success) {
      throw new NotAcceptableException(parsed.error.errors);
    }
    return this.dashboardService.getAnalytics(
      parsed.data.startDate,
      parsed.data.endDate,
    );
  }

  /**
   * Get traffic sources
   */
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Permissions('admin.analytics.view')
  @Get('dashboard/traffic-sources')
  async getTrafficSources(@Query() query: TrafficSourcesQueryDto) {
    const parsed = trafficSourcesQuerySchema.safeParse(query);
    if (!parsed.success) {
      throw new NotAcceptableException(parsed.error.errors);
    }
    return this.dashboardService.getTrafficSources(parsed.data.days);
  }

  /**
   * Get content performance metrics
   */
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Permissions('admin.analytics.view')
  @Get('dashboard/content-performance')
  async getContentPerformance() {
    return this.dashboardService.getContentPerformance();
  }

  /**
   * Get author statistics
   */
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Permissions('admin.analytics.view')
  @Get('dashboard/author-stats')
  async getAuthorStats() {
    return this.dashboardService.getAuthorStats();
  }

  // ==================== SEO Endpoints ====================

  /**
   * Analyze specific blog SEO
   */
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Permissions('admin.seo.view')
  @Get('seo/analyze/:blogId')
  async analyzeBlogSEO(@Param('blogId') blogId: string) {
    return this.seoService.generateSEOReport(blogId);
  }

  /**
   * Bulk SEO analysis for all blogs
   */
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Permissions('admin.seo.view')
  @Get('seo/bulk-analyze')
  async bulkAnalyzeSEO() {
    return this.seoService.bulkAnalyzeSEO();
  }

  /**
   * Get SEO recommendations
   */
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Permissions('admin.seo.view')
  @Get('seo/recommendations')
  async getSEORecommendations(@Query('type') type?: 'blog' | 'category') {
    return this.seoService.getSEORecommendations(type || 'blog');
  }

  // ==================== Sitemap Endpoints ====================

  /**
   * Get XML sitemap (Public)
   */
  @Get('sitemap.xml')
  @HttpCode(HttpStatus.OK)
  @Header('Content-Type', 'application/xml')
  async getSitemap(@Res() res: Response) {
    const sitemap = await this.sitemapService.generateSitemap();
    res.send(sitemap);
  }

  /**
   * Get robots.txt (Public)
   */
  @Get('robots.txt')
  @HttpCode(HttpStatus.OK)
  @Header('Content-Type', 'text/plain')
  async getRobotsTxt(@Res() res: Response) {
    const robotsTxt = await this.sitemapService.generateRobotsTxt();
    res.send(robotsTxt);
  }

  /**
   * Get RSS feed (Public)
   */
  @Get('rss.xml')
  @HttpCode(HttpStatus.OK)
  @Header('Content-Type', 'application/rss+xml')
  async getRSSFeed(@Res() res: Response) {
    const rss = await this.sitemapService.generateRSSFeed();
    res.send(rss);
  }

  /**
   * Get HTML sitemap (Public)
   */
  @Get('sitemap.html')
  @HttpCode(HttpStatus.OK)
  @Header('Content-Type', 'text/html')
  async getHTMLSitemap(@Res() res: Response) {
    const sitemap = await this.sitemapService.generateHTMLSitemap();
    res.send(sitemap);
  }

  /**
   * Get sitemap statistics (Admin)
   */
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Permissions('admin.seo.view')
  @Get('sitemap/stats')
  async getSitemapStats() {
    return this.sitemapService.getSitemapStats();
  }
}
