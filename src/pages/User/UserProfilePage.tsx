import { Button, ErrorText, Input, Textarea, UserSidebar } from "@/components";
import { UserLayout } from "@/layouts";
import { Briefcase, Pencil, Plus, Save, Trash2, X } from "lucide-react";
import { FC, JSX, useContext, useState } from "react";
import { FaEdit } from "react-icons/fa";
import {
  FaFacebook,
  FaGithub,
  FaInstagram,
  FaLinkedin,
  FaUpload,
  FaUser,
  FaYoutube,
} from "react-icons/fa6";
import useEditProfile from "@/hooks/useEditProfile";
import EditProfileContext from "@/context/EditProfileContext";
import { useFieldArray } from "react-hook-form";
import { useSelector } from "react-redux";
import { RootReducer } from "@/store";
import { CgWebsite } from "react-icons/cg";

interface EditProfileImageProps {
  image?: string;
  onImageChange: (imageUrl: string) => void;
}

const UserProfilePage = () => {
  const {
    register,
    editProfile,
    watch,
    setValue,
    clearErrors,
    setError,
    errors,
    trigger,
    control,
    profileImageChangeHandler,
  } = useEditProfile();

  return (
    <UserLayout>
      <div className="relative flex min-h-screen">
        <UserSidebar />
        <div className="w-full mt-5 ml-0 text-white pt-7 md:ml-64 md:mt-0 py-10 xl:px-40">
          <EditProfileContext.Provider
            value={{
              register,
              errors,
              setValues: setValue,
              trigger,
              watch,
              control,
              clearErrors,
              setError,
              setValue,
              profileImageChangeHandler,
            }}
          >
            <div className="max-w-6xl mx-auto">
              <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold text-white">Edit Profile</h1>
                <p className="text-gray-400 mt-2">
                  Customize your professional presence
                </p>
              </div>

              <form onSubmit={editProfile()} className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-1">
                    <EditProfileImage image={""} onImageChange={() => {}} />
                  </div>
                  <div className="lg:col-span-2">
                    <EditNameSocialLinks />
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-8">
                    <EditableText
                      label="bio"
                      placeholder="Tell us about yourself..."
                    />
                    <EditExperience />
                    <EditSkills />
                  </div>
                  <div className="lg:col-span-1 space-y-6">
                    <EditableText label="location" />
                    <EditableText label="company" />
                    <EditableText label="position" />
                    <EditableText label="education" />
                  </div>
                </div>

                <div className="flex justify-center pt-8">
                  <Button
                    type="submit"
                    className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    <Save className="w-5 h-5 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </form>
            </div>
          </EditProfileContext.Provider>
        </div>
      </div>
    </UserLayout>
  );
};

const EditProfileImage: FC<EditProfileImageProps> = () => {
  const { profileImage } = useSelector((state: RootReducer) => state.user);
  const { profileImageChangeHandler } = useContext(EditProfileContext)!;

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-white backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="flex flex-col items-center space-y-6">
        <div className="relative group">
          <div className="w-40 h-40 rounded-full overflow-hidden bg-white/5 border-4 border-white/10 shadow-2xl">
            {profileImage ? (
              <img
                src={profileImage}
                alt="Profile"
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <FaUser className="text-gray-400 text-6xl" />
              </div>
            )}
          </div>
          <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <FaUpload className="text-white text-2xl" />
          </div>
        </div>

        <label className="flex items-center gap-3 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-full cursor-pointer transition-all duration-300 transform hover:scale-105 shadow-lg">
          <FaUpload size={16} />
          <span className="font-medium">Change Photo</span>
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={profileImageChangeHandler}
          />
        </label>
      </div>
    </div>
  );
};

const iconMap: Record<string, JSX.Element> = {
  github: <FaGithub className="text-gray-300" />,
  linkedin: <FaLinkedin className="text-blue-400" />,
  instagram: <FaInstagram className="text-pink-400" />,
  facebook: <FaFacebook className="text-blue-600" />,
  youtube: <FaYoutube className="text-red-500" />,
  website: <CgWebsite className="text-gray-400" />,
};

