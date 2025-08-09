import React from 'react';
import { cn } from '../../lib/utils';

export interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  description?: string;
}

const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, label, description, ...props }, ref) => {
    return (
      <div className="flex items-center space-x-2">
        <div className="relative">
          <input
            type="checkbox"
            className="sr-only"
            ref={ref}
            {...props}
          />
          <div
            className={cn(
              "block bg-muted w-14 h-8 rounded-full cursor-pointer transition-colors",
              props.checked && "bg-primary",
              className
            )}
            onClick={() => {
              if (props.onChange && !props.disabled) {
                props.onChange({
                  target: { checked: !props.checked },
                } as React.ChangeEvent<HTMLInputElement>);
              }
            }}
          >
            <div
              className={cn(
                "dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform",
                props.checked && "transform translate-x-6"
              )}
            />
          </div>
        </div>
        {(label || description) && (
          <div className="space-y-1">
            {label && (
              <label className="text-sm font-medium leading-none cursor-pointer">
                {label}
              </label>
            )}
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </div>
        )}
      </div>
    );
  }
);

Switch.displayName = "Switch";

export { Switch };
