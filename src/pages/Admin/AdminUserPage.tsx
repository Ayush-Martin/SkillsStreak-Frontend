import { Loading, Profile } from "@/components";
import { axiosGetRequest } from "@/config/axios";
import { AdminLayout } from "@/layouts";
import { ICourseCardData } from "@/types/courseType";
import { IUserProfile } from "@/types/userType";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

interface IProfileDetails extends IUserProfile {
  courses: Array<ICourseCardData>;
}

const AdminUserPage = () => {
  const { userId } = useParams();

  const [profile, setProfile] = useState<IProfileDetails | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const res = await axiosGetRequest(`/admin/users/${userId}`);
      if (!res) return;
      console.log(res.data);
      setProfile(res.data);
    };

    fetchUserProfile();
  }, []);

  if (!profile) return <Loading />;

  return (
    <AdminLayout>
      <Profile {...profile} />
    </AdminLayout>
  );
};

export default AdminUserPage;
