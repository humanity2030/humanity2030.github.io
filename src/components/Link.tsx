import type { JSX } from "preact";
import { useLocation } from "preact-iso";

interface LinkProps {
  href: string;
  children: JSX.Element | string | React.ReactNode;
  className?: string;
  replace?: boolean;
}

export const Link = ({
  href,
  children,
  className,
  replace = false,
}: LinkProps) => {
  const { route } = useLocation();

  const handleClick = (e: MouseEvent) => {
    e.preventDefault();
    route(href, replace);
  };

  return (
    <a href={href} onClick={handleClick} className={className}>
      {children}
    </a>
  );
};
