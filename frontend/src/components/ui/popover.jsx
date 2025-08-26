"use client"

import * as React from "react"

const PopoverContext = React.createContext()

const Popover = ({ children, open, onOpenChange }) => {
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
    <PopoverContext.Provider value={{ isOpen, onOpenChange: handleOpenChange }}>
      <div>{children}</div>
    </PopoverContext.Provider>
  )
}

const PopoverTrigger = React.forwardRef(({ className, children, asChild, ...props }, ref) => {
  const context = React.useContext(PopoverContext)

  const handleClick = () => {
    if (context?.onOpenChange) {
      context.onOpenChange(!context.isOpen)
    }
  }

  if (asChild) {
    return React.cloneElement(children, {
      ...props,
      ref,
      onClick: handleClick,
      "aria-expanded": context?.isOpen,
    })
  }

  return (
    <button ref={ref} className={className} onClick={handleClick} aria-expanded={context?.isOpen} {...props}>
      {children}
    </button>
  )
})
PopoverTrigger.displayName = "PopoverTrigger"

const PopoverContent = React.forwardRef(({ className, align = "center", sideOffset = 4, ...props }, ref) => {
  const context = React.useContext(PopoverContext)

  if (!context?.isOpen) return null

  return (
    <div
      ref={ref}
      className={`absolute z-50 w-72 rounded-md border bg-green-100 p-4 text-popover-foreground shadow-md outline-none  ${className || ""}`}
      {...props}
    />
  )
})
PopoverContent.displayName = "PopoverContent"

export { Popover, PopoverTrigger, PopoverContent }
