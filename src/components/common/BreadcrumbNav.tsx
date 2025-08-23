import { Link, useLocation } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList } from "@/components";
import { FC, Fragment } from "react";

interface IBreadcrumbNavProps {
  breadcrumbItems: Array<{ link: string; text: string }>;
}

const BreadcrumbNav: FC<IBreadcrumbNavProps> = ({ breadcrumbItems }) => {
  const location = useLocation();

  return (
    <nav className=" px-6 py-3 rounded-xl shadow-md  backdrop-blur-md ">
      <Breadcrumb>
        <BreadcrumbList className="flex items-center flex-wrap gap-2">
          {breadcrumbItems.map(({ link, text }, index) => {
            const isActive = location.pathname === link;

            return (
              <Fragment key={link}>
                <BreadcrumbItem>
                  <Link
                    to={link}
                    className={`flex items-center gap-1 text-sm md:text-base font-medium transition-colors duration-300 ${
                      isActive
                        ? "text-cyan-400"
                        : "text-app-neutral hover:text-white"
                    }`}
                  >
                    {isActive && (
                      <span className="animate-pulse text-cyan-400">•</span>
                    )}
                    {text}
                  </Link>
                </BreadcrumbItem>

                {/* Chevron Separator */}
                {index < breadcrumbItems.length - 1 && (
                  <BreadcrumbItem>
                    <ChevronRight className="w-4 h-4 text-app-neutral opacity-60" />
                  </BreadcrumbItem>
                )}
              </Fragment>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </nav>
  );
};

export default BreadcrumbNav;
