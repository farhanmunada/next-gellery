"use server";
import { z } from "zod";
import {put, del} from "@vercel/blob"
import {prisma} from '@/lib/prisma';
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getImagesById } from "@/lib/data";

const UploadSchema = z.object({
    title: z.string().min(1),
    image: z
        .instanceof(File)
        .refine((file) => file.size > 0, {message: 'Image is required'})
        .refine((file) => file.size === 0 || file.type.startsWith('image/'), {message: 'File must be an image'})
        .refine((file) => file.size < 5000000, {message: 'Image must be smaller than 5mb'}),
});

const EditSchema = z.object({
    title: z.string().min(1),
    image: z
        .instanceof(File)
        .refine((file) => file.size === 0 || file.type.startsWith('image/'), {message: 'File must be an image'})
        .refine((file) => file.size < 5000000, {message: 'Image must be smaller than 5mb'})
        .optional(),
});

export const uploadImage = async (prevState: unknown, formData: FormData) => {
    const validatedFields = UploadSchema.safeParse(
        Object.fromEntries(formData.entries())
    );

    if (!validatedFields.success) {
        return{
            error: validatedFields.error.flatten().fieldErrors,
        }
    }

    const {title, image} = validatedFields.data;
    const {url} = await put(image.name, image, {
        access: 'public',
        multipart: true,
    });

    try {
        await prisma.upload.create({
            data: {
                title,
                image: url,
            },
        });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
        return {message : "Failed to create data"}
    };

    revalidatePath('/');
    redirect('/');
};

// Update Image
export const updateImage = async (
    id: string, 
    prevState: unknown, 
    formData: FormData
) => {
    const validatedFields = EditSchema.safeParse(
        Object.fromEntries(formData.entries())
    );

    if (!validatedFields.success) {
        return{
            error: validatedFields.error.flatten().fieldErrors,
        }
    }

    const data = await getImagesById(id);
    if(!data || data.length === 0){
        return {message: "Image not found"}
    }

    const {title, image} = validatedFields.data;
    let imagePath;
    if (!image || image.size <= 0){
        imagePath = data[0].image;
    } else {
        await del(data[0].image);
        const {url} = await put(image.name, image, {
            access: 'public',
            multipart: true,
        });
        imagePath = url;
    }


    try {
        await prisma.upload.update({
            data: {
                title,
                image: imagePath,
            },
            where: {
                id,
            },
        });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
        return {message : "Failed to update data"}
    };

    revalidatePath('/');
    redirect('/');
};


// Delete Image

export const deleteImage = async (id: string) => {
    const data = await getImagesById(id);
    if(!data || data.length === 0){
        return {message: "Image not found"}
    }

    await del(data[0].image);

    try {
        await prisma.upload.delete({
            where: {
                id,
            },
        });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
        return {message: "Failed to delete image"}
    }

    revalidatePath('/');
};