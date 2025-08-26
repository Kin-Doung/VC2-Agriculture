// src/components/ui/Card.jsx
import * as React from "react";

// Card component
const Card = React.forwardRef(({ className = "", children, ...props }, ref) => (
  <div
    ref={ref}
    className={`rounded-lg border border-gray-200 bg-white text-gray-900 shadow-sm ${className}`}
    {...props}
  >
    {children}
  </div>
));
Card.displayName = "Card";

// CardHeader component
const CardHeader = React.forwardRef(({ className = "", children, ...props }, ref) => (
  <div
    ref={ref}
    className={`flex flex-col space-y-1.5 p-4 border-b border-gray-200 ${className}`}
    {...props}
  >
    {children}
  </div>
));
CardHeader.displayName = "CardHeader";

// CardTitle component
const CardTitle = React.forwardRef(({ className = "", children, ...props }, ref) => (
  <h3
    ref={ref}
    className={`text-lg font-semibold leading-none tracking-tight text-gray-900 ${className}`}
    {...props}
  >
    {children}
  </h3>
));
CardTitle.displayName = "CardTitle";

// CardDescription component
const CardDescription = React.forwardRef(({ className = "", children, ...props }, ref) => (
  <p
    ref={ref}
    className={`text-sm text-gray-600 ${className}`}
    {...props}
  >
    {children}
  </p>
));
CardDescription.displayName = "CardDescription";

// CardContent component
const CardContent = React.forwardRef(({ className = "", children, ...props }, ref) => (
  <div
    ref={ref}
    className={`p-4 ${className}`}
    {...props}
  >
    {children}
  </div>
));
CardContent.displayName = "CardContent";

// CardFooter component
const CardFooter = React.forwardRef(({ className = "", children, ...props }, ref) => (
  <div
    ref={ref}
    className={`flex items-center p-4 pt-0 ${className}`}
    {...props}
  >
    {children}
  </div>
));
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };