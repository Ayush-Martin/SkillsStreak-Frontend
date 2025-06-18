import { ProfileImage, UserProfile, UserSidebar } from "@/components";
import { Button, Card } from "@/components/ui";
import { UserLayout } from "@/layouts";
import { MdEdit } from "@/assets/icons";
import { Mail, Briefcase, FileText } from "lucide-react";
import { RootReducer } from "@/store";
import { useState } from "react";
import { useSelector } from "react-redux";

const Profile = () => {
  const { username, email, profileImage, about } = useSelector(
    (state: RootReducer) => state.user
  );
  const [editProfile, setEditProfile] = useState(false);

  return (
    <UserLayout>
      <div className="relative flex">
        <UserSidebar />
        <div className="w-full mt-10 ml-0 text-white md:ml-64 md:mt-0 p-5 relative">
          {editProfile && (
            <UserProfile
              about={about}
              email={email}
              profileImage={profileImage}
              username={username}
              areaOfInterest={[]}
              close={() => setEditProfile(false)}
            />
          )}
          <div className="max-w-2xl mx-auto">
            <Card className="bg-[#111827] backdrop-blur border-gray-700/50 shadow-2xl overflow-hidden">
              {/* Profile Content */}
              <div className="px-8 py-4">
                {/* Profile Image */}
                <div className="flex  items-center mb-8 justify-center">
                  <ProfileImage
                    profileImage={profileImage}
                    size={32}
                    textSize="5xl"
                  />
                </div>

                {/* User Info */}
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-bold text-white mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    {username}
                  </h1>
                  <div className="flex items-center justify-center gap-2 text-gray-300 mb-4">
                    <Mail size={16} />
                    <span className="text-sm">{email}</span>
                  </div>
                </div>

                {/* Profile Details */}
                <div className="space-y-6">
                  {/* Experience */}
                  <div className="bg-gray-700/50 rounded-xl p-6 border border-gray-600/30">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-blue-500/20 rounded-lg">
                        <Briefcase className="text-blue-400" size={20} />
                      </div>
                      <h3 className="text-lg font-semibold text-white">
                        Experience
                      </h3>
                    </div>
                    <p className="text-gray-300 leading-relaxed">
                      {"dfdfdfdf"}
                    </p>
                  </div>

                  {/* About */}
                  <div className="bg-gray-700/50 rounded-xl p-6 border border-gray-600/30">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-purple-500/20 rounded-lg">
                        <FileText className="text-purple-400" size={20} />
                      </div>
                      <h3 className="text-lg font-semibold text-white">
                        About
                      </h3>
                    </div>
                    <p className="text-gray-300 leading-relaxed">{about}</p>
                  </div>

                  <Button
                    className="w-full mt-4 flex border border-gray-600/30"
                    onClick={() => setEditProfile(true)}
                  >
                    <MdEdit className="mr-2" size={20} />
                    Edit Profile
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default Profile;
