import { AlertTriangle, XCircle } from 'lucide-react';

const variants = {
  default: 'bg-background text-foreground',
  destructive: 'bg-destructive text-destructive-foreground',
};

export function Alert({ variant = 'default', className, children, ...props }) {
  return (
    <div
      role="alert"
      className={`relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground ${variants[variant]} ${className}`}
      {...props}
    >
      {variant === 'destructive' && <XCircle className="h-4 w-4" />}
      {variant === 'default' && <AlertTriangle className="h-4 w-4" />}
      {children}
    </div>
  );
}

export function AlertTitle({ className, children, ...props }) {
  return (
    <h5
      className={`mb-1 font-medium leading-none tracking-tight ${className}`}
      {...props}
    >
      {children}
    </h5>
  );
}

export function AlertDescription({ className, children, ...props }) {
  return (
    <div
      className={`text-sm [&_p]:leading-relaxed ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}