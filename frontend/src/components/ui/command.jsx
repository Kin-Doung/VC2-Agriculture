"use client"

import * as React from "react"
import { Search } from "lucide-react"

const Command = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={`flex h-full w-full flex-col overflow-hidden rounded-md bg-popove text-popover-foreground ${className || ""}`}
    {...props}
  />
))
Command.displayName = "Command"

const CommandInput = React.forwardRef(({ className, value, onValueChange, ...props }, ref) => {
  const handleChange = (e) => {
    if (onValueChange) {
      onValueChange(e.target.value)
    }
  }

  return (
    <div className="flex items-center border-b px-3" cmdk-input-wrapper="">
      <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
      <input
        ref={ref}
        value={value}
        onChange={handleChange}
        className={`flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 ${className || ""}`}
        {...props}
      />
    </div>
  )
})
CommandInput.displayName = "CommandInput"

const CommandList = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={`max-h-[300px] overflow-y-auto overflow-x-hidden ${className || ""}`} {...props} />
))
CommandList.displayName = "CommandList"

const CommandEmpty = React.forwardRef((props, ref) => <div ref={ref} className="py-6 text-center text-sm" {...props} />)
CommandEmpty.displayName = "CommandEmpty"

const CommandGroup = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={`overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground ${className || ""}`}
    {...props}
  />
))
CommandGroup.displayName = "CommandGroup"

const CommandItem = React.forwardRef(({ className, onSelect, value, children, ...props }, ref) => {
  const handleClick = () => {
    if (onSelect) {
      onSelect(value)
    }
  }

  return (
    <div
      ref={ref}
      onClick={handleClick}
      className={`relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-accent hover:text-accent-foreground ${className || ""}`}
      {...props}
    >
      {children}
    </div>
  )
})
CommandItem.displayName = "CommandItem"

export { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem }
