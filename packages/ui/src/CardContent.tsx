import React, { PropsWithChildren } from 'react';
import clsx from 'clsx';

export function CardContent({
  className,
  children,
}: PropsWithChildren<{ className?: string }>) {
  return <div className={clsx('p-4', className)}>{children}</div>;
}