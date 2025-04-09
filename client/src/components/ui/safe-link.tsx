import React from "react";
import { Link as WouterLink, useLocation, useRoute } from "wouter";
import { sanitizeUrl } from "@/lib/utils";

interface SafeLinkProps extends React.ComponentPropsWithoutRef<typeof WouterLink> {
  href: string;
  className?: string;
  children: React.ReactNode;
}

/**
 * A version of the Wouter Link component that sanitizes URLs to prevent double slash issues
 * Use this component instead of the default Link when building links programmatically
 */
export function SafeLink({ href, className, children, ...props }: SafeLinkProps) {
  // Sanitize the URL to prevent double slash issues
  const sanitizedHref = sanitizeUrl(href);
  
  return (
    <WouterLink href={sanitizedHref} className={className} {...props}>
      {children}
    </WouterLink>
  );
}