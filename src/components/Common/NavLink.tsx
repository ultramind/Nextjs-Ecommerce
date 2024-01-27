import Link from "next/link";
import { useRouter } from "next/router";

interface NavLinkProps {
  href: string;
  exact?: boolean;
  index?: boolean;
  children: React.ReactNode;
  [x: string]: any;
}

NavLink.defaultProps = {
  exact: false,
};

function NavLink({ href, exact, children, index, ...props }: NavLinkProps) {
  const { pathname } = useRouter();
  const isActive = exact ? pathname === href : pathname.startsWith(href);

  if (isActive && !exact && !index) {
    props.className += " !text-tangerine";
  }

  if (index) {
    const isActive = pathname === href;
    if (isActive) {
      props.className += " !text-tangerine";
    }
  }

  return (
    <Link href={href} {...props}>
      {children}
    </Link>
  );
}

export default NavLink;
