import { FOOTER_SECTION } from "@/constants/sections";
const Footer = () => {
  return (
    <footer className="bg-[#031019] text-white py-10 px-8 sm:px-16 lg:px-24 xl:px-32 border-t border-gray-700">
      <div className="grid grid-cols-1 gap-8 mx-auto max-w-7xl sm:grid-cols-2 lg:grid-cols-4">
        {/* Links Section */}
        <div>
          <h3 className="mb-4 text-lg font-semibold">Quick Links</h3>
          <ul className="space-y-2">
            {FOOTER_SECTION.links.map((link) => (
              <li key={link.title}>
                <a
                  href={link.to}
                  className="text-sm transition-colors duration-300 hover:text-app-accent"
                >
                  {link.title}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* About Section */}
        <div>
          <h3 className="mb-4 text-lg font-semibold">About Us</h3>
          <p className="text-sm leading-relaxed">{FOOTER_SECTION.about}</p>
        </div>

        {/* Contact Section */}
        <div>
          <h3 className="mb-4 text-lg font-semibold">Contact Us</h3>
          <p className="text-sm">
            Email us at:{" "}
            <a
              href={`mailto:${FOOTER_SECTION.contact.email}`}
              className="text-app-accent hover:underline"
            >
              {FOOTER_SECTION.contact.email}
            </a>
          </p>
        </div>

        {/* Social Media Section */}
        <div>
          <h3 className="mb-4 text-lg font-semibold">Follow Us</h3>
          <div className="flex space-x-6">
            {FOOTER_SECTION.socialMedia.map((social) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-2xl transition-colors duration-300 hover:text-app-accent"
              >
                <social.icon />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="mt-8 border-t border-gray-700"></div>

      {/* Footer Bottom */}
      <div className="flex flex-col items-center justify-between mx-auto mt-8 max-w-7xl sm:flex-row">
        <p className="text-sm text-center text-gray-400 sm:text-left">
          {FOOTER_SECTION.copyright}
        </p>
        <p className="mt-4 text-sm text-center text-gray-400 sm:mt-0 sm:text-right">
          Made by Ayush Martin
        </p>
      </div>
    </footer>
  );
};

export default Footer;
