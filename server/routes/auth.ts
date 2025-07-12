import { Request, Response } from 'express';
import { authService } from '../auth';
import { loginSchema, registerSchema, type LoginData, type RegisterData } from '@shared/schema';

export async function register(req: Request, res: Response) {
  try {
    const data: RegisterData = registerSchema.parse(req.body);
    
    // Check if user already exists
    const existingUser = await authService.getUserByEmail(data.email);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    // Create new user
    const user = await authService.createUser(data);
    
    // Create session
    const sessionId = await authService.createSession(user.id);
    
    // Set session cookie
    res.cookie('sessionId', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });
    
    // Return user data (without password)
    const { password, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword, success: true });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(400).json({ error: 'Registration failed' });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const data: LoginData = loginSchema.parse(req.body);
    
    // Validate user credentials
    const user = await authService.validateUser(data.email, data.password);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Create session
    const sessionId = await authService.createSession(user.id);
    
    // Set session cookie
    res.cookie('sessionId', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });
    
    // Return user data (without password)
    const { password, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword, success: true });
  } catch (error) {
    console.error('Login error:', error);
    res.status(400).json({ error: 'Login failed' });
  }
}

export async function logout(req: Request, res: Response) {
  try {
    const sessionId = req.cookies.sessionId;
    
    if (sessionId) {
      await authService.deleteSession(sessionId);
    }
    
    res.clearCookie('sessionId');
    res.json({ success: true });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Logout failed' });
  }
}

export async function getProfile(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    
    const { password, ...userWithoutPassword } = req.user;
    res.json({ user: userWithoutPassword });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ error: 'Failed to get profile' });
  }
}

export async function updateProfile(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    
    const { name, preferences } = req.body;
    
    // Update user profile
    const updatedUser = await authService.updateUserProfile(req.user.id, {
      name,
      preferences,
    });
    
    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const { password, ...userWithoutPassword } = updatedUser;
    res.json({ user: userWithoutPassword });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
}