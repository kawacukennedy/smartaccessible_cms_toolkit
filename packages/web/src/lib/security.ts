// Rate limiting implementation
interface RateLimitEntry {
  count: number;
  resetTime: number;
}

class RateLimiter {
  private limits: Map<string, RateLimitEntry> = new Map();
  private maxRequests: number;
  private windowMs: number;

  constructor(maxRequests: number = 100, windowMs: number = 15 * 60 * 1000) { // 100 requests per 15 minutes
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const entry = this.limits.get(identifier);

    if (!entry || now > entry.resetTime) {
      // First request or window expired
      this.limits.set(identifier, {
        count: 1,
        resetTime: now + this.windowMs
      });
      return true;
    }

    if (entry.count >= this.maxRequests) {
      return false;
    }

    entry.count++;
    return true;
  }

  getRemainingRequests(identifier: string): number {
    const entry = this.limits.get(identifier);
    if (!entry) return this.maxRequests;

    const now = Date.now();
    if (now > entry.resetTime) {
      return this.maxRequests;
    }

    return Math.max(0, this.maxRequests - entry.count);
  }

  getResetTime(identifier: string): number {
    const entry = this.limits.get(identifier);
    return entry?.resetTime || 0;
  }
}

// Global rate limiter instances
export const apiRateLimiter = new RateLimiter(1000, 15 * 60 * 1000); // 1000 requests per 15 minutes
export const authRateLimiter = new RateLimiter(5, 15 * 60 * 1000); // 5 auth attempts per 15 minutes

// RBAC (Role-Based Access Control) system
export type Permission =
  | 'content:create'
  | 'content:read'
  | 'content:update'
  | 'content:delete'
  | 'content:publish'
  | 'media:upload'
  | 'media:delete'
  | 'user:manage'
  | 'admin:full_access';

export type Role = 'viewer' | 'editor' | 'publisher' | 'admin';

const rolePermissions: Record<Role, Permission[]> = {
  viewer: ['content:read'],
  editor: ['content:read', 'content:create', 'content:update', 'media:upload'],
  publisher: ['content:read', 'content:create', 'content:update', 'content:publish', 'media:upload', 'media:delete'],
  admin: ['content:create', 'content:read', 'content:update', 'content:delete', 'content:publish', 'media:upload', 'media:delete', 'user:manage', 'admin:full_access']
};

export class AccessControl {
  static hasPermission(userRole: Role, permission: Permission): boolean {
    return rolePermissions[userRole]?.includes(permission) || false;
  }

  static hasAnyPermission(userRole: Role, permissions: Permission[]): boolean {
    return permissions.some(permission => this.hasPermission(userRole, permission));
  }

  static hasAllPermissions(userRole: Role, permissions: Permission[]): boolean {
    return permissions.every(permission => this.hasPermission(userRole, permission));
  }

  static getRolePermissions(role: Role): Permission[] {
    return [...rolePermissions[role]];
  }

  static canAccessResource(userRole: Role, resourceOwnerId?: string, userId?: string): boolean {
    // Admins can access everything
    if (userRole === 'admin') return true;

    // Publishers can access all content
    if (userRole === 'publisher') return true;

    // For other roles, check ownership
    if (resourceOwnerId && userId) {
      return resourceOwnerId === userId;
    }

    return false;
  }
}

// Input validation and sanitization
export class InputValidator {
  static sanitizeHtml(input: string): string {
    // Basic HTML sanitization - remove script tags and dangerous attributes
    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
      .replace(/on\w+="[^"]*"/gi, '')
      .replace(/javascript:/gi, '');
  }

  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length <= 254;
  }

  static validatePassword(password: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }

    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }

    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }

    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }

    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  static validateContentTitle(title: string): boolean {
    return title.length > 0 && title.length <= 200 && !/<script/i.test(title);
  }

  static validateContentBody(body: string): boolean {
    return body.length <= 100000 && !/<script/i.test(body);
  }

  static escapeSql(input: string): string {
    // Basic SQL injection prevention
    return input.replace(/['";\\]/g, '\\$&');
  }
}

// Security headers and CSP
export const securityHeaders = {
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self'",
    "connect-src 'self'",
    "media-src 'self'",
    "object-src 'none'",
    "frame-ancestors 'none'"
  ].join('; '),

  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
};

// Audit logging
interface AuditLogEntry {
  id: string;
  timestamp: number;
  userId?: string;
  action: string;
  resource: string;
  details?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
}

class AuditLogger {
  private logs: AuditLogEntry[] = [];
  private maxLogs = 1000;

  log(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>): void {
    const auditEntry: AuditLogEntry = {
      ...entry,
      id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now()
    };

    this.logs.push(auditEntry);

    // Keep only the most recent logs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // In a real application, this would be sent to a logging service
    console.log('Audit Log:', auditEntry);
  }

  getLogs(filter?: { userId?: string; action?: string; since?: number }): AuditLogEntry[] {
    let filteredLogs = this.logs;

    if (filter?.userId) {
      filteredLogs = filteredLogs.filter(log => log.userId === filter.userId);
    }

    if (filter?.action) {
      filteredLogs = filteredLogs.filter(log => log.action === filter.action);
    }

    if (filter?.since) {
      filteredLogs = filteredLogs.filter(log => log.timestamp >= filter.since);
    }

    return filteredLogs.sort((a, b) => b.timestamp - a.timestamp);
  }

  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }
}

export const auditLogger = new AuditLogger();

// Security middleware for API routes
export function withSecurity<T extends any[]>(
  handler: (...args: T) => Promise<Response>,
  options: {
    rateLimit?: boolean;
    requireAuth?: boolean;
    requiredPermission?: Permission;
    validateInput?: (body: any) => boolean;
  } = {}
) {
  return async (...args: T): Promise<Response> => {
    const [request] = args as [Request];

    // Rate limiting
    if (options.rateLimit) {
      const clientIP = request.headers.get('x-forwarded-for') ||
                      request.headers.get('x-real-ip') ||
                      'unknown';

      if (!apiRateLimiter.isAllowed(clientIP)) {
        auditLogger.log({
          action: 'rate_limit_exceeded',
          resource: request.url,
          ipAddress: clientIP,
          userAgent: request.headers.get('user-agent') || undefined
        });

        return new Response(JSON.stringify({
          error: 'Rate limit exceeded',
          retryAfter: Math.ceil((apiRateLimiter.getResetTime(clientIP) - Date.now()) / 1000)
        }), {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': Math.ceil((apiRateLimiter.getResetTime(clientIP) - Date.now()) / 1000).toString()
          }
        });
      }
    }

    // Authentication check
    if (options.requireAuth) {
      const authHeader = request.headers.get('authorization');
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return new Response(JSON.stringify({ error: 'Authentication required' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // In a real app, validate the JWT token here
      // For now, we'll assume it's valid
    }

    // Input validation
    if (options.validateInput && request.method !== 'GET') {
      try {
        const body = await request.clone().json();
        if (!options.validateInput(body)) {
          return new Response(JSON.stringify({ error: 'Invalid input' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          });
        }
      } catch (error) {
        return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    // Execute the handler
    try {
      return await handler(...args);
    } catch (error) {
      console.error('API Error:', error);
      auditLogger.log({
        action: 'api_error',
        resource: request.url,
        details: { error: error instanceof Error ? error.message : 'Unknown error' }
      });

      return new Response(JSON.stringify({ error: 'Internal server error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  };
}