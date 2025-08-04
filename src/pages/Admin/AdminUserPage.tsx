import { getAdminUserProfile } from "@/api/user.api";
import { Loading, Profile } from "@/components";
import { AdminLayout } from "@/layouts";
import { IUserProfileDetails } from "@/types/userType";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const AdminUserPage = () => {
  const { userId } = useParams();

  const [profile, setProfile] = useState<IUserProfileDetails | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const data = await getAdminUserProfile(userId!);
      if (!data) return;
      setProfile(data);
    };

    if (userId) {
      fetchUserProfile();
    }
  }, [userId]);

  if (!profile) return <Loading />;

  return (
    <AdminLayout>
      <Profile {...profile} />
    </AdminLayout>
  );
};

export default AdminUserPage;
