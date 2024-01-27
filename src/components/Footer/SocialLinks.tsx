import React from "react";

interface SocialLinksProps {
  socials: { link: string; icon: JSX.Element }[];
}

function SocialLinks({ socials }: SocialLinksProps) {
  return (
    <span className="block">
      <ul className="flex items-center space-x-[1.33rem]">
        {socials.map(({ icon, link }) => (
          <li
            key={link}
            className="grid place-content-center bg-white/10 rounded-full h-[2.37rem] w-[2.37rem] overflow-hidden"
          >
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full h-full"
            >
              {icon}
            </a>
          </li>
        ))}
      </ul>
    </span>
  );
}

export default SocialLinks;
