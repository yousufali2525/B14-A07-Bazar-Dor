import UpdateProfileForm from "@/components/UpdateProfileForm";
import { requireSession } from "@/lib/session";
export default async function UpdateProfilePage() {
  const { user } = await requireSession("/profile/update");
  return (
    <div className="flex justify-center px-4 py-12">
      <UpdateProfileForm initialName={user.name ?? ""} />
    </div>
  );
}
