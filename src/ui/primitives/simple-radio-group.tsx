"use client";

import * as React from "react";
import { cn } from "~/lib/cn";

interface RadioGroupContextType {
  value?: string;
  onValueChange?: (value: string) => void;
  name?: string;
}

const RadioGroupContext = React.createContext<RadioGroupContextType>({});

interface RadioGroupProps {
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
  children: React.ReactNode;
  name?: string;
}

export function SimpleRadioGroup({ 
  value, 
  onValueChange, 
  className, 
  children, 
  name 
}: RadioGroupProps) {
  return (
    <RadioGroupContext.Provider value={{ value, onValueChange, name }}>
      <div className={cn("grid gap-2", className)} role="radiogroup">
        {children}
      </div>
    </RadioGroupContext.Provider>
  );
}

interface RadioGroupItemProps {
  value: string;
  id?: string;
  disabled?: boolean;
  className?: string;
}

export function SimpleRadioGroupItem({ 
  value, 
  id, 
  disabled = false, 
  className 
}: RadioGroupItemProps) {
  const context = React.useContext(RadioGroupContext);
  const isChecked = context.value === value;

  const handleChange = () => {
    if (!disabled && context.onValueChange) {
      context.onValueChange(value);
    }
  };

  return (
    <div className="flex items-center">
      <input
        type="radio"
        id={id}
        name={context.name}
        value={value}
        checked={isChecked}
        onChange={handleChange}
        disabled={disabled}
        className={cn(
          "h-4 w-4 rounded-full border border-primary text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
      />
    </div>
  );
}
