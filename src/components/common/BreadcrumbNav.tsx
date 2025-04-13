import { Link } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui";
import { FC, Fragment } from "react";

interface IBreadcrumbNavProps {
  breadcrumbItems: Array<{ link: string; text: string }>;
}

const BreadcrumbNav: FC<IBreadcrumbNavProps> = ({ breadcrumbItems }) => {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbItems.map(({ link, text }) => (
          <Fragment key={link}>
            <BreadcrumbItem>
              <Link to={link} className="md:text-lg text-app-neutral">
                {text}
              </Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default BreadcrumbNav;
