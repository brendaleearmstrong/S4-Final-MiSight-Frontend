import React from 'react';
import { cn } from '@/lib/utils';

export const Input = React.forwardRef(({ type = 'text', className, ...props }, ref) => (
  <input
    type={type}
    className={cn('block w-full rounded-md border border-gray-300 p-2', className)}
    ref={ref}
    {...props}
  />
));
Input.displayName = 'Input';