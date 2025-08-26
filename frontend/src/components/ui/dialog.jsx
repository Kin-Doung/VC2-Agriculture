import * as React from "react"
import { X } from 'lucide-react'

const Dialog = ({ children, open, onOpenChange }) => {
  const [isOpen, setIsOpen] = React.useState(open || false)
  
  React.useEffect(() => {
    if (open !== undefined) {
      setIsOpen(open)
    }
  }, [open])
  
  const handleOpenChange = (newOpen) => {
    setIsOpen(newOpen)
    if (onOpenChange) {
      onOpenChange(newOpen)
    }
  }
  
  return (
    <div>
      {React.Children.map(children, child =>
        React.cloneElement(child, { isOpen, onOpenChange: handleOpenChange })
      )}
    </div>
  )
}

const DialogTrigger = React.forwardRef(({ className, children, asChild, isOpen, onOpenChange, ...props }, ref) => {
  if (asChild) {
    return React.cloneElement(children, {
      ...props,
      ref,
      onClick: () => onOpenChange && onOpenChange(true),
    })
  }
  
  return (
    <button
      ref={ref}
      className={className}
      onClick={() => onOpenChange && onOpenChange(true)}
      {...props}
    >
      {children}
    </button>
  )
})
DialogTrigger.displayName = "DialogTrigger"

const DialogContent = React.forwardRef(({ className, children, isOpen, onOpenChange, ...props }, ref) => {
  if (!isOpen) return null
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={() => onOpenChange && onOpenChange(false)} />
      <div
        ref={ref}
        className={`relative z-50 grid w-full max-w-lg gap-4 border bg-background p-6 shadow-lg sm:rounded-lg ${className || ""}`}
        {...props}
      >
        <button
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          onClick={() => onOpenChange && onOpenChange(false)}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
        {children}
      </div>
    </div>
  )
})
DialogContent.displayName = "DialogContent"

const DialogHeader = ({ className, ...props }) => (
  <div className={`flex flex-col space-y-1.5 text-center sm:text-left ${className || ""}`} {...props} />
)
DialogHeader.displayName = "DialogHeader"

const DialogTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={`text-lg font-semibold leading-none tracking-tight ${className || ""}`}
    {...props}
  />
))
DialogTitle.displayName = "DialogTitle"

const DialogDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p ref={ref} className={`text-sm text-muted-foreground ${className || ""}`} {...props} />
))
DialogDescription.displayName = "DialogDescription"

export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
}
