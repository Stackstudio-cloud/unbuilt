import bcrypt from 'bcrypt';
import { db } from './db';
import { users, sessions, type User, type InsertUser } from '@shared/schema';
import { eq } from 'drizzle-orm';

export class AuthService {
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  async createUser(userData: InsertUser): Promise<User> {
    const hashedPassword = await this.hashPassword(userData.password);
    
    const [user] = await db.insert(users).values({
      ...userData,
      password: hashedPassword,
    }).returning();
    
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async getUserById(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.getUserByEmail(email);
    if (!user) return null;
    
    const isValid = await this.verifyPassword(password, user.password);
    if (!isValid) return null;
    
    return user;
  }

  async createSession(userId: number): Promise<string> {
    const sessionId = this.generateSessionId();
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
    
    await db.insert(sessions).values({
      id: sessionId,
      userId,
      expiresAt,
    });
    
    return sessionId;
  }

  async getSessionUser(sessionId: string): Promise<User | null> {
    const [session] = await db.select().from(sessions).where(eq(sessions.id, sessionId));
    
    if (!session || session.expiresAt < new Date()) {
      if (session) {
        await this.deleteSession(sessionId);
      }
      return null;
    }
    
    const user = await this.getUserById(session.userId);
    return user || null;
  }

  async deleteSession(sessionId: string): Promise<void> {
    await db.delete(sessions).where(eq(sessions.id, sessionId));
  }

  async updateUserPlan(userId: number, plan: string, subscriptionData?: any): Promise<void> {
    await db.update(users).set({
      plan,
      subscriptionStatus: subscriptionData?.status || 'active',
      subscriptionId: subscriptionData?.id,
      stripeCustomerId: subscriptionData?.customerId,
      updatedAt: new Date(),
    }).where(eq(users.id, userId));
  }

  async incrementSearchCount(userId: number): Promise<void> {
    await db.update(users).set({
      searchCount: users.searchCount + 1,
    }).where(eq(users.id, userId));
  }

  async resetSearchCount(userId: number): Promise<void> {
    await db.update(users).set({
      searchCount: 0,
      lastResetDate: new Date(),
    }).where(eq(users.id, userId));
  }

  async updateUserProfile(userId: number, updates: Partial<User>): Promise<User | undefined> {
    const [updatedUser] = await db.update(users).set({
      ...updates,
      updatedAt: new Date(),
    }).where(eq(users.id, userId)).returning();
    
    return updatedUser;
  }

  async canUserSearch(userId: number): Promise<boolean> {
    const user = await this.getUserById(userId);
    if (!user) return false;
    
    if (user.plan === 'pro' || user.plan === 'enterprise') {
      return true; // Unlimited searches
    }
    
    // Check if it's a new month for free users
    const lastReset = new Date(user.lastResetDate);
    const now = new Date();
    const isNewMonth = now.getMonth() !== lastReset.getMonth() || now.getFullYear() !== lastReset.getFullYear();
    
    if (isNewMonth) {
      await this.resetSearchCount(userId);
      return true;
    }
    
    return user.searchCount < 5; // Free tier limit
  }

  private generateSessionId(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }
}

export const authService = new AuthService();