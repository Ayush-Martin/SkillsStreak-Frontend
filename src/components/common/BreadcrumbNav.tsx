import { Link } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui";
import { FC } from "react";

interface IBreadcrumbNavProps {
  breadcrumbItems: Array<{ link: string; text: string }>;
}

const BreadcrumbNav: FC<IBreadcrumbNavProps> = ({ breadcrumbItems }) => {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbItems.map(({ link, text }) => (
          <>
            <BreadcrumbItem>
              <Link to={link} className="md:text-lg text-app-neutral">
                {text}
              </Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
          </>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default BreadcrumbNav;
