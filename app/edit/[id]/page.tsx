import { useRouter } from "next/router";
import EditForm from "@/components/edit-form";
import { getImagesById } from "@/lib/data";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";

interface ImageData {
  id: string;
  title: string;
  image: string;
  createdAt: Date;
  updatedAt: Date;
}

const EditPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [data, setData] = useState<ImageData | null>(null);

  useEffect(() => {
    if (id) {
      getImagesById(id as string).then((result) => {
        if (!result) {
          notFound();
        } else {
          setData(result[0]);
        }
      });
    }
  }, [id]);

  if (!data) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="bg-white rounded-sm shadow p-8">
        <h1 className="text-2xl font-bold mb-5">Update Image</h1>
        <EditForm data={data} />
      </div>
    </div>
  );
};

export default EditPage;
