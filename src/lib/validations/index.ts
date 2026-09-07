import { z } from "zod";

export const eventSchema = z.object({
  name: z.string().min(3, "Event name must be at least 3 characters"),
  department: z.string().min(2, "Department is required"),
  eventDate: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  location: z.string().min(2, "Location is required"),
  expectedAttendance: z.number().int().positive("Expected attendance must be positive"),
  mealsPrepared: z.number().int().nonnegative().optional(),
  foodProvider: z.string().min(2, "Food provider details required"),
});

export const surplusRequestSchema = z.object({
  sourceType: z.enum(["EVENT", "CAFETERIA"]),
  sourceId: z.string().optional(),
  foodType: z.string().min(3, "Food type description is required"),
  quantityPortions: z.number().int().positive("Quantity must be greater than 0"),
  estimatedWeightKg: z.number().positive("Estimated weight must be greater than 0"),
  availableFrom: z.string(),
  pickupDeadline: z.string(),
  pickupLocation: z.string().min(3, "Pickup location is required"),
  contactPhone: z.string().min(7, "Valid contact phone is required"),
  notes: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["ADMIN", "CAFETERIA_MANAGER", "EVENT_MANAGER", "RECIPIENT_ORGANIZATION"]),
  organizationId: z.string().optional(),
});

export const nlpIntakeSchema = z.object({
  rawText: z.string().min(5, "Natural language text must be at least 5 characters long"),
});

