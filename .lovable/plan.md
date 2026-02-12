
# Super Admin Dashboard - Sales Progress Page

## Overview
Create the first page of the new Super Admin Dashboard with its own sidebar navigation and the Sales Progress page containing two view-only tables: Territory-wise Sales (from Admin) and Market-wise Sales (from FE).

## What will be built

### 1. Super Admin Sidebar
A new dedicated sidebar component for the Super Admin dashboard, following the same design pattern as the existing Admin sidebar. It will include:
- "Larimar Pharma" branding header
- Collapsible sidebar toggle
- Navigation menu starting with "Sales Progress" (more items to be added later)
- Footer showing "Super Admin" user info

### 2. Sales Progress Page
The page at `/super-admin-dashboard/sales-progress` will contain:

**Header Section**
- Blue background header (matching Admin dashboard style) with TrendingUp icon and "Sales Progress" title

**Section 1 - Territory-wise Target and Sales Overview**
- Reuses the existing `AdminTerritoryTable` component directly (already view-only, already shows manager name under territory)
- Wrapped in a card with MapPin icon header, same as Admin Sales Progress page

**Section 2 - Market Wise Sales (View Only)**
- A new `SuperAdminMarketSalesTable` component based on the FE's `MarketSalesTable` but stripped of all editing functionality (no edit buttons, no inline inputs)
- Displays: SL.NO, Market name, Secondary Sales amount
- Same styling (Card with gradient header, MapPin icon) but without the Actions column

### 3. Route Registration
- New route: `/super-admin-dashboard/sales-progress`

## Technical Details

### New Files
1. **`src/components/super-admin-dashboard/SuperAdminSidebar.tsx`** - Sidebar with collapsible navigation, initially containing Sales Progress menu item
2. **`src/components/super-admin-sales-progress/SuperAdminMarketSalesTable.tsx`** - View-only version of MarketSalesTable (no edit state, no action buttons)
3. **`src/pages/SuperAdminSalesProgress.tsx`** - Page layout combining sidebar + header + both tables

### Modified Files
4. **`src/App.tsx`** - Add route for `/super-admin-dashboard/sales-progress`

### Component Reuse
- `AdminTerritoryTable` will be imported and used directly (it's already view-only with manager names)
- `SuperAdminMarketSalesTable` will be a simplified copy of `MarketSalesTable` with all editing logic removed
