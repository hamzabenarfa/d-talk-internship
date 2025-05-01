import UserSettings from "../../../components/user-settings";

const Profile = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Mon Profil</h1>
      <UserSettings />
    </div>
  );
};

export default Profile;
