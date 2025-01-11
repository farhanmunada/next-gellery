import EditForm from "@/components/edit-form";
import { getImagesById } from "@/lib/data";
import { notFound } from "next/navigation";

interface Params {
  id: string;
}


const EditPage = async ({ params }: { params: Params }) => {
  const data = await getImagesById(params.id);

  if (!data) return notFound();

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="bg-white rounded-sm shadow p-8">
        <h1 className="text-2xl font-bold mb-5">Update Image</h1>
        <EditForm data={data[0]} />
      </div>
    </div>
  );
};

export default EditPage;
