import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertActivitySchema } from "@shared/schema";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes with /api prefix
  
  // User routes
  app.post("/api/auth/register", async (req: Request, res: Response) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user with email already exists
      const existingUserByEmail = await storage.getUserByEmail(userData.email);
      if (existingUserByEmail) {
        return res.status(400).json({ message: "Email already in use" });
      }
      
      // Check if user with username already exists
      const existingUserByUsername = await storage.getUserByUsername(userData.username);
      if (existingUserByUsername) {
        return res.status(400).json({ message: "Username already taken" });
      }
      
      // Only allow corporate emails
      const emailDomain = userData.email.split('@')[1];
      if (!emailDomain.match(/^(google|apple|meta|amazon|netflix|microsoft)\.(com|net|org)$/i)) {
        return res.status(400).json({ message: "Only corporate emails from major tech companies are allowed" });
      }
      
      const user = await storage.createUser(userData);
      
      // Don't return password in response
      const { password, ...userWithoutPassword } = user;
      return res.status(201).json(userWithoutPassword);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      return res.status(500).json({ message: "Server error during registration" });
    }
  });
  
  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }
      
      const user = await storage.getUserByEmail(email);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Return user without password
      const { password: _, ...userWithoutPassword } = user;
      return res.json(userWithoutPassword);
    } catch (error) {
      return res.status(500).json({ message: "Server error during login" });
    }
  });

  // Company routes
  app.get("/api/companies", async (_req: Request, res: Response) => {
    try {
      const companies = await storage.getAllCompanies();
      return res.json(companies);
    } catch (error) {
      return res.status(500).json({ message: "Server error fetching companies" });
    }
  });
  
  app.get("/api/companies/:code", async (req: Request, res: Response) => {
    try {
      const { code } = req.params;
      const company = await storage.getCompanyByCode(code);
      
      if (!company) {
        return res.status(404).json({ message: "Company not found" });
      }
      
      return res.json(company);
    } catch (error) {
      return res.status(500).json({ message: "Server error fetching company" });
    }
  });

  // Burnout leaderboard
  app.get("/api/burnout/leaderboard", async (_req: Request, res: Response) => {
    try {
      const users = await storage.getUsersWithHighestBurnout(10);
      
      // Don't include passwords or sensitive info
      const leaderboard = users.map(user => ({
        id: user.id,
        username: user.username,
        displayName: user.displayName,
        burnoutScore: user.burnoutScore,
        avatarInitials: user.avatarInitials,
        company: user.company
      }));
      
      return res.json(leaderboard);
    } catch (error) {
      return res.status(500).json({ message: "Server error fetching burnout leaderboard" });
    }
  });
  
  app.get("/api/burnout/symptoms/:userId", async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const symptoms = await storage.getBurnoutSymptoms(parseInt(userId));
      
      if (!symptoms) {
        return res.status(404).json({ message: "Burnout symptoms not found" });
      }
      
      return res.json(symptoms);
    } catch (error) {
      return res.status(500).json({ message: "Server error fetching burnout symptoms" });
    }
  });

  // Activity routes
  app.get("/api/activities", async (_req: Request, res: Response) => {
    try {
      const activities = await storage.getActivities(20);
      
      // Enrich activities with user info
      const enrichedActivities = await Promise.all(
        activities.map(async (activity) => {
          const user = await storage.getUser(activity.userId);
          return {
            ...activity,
            user: user ? {
              username: user.username,
              displayName: user.displayName,
              avatarInitials: user.avatarInitials,
              company: user.company
            } : null
          };
        })
      );
      
      return res.json(enrichedActivities);
    } catch (error) {
      return res.status(500).json({ message: "Server error fetching activities" });
    }
  });
  
  app.post("/api/activities", async (req: Request, res: Response) => {
    try {
      const activityData = insertActivitySchema.parse(req.body);
      const activity = await storage.createActivity(activityData);
      
      // Get user info
      const user = await storage.getUser(activity.userId);
      
      const enrichedActivity = {
        ...activity,
        user: user ? {
          username: user.username,
          displayName: user.displayName,
          avatarInitials: user.avatarInitials,
          company: user.company
        } : null
      };
      
      return res.status(201).json(enrichedActivity);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      return res.status(500).json({ message: "Server error creating activity" });
    }
  });

  // Notification routes
  app.get("/api/notifications/:userId", async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const notifications = await storage.getNotifications(parseInt(userId));
      return res.json(notifications);
    } catch (error) {
      return res.status(500).json({ message: "Server error fetching notifications" });
    }
  });
  
  app.patch("/api/notifications/:id/read", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const notification = await storage.markNotificationAsRead(parseInt(id));
      
      if (!notification) {
        return res.status(404).json({ message: "Notification not found" });
      }
      
      return res.json(notification);
    } catch (error) {
      return res.status(500).json({ message: "Server error marking notification as read" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
