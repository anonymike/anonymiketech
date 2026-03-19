# Project Cleanup Guide

## Overview
Your project has a legacy `/client/` folder that contains duplicated components. The current codebase properly uses `/components/` for all components. This guide explains what needs cleanup and why.

## Issue
- **Legacy Folder**: `/client/` - contains old component structure
- **Current Structure**: `/components/` - where all new components should go
- **Problem**: The `/client/` folder is NOT actively imported but exists from previous project versions

## What's in `/client/`
The `/client/` folder contains:
- `components/` - Duplicate UI components and custom components
- `components/ui/` - Shadcn/ui component library (same as in `/components/ui/`)

## Current Usage
All current imports use `/components/`:
```typescript
import BackToTop from "@/components/BackToTop"
import ChatbotsAuthModal from "@/components/ChatbotsAuthModal"
import ShoppingCart from "@/components/ShoppingCart"
```

## Recommendation
**Delete the `/client/` folder entirely** - it's not being used and creates confusion.

### Steps to Clean Up:
1. Ensure all imports reference `/components/` (they should already)
2. Delete the entire `/client/` folder
3. Deploy the clean codebase

### Why Remove It?
- No active imports from `/client/`
- Creates duplicate files and confusion
- Reduces bundle size
- Cleaner project structure
- Easier maintenance

## Chatbots Component Location
All new chatbots components are in `/components/`:
- `ChatbotsAuthModal.tsx`
- `ChatbotCard.tsx`
- `ChatbotCoinPurchaseModal.tsx`
- `ChatbotDeploymentForm.tsx`
- `ChatbotsPromoBanner.tsx`

These will work correctly with the cleanup.
