import Link from "next/link";
import { AiFillFacebook } from "react-icons/ai";
import { FaLinkedinIn, FaTwitter } from "react-icons/fa";
import { TiSocialInstagram } from "react-icons/ti";
import SocialLinks from "./SocialLinks";

const socials = [
  {
    link: "https://www.facebook.com/niteonhq?mibextid=ZbWKwL",
    icon: <AiFillFacebook className="w-4 h-4 text-white" />,
  },
  {
    link: "https://www.linkedin.com/company/niteonhq/",
    icon: <FaLinkedinIn className="w-5 h-5 text-white" />,
  },
  {
    link: "https://twitter.com/niteonhq?t=iOweKo8De6nmGTKryCkq8w&s=09",
    icon: <FaTwitter className="w-5 h-5 text-white" />,
  },
  {
    link: "https://instagram.com/niteonhq?igshid=MzMyNGUyNmU2YQ==",
    icon: <TiSocialInstagram className="w-5 h-5 text-white" />,
  },
];

interface MoreLinksProps {
  heading: string;
  links: {
    title: string;
    link?: string;
    email?: boolean;
    tel?: boolean;
  }[];
}

const MoreLinks = ({ heading, links }: MoreLinksProps) => {
  return (
    <span>
      <h4 className="text-white text-t14 lg:text-t16 font-medium mb-[0.95rem] font-roboto">
        {heading}
      </h4>
      <ul>
        {links.map((link) => (
          <li
            key={link.title}
            className="block mb-[0.95rem] text-t14 last-of-type:mb-0 font-roboto"
          >
            {link?.email ? (
              <a href={`mailto:${link.title}`}>{link.title}</a>
            ) : link?.tel ? (
              <a href={`tel:${link.title}`}>{link.title}</a>
            ) : (
              <span className={"first-letter:capitalize block"}>
                {link?.link ? (
                  <Link className="text-t14" href={link?.link}>
                    {link.title === "faqs" ? "FAQs" : link?.title}
                  </Link>
                ) : (
                  link.title
                )}
              </span>
            )}
          </li>
        ))}
      </ul>
      {heading === "Contact Us" && (
        <span className="block  mt-[0.95rem]">
          <SocialLinks socials={socials} />
        </span>
      )}
    </span>
  );
};

export default MoreLinks;