const platforms = [
  "github",
  "linkedin",
  "instagram",
  "facebook",
  "youtube",
  "website",
] as const;

export const EditNameSocialLinks: FC = () => {
  const { register, watch, errors } = useContext(EditProfileContext)!;
  const { email } = useSelector((state: RootReducer) => state.user);

  const [editMode, setEditMode] = useState(false);
  const socialLinks = watch("socialLinks");

  const toggleEditMode = () => {
    setEditMode((prev) => !prev);
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-white shadow-lg backdrop-blur-sm hover:shadow-xl transition-all duration-300">
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-purple-400 mb-2">
              Username
            </label>
            <Input
              {...register("username")}
              className="bg-app-border text-white border-white/10 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 rounded-lg transition-all duration-300"
            />
            {errors.username?.message && (
              <ErrorText error={String(errors.username.message)} />
            )}
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-purple-400 mb-2">
              Email
            </label>
            <Input
              value={email}
              readOnly
              className="bg-app-primary text-white opacity-80 cursor-not-allowed border-white/10 rounded-lg"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="block text-sm font-medium text-purple-400">
              Social Links
            </label>
            <button
              type="button"
              onClick={toggleEditMode}
              className="flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300 transition-colors duration-200 hover:bg-white/5 px-3 py-1 rounded-lg"
            >
              <FaEdit className="text-lg" />
              {editMode ? "Done" : "Edit"}
            </button>
          </div>

          {!editMode ? (
            <div className="flex flex-wrap gap-4">
              {platforms.filter((key) => socialLinks?.[key]?.trim()).length ? (
                platforms
                  .filter((key) => socialLinks?.[key]?.trim())
                  .map((key) => (
                    <a
                      key={key}
                      href={socialLinks[key]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 flex items-center justify-center bg-[#141824] hover:bg-app-border rounded-xl transition-all duration-300 text-2xl hover:scale-110 shadow-md hover:shadow-lg"
                    >
                      {iconMap[key]}
                    </a>
                  ))
              ) : (
                <p className="text-sm text-gray-500 py-4 italic">
                  No social links added yet.
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {platforms.map((platform) => (
                <div key={platform} className="space-y-2">
                  <div className="flex items-center gap-4 p-3 bg-app-border/50 rounded-lg">
                    <div className="w-8 h-8 flex items-center justify-center text-xl">
                      {iconMap[platform]}
                    </div>
                    <Input
                      placeholder={`Enter ${platform} URL`}
                      {...register(`socialLinks.${platform}`)}
                      className="bg-app-border text-white flex-1 border-white/10 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 rounded-lg transition-all duration-300"
                    />
                  </div>
                  {errors.socialLinks?.[platform]?.message && (
                    <ErrorText
                      error={String(errors.socialLinks[platform].message)}
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface EditableTextProps {
  label: "bio" | "location" | "company" | "position" | "education";
  placeholder?: string;
}

const EditableText: FC<EditableTextProps> = ({
  label,
  placeholder = "Type here...",
}) => {
  const { register, errors } = useContext(EditProfileContext)!;

  const labelDisplayMap = {
    bio: "About Me",
    location: "Location",
    company: "Company",
    position: "Position",
    education: "Education",
  };

  return (
    <div
      className={`bg-white/5 border border-white/10 rounded-2xl p-6 text-white shadow-lg backdrop-blur-sm hover:shadow-xl transition-all duration-300 ${
        label === "bio" ? "min-h-48" : ""
      }`}
    >
      <label className="block text-sm font-medium text-purple-400 mb-4">
        {labelDisplayMap[label]}
      </label>
      {label === "bio" ? (
        <Textarea
          {...register(label)}
          placeholder={placeholder}
          className="flex-1 resize-none bg-app-border text-white placeholder:text-gray-400 rounded-xl px-4 py-3 text-sm border border-white/10 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 min-h-32"
        />
      ) : (
        <Input
          placeholder={placeholder}
          {...register(label)}
          className="bg-app-border text-white placeholder:text-gray-400 rounded-xl text-sm border border-white/10 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
        />
      )}
      {errors[label]?.message && (
        <div className="mt-2">
          <ErrorText error={errors[label]?.message} />
        </div>
      )}
    </div>
  );
};

const EditExperience = () => {
  const { control, register, errors, trigger } =
    useContext(EditProfileContext)!;

  const {
    fields: experiences,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "experiences",
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const [newExperience, setNewExperience] = useState({
    company: "",
    position: "",
    duration: "",
    description: "",
  });

  const handleAddExperience = async () => {
    if (!newExperience.company.trim() || !newExperience.position.trim()) {
      return;
    }

    append({
      ...newExperience,
      id: Date.now().toString(),
    });

    setNewExperience({
      company: "",
      position: "",
      duration: "",
      description: "",
    });
    setShowAddForm(false);
    await trigger("experiences");
  };

  const handleInputChange = (
    field: keyof typeof newExperience,
    value: string
  ) => {
    setNewExperience((prev) => ({ ...prev, [field]: value }));
  };

  const saveEdit = async () => {
    setEditingId(null);
    await trigger("experiences");
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-white shadow-lg backdrop-blur-sm hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-bold text-purple-400 flex items-center gap-3">
          <Briefcase className="w-6 h-6" />
          Experience
        </h2>
        {!showAddForm && (
          <Button
            type="button"
            onClick={() => setShowAddForm(true)}
            size="sm"
            variant="v1"
            className="bg-purple-600 hover:bg-purple-700 text-white border-none shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Experience
          </Button>
        )}
      </div>

      {typeof errors.experiences === "string" && (
        <div className="mb-6">
          <ErrorText error={errors.experiences} />
        </div>
      )}

      <div className="space-y-8">
        {experiences.length > 0 ? (
          experiences.map((exp, index) => {
            const isEditing = editingId === exp.id;

            return (
              <div
                key={exp.id}
                className="relative border-l-4 border-purple-500/50 pl-8 hover:border-purple-400 transition-colors duration-300"
              >
                <div className="absolute left-[-12px] top-4 w-6 h-6 rounded-full bg-purple-600 border-2 border-white/20 shadow-lg" />

                <div className="bg-app-primary/80 p-6 rounded-xl border border-white/10 hover:bg-app-primary transition-all duration-300">
                  {isEditing ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                          {...register(`experiences.${index}.position`, {
                            required: "Position is required",
                          })}
                          defaultValue={exp.position}
                          placeholder="Position"
                          className="bg-[#1c1f2b] text-white border-white/10 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 rounded-lg transition-all duration-300"
                        />
                        <Input
                          {...register(`experiences.${index}.company`, {
                            required: "Company is required",
                          })}
                          defaultValue={exp.company}
                          placeholder="Company"
                          className="bg-[#1c1f2b] text-white border-white/10 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 rounded-lg transition-all duration-300"
                        />
                        <Input
                          {...register(`experiences.${index}.duration`)}
                          defaultValue={exp.duration}
                          placeholder="Duration"
                          className="bg-[#1c1f2b] text-white border-white/10 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 rounded-lg transition-all duration-300"
                        />
                      </div>
                      <Textarea
                        {...register(`experiences.${index}.description`)}
                        defaultValue={exp.description}
                        placeholder="Description"
                        className="bg-[#1c1f2b] text-white border-white/10 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 rounded-lg transition-all duration-300"
                      />
                      <div className="flex justify-end gap-3">
                        <Button
                          type="button"
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                          onClick={saveEdit}
                        >
                          <Save className="w-4 h-4 mr-2" />
                          Save
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="v2"
                          onClick={() => setEditingId(null)}
                          className=" transition-all duration-300"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-xl font-semibold text-white mb-1">
                            {exp.position}
                          </h4>
                          <p className="text-lg text-purple-300 font-medium mb-1">
                            {exp.company}
                          </p>
                          <p className="text-sm text-gray-400">
                            {exp.duration}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            className="hover:bg-white/10 transition-all duration-300"
                            onClick={() => setEditingId(exp.id)}
                          >
                            <Pencil className="w-4 h-4 text-white" />
                          </Button>
                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            className="hover:bg-white/10 transition-all duration-300"
                            onClick={() => remove(index)}
                          >
                            <Trash2 className="w-4 h-4 text-red-400" />
                          </Button>
                        </div>
                      </div>
                      {exp.description && (
                        <p className="text-sm text-gray-300 leading-relaxed">
                          {exp.description}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-16 opacity-60">
            <Briefcase className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-400 text-lg">
              Add your work experience to showcase your career journey
            </p>
          </div>
        )}
      </div>

      {showAddForm && (
        <div className="mt-8 bg-app-primary/80 p-6 rounded-xl border border-white/10 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="Position"
              value={newExperience.position}
              onChange={(e) => handleInputChange("position", e.target.value)}
              className="bg-[#1c1f2b] text-white border-white/10 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 rounded-lg transition-all duration-300"
            />
            <Input
              placeholder="Company"
              value={newExperience.company}
              onChange={(e) => handleInputChange("company", e.target.value)}
              className="bg-[#1c1f2b] text-white border-white/10 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 rounded-lg transition-all duration-300"
            />
            <Input
              placeholder="Duration"
              value={newExperience.duration}
              onChange={(e) => handleInputChange("duration", e.target.value)}
              className="bg-[#1c1f2b] text-white border-white/10 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 rounded-lg transition-all duration-300"
            />
          </div>
          <Textarea
            placeholder="Description (optional)"
            value={newExperience.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            className="bg-[#1c1f2b] text-white border-white/10 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 rounded-lg transition-all duration-300"
          />
          <div className="flex gap-3 justify-end">
            <Button
              type="button"
              onClick={handleAddExperience}
              size="sm"
              className="bg-purple-600 hover:bg-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
            <Button
              type="button"
              onClick={() => setShowAddForm(false)}
              size="sm"
              variant="outline"
              className="text-white border-white/20 hover:bg-white/10 transition-all duration-300"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

const EditSkills = () => {
  const { watch, setValue, trigger, setError, clearErrors, errors } =
    useContext(EditProfileContext)!;

  const skills: string[] = watch("skills");
  const [newSkill, setNewSkill] = useState("");

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newSkill.trim();
    clearErrors("skills");

    if (!trimmed) {
      setError("skills", { message: "Skill cannot be empty" });
      return;
    }

    if (skills.includes(trimmed)) {
      setError("skills", { message: "This skill already exists" });
      return;
    }

    const updated = [...skills, trimmed];
    setValue("skills", updated);
    await trigger("skills");
    setNewSkill("");
  };

  const handleRemoveSkill = async (skillToRemove: string) => {
    const updated = skills.filter((s) => s !== skillToRemove);
    setValue("skills", updated);
    await trigger("skills");
    clearErrors("skills");
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-white shadow-lg backdrop-blur-sm hover:shadow-xl transition-all duration-300">
      <h3 className="text-xl font-bold text-purple-400 mb-6">Skills</h3>

      {errors.skills && typeof errors.skills.message === "string" && (
        <div className="mb-6">
          <ErrorText error={errors.skills.message} />
        </div>
      )}

      <div className="flex flex-wrap gap-3 mb-6">
        {skills.map((skill, index) => (
          <div
            key={skill}
            className="flex items-center bg-purple-600/20 text-sm text-white px-4 py-2 rounded-full border border-purple-500/30 hover:bg-purple-600/30 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
            style={{
              animationDelay: `${index * 0.1}s`,
            }}
          >
            <span className="font-medium">{skill}</span>
            <button
              type="button"
              onClick={() => handleRemoveSkill(skill)}
              className="ml-3 text-white hover:text-red-400 transition-colors duration-200"
              aria-label={`Remove ${skill}`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <Input
          name="newSkill"
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          placeholder="Add a new skill..."
          className="bg-[#1c1f2b] text-white border-white/10 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 rounded-lg transition-all duration-300 flex-1"
        />
        <Button
          onClick={handleAddSkill}
          size="sm"
          className="bg-purple-600 hover:bg-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add
        </Button>
      </div>
    </div>
  );
};

export default UserProfilePage;
