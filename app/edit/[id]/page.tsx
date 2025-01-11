import EditForm from "@/components/edit-form"
import { getImagesById } from "@/lib/data"
import { notFound } from "next/navigation";
import { GetServerSideProps } from "next";

interface Params {
  id: string;
}

interface Props {
  params: Params;
}

const EditPage: React.FC<Props> = async ({ params }) => {
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

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
  const { params } = context;
  return {
    props: {
      params: params as unknown as Params,
    },
  };
};

export default EditPage;